import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Allowed MIME types
const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg', 'image/jpg', 'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file');
    const category = formData.get('category') || 'other';
    const description = formData.get('description') || '';

    if (!file || typeof file === 'string') {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json({ error: 'File type not allowed. Please upload PDF, JPG, PNG, or Word documents.' }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return Response.json({ error: 'File too large. Maximum 10 MB allowed.' }, { status: 400 });
    }

    // Upload to private storage
    const uploadResult = await base44.asServiceRole.integrations.Core.UploadPrivateFile({ file });
    const fileUri = uploadResult.file_uri;

    // Save document record
    const doc = await base44.asServiceRole.entities.GuestDocument.create({
      user_email: user.email,
      category,
      description,
      file_uri: fileUri,
      original_filename: file.name,
      file_size_bytes: file.size,
      mime_type: file.type,
      status: 'uploaded',
    });

    // Notify via email
    base44.asServiceRole.integrations.Core.SendEmail({
      to: 'info@krone-ammesso.de',
      from_name: 'Krone Gästeportal',
      subject: `[Dokument] ${user.email} — ${category} — ${file.name}`,
      body: `<p>Ein Gast hat ein Dokument hochgeladen.</p><ul><li>Gast: ${user.email}</li><li>Kategorie: ${category}</li><li>Datei: ${file.name}</li><li>Größe: ${Math.round(file.size / 1024)} KB</li>${description ? `<li>Beschreibung: ${description}</li>` : ''}</ul>`,
    }).catch(() => {});

    return Response.json({ success: true, document_id: doc.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});