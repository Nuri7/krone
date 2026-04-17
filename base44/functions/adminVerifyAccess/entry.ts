import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Verify admin access for a user against allowlist.
 * Returns admin status, email, and any warnings.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get settings
    const settings = await base44.asServiceRole.entities.SiteSettings.filter(
      { key: 'global' },
      undefined,
      1
    );

    if (!settings || !settings[0]) {
      console.error('Settings not found');
      return Response.json(
        { error: 'System not configured' },
        { status: 500 }
      );
    }

    const adminEmails = settings[0].super_admin_emails || [];
    const isAdmin = adminEmails.includes(user.email) || user.role === 'admin';

    if (!isAdmin) {
      // Log unauthorized access attempt
      await base44.asServiceRole.entities.AdminAuditEntry.create({
        admin_email: user.email,
        action: 'unauthorized_admin_access_attempt',
        entity_type: 'Unauthorized',
        entity_id: user.email,
        change_summary: `Unauthorized admin access attempt by ${user.email}`,
        performed_at: new Date().toISOString(),
        ip_address: req.headers.get('x-forwarded-for') || 'unknown'
      }).catch(() => {});

      return Response.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return Response.json({
      success: true,
      is_admin: true,
      email: user.email,
      full_name: user.full_name,
      role: user.role
    });
  } catch (error) {
    console.error('adminVerifyAccess error:', error.message);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});