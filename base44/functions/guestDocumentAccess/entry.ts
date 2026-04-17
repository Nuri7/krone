import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Get secure signed URL for guest document download.
 * Enforces: user owns document OR user is admin.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { document_id } = await req.json();

    if (!document_id) {
      return Response.json({ error: 'Document ID required' }, { status: 400 });
    }

    // Get document
    const documents = await base44.asServiceRole.entities.GuestDocument.filter(
      { id: document_id },
      undefined,
      1
    );

    if (!documents || documents.length === 0) {
      return Response.json({ error: 'Document not found' }, { status: 404 });
    }

    const document = documents[0];

    // Check authorization: own email OR admin
    const isOwner = document.user_email === user.email.toLowerCase();
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return Response.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Generate signed URL (5 min expiry)
    const signedUrl = await base44.integrations.Core.CreateFileSignedUrl({
      file_uri: document.file_uri,
      expires_in: 300
    });

    return Response.json({
      success: true,
      signed_url: signedUrl.signed_url,
      filename: document.original_filename,
      expires_in_seconds: 300
    });
  } catch (error) {
    console.error('Document access error:', error.message);
    return Response.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
});