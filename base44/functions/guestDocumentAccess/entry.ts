import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Generates a short-lived signed URL for a guest's own document
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { document_id } = await req.json();
    if (!document_id) return Response.json({ error: 'document_id required' }, { status: 400 });

    // Fetch document — verify ownership
    const docs = await base44.asServiceRole.entities.GuestDocument.filter({ id: document_id });
    if (docs.length === 0) return Response.json({ error: 'Document not found' }, { status: 404 });

    const doc = docs[0];

    // Security: only owner or admin can access
    const ADMIN_EMAILS = ['oammesso@gmail.com', 'omarouardaoui0@gmail.com', 'norevok@gmail.com'];
    const isAdmin = ADMIN_EMAILS.includes(user.email) || user.role === 'admin';
    if (doc.user_email !== user.email && !isAdmin) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Generate signed URL (5 min expiry)
    const result = await base44.asServiceRole.integrations.Core.CreateFileSignedUrl({
      file_uri: doc.file_uri,
      expires_in: 300,
    });

    return Response.json({ signed_url: result.signed_url, filename: doc.original_filename });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});