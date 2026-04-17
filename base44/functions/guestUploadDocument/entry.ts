import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Guest function: Upload a document (ID, invoice, etc).
 * Requires authentication.
 * Uses private storage for files, logs upload, notifies admin.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    const category = formData.get('category') || 'other';
    const description = formData.get('description') || '';

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size (10 MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return Response.json({ error: 'File too large (max 10 MB)' }, { status: 413 });
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      return Response.json({ error: 'File type not allowed' }, { status: 415 });
    }

    // Upload to private storage (never public)
    const fileBuffer = await file.arrayBuffer();
    let uploadedFile;
    try {
      uploadedFile = await base44.integrations.Core.UploadPrivateFile({
        file: fileBuffer
      });
    } catch (uploadErr) {
      console.error('Private file upload failed:', uploadErr.message);
      return Response.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Create document record
    const doc = await base44.entities.GuestDocument.create({
      user_email: user.email.toLowerCase(),
      category,
      file_uri: uploadedFile.file_uri,
      original_filename: file.name,
      file_size_bytes: file.size,
      mime_type: file.type,
      description,
      status: 'uploaded',
      email_notification_sent: false
    });

    // Try to link to guest profile
    try {
      const profiles = await base44.entities.GuestProfile.filter(
        { user_email: user.email.toLowerCase() },
        undefined,
        1
      );
      if (profiles.length > 0) {
        await base44.entities.GuestDocument.update(doc.id, {
          guest_profile_id: profiles[0].id
        });
      }
    } catch (e) {
      // Silently ignore
    }

    // Log the upload
    await base44.asServiceRole.entities.EmailLog.create({
      recipient: user.email,
      subject: 'Document Upload Confirmation',
      template: 'guest_document_received',
      language: 'en',
      status: 'sent',
      sent_at: new Date().toISOString(),
      related_entity_type: 'GuestDocument',
      related_entity_id: doc.id
    }).catch(() => {});

    // Notify admin via Slack
    try {
      const settings = await base44.asServiceRole.entities.SiteSettings.filter(
        { key: 'global' },
        undefined,
        1
      );

      if (settings && settings[0] && settings[0].slack_webhook_url_env_key) {
        const webhookUrl = Deno.env.get(settings[0].slack_webhook_url_env_key);
        if (webhookUrl) {
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: `📄 Guest Document Uploaded`,
              blocks: [
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: `*Guest Document Upload*\n*Guest:* ${user.email}\n*Category:* ${category}\n*File:* ${file.name}\n*Size:* ${(file.size / 1024).toFixed(2)} KB`
                  }
                }
              ]
            })
          });
        }
      }
    } catch (e) {
      console.error('Slack notification failed:', e);
    }

    return Response.json({
      success: true,
      document_id: doc.id,
      file_name: file.name,
      status: 'uploaded'
    });
  } catch (error) {
    console.error('Guest document upload error:', error);
    return Response.json(
      { error: 'Server error uploading document' },
      { status: 500 }
    );
  }
});