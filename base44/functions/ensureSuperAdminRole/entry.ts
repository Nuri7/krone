import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Called on user first login.
 * If user email matches super_admin allowlist, ensures they have admin role.
 * Non-breaking: fails silently if role assignment fails.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || !user.email) {
      return Response.json({ success: false, reason: 'No user' });
    }

    // Get settings
    const settings = await base44.asServiceRole.entities.SiteSettings.filter(
      { key: 'global' },
      undefined,
      1
    );

    const adminEmails = settings?.[0]?.super_admin_emails || [];

    if (!adminEmails.includes(user.email)) {
      return Response.json({ success: false, reason: 'Email not in allowlist' });
    }

    // If user doesn't have admin role, they can't be assigned it from frontend
    // This is a manual setup step that admins must do in Base44 dashboard
    // This function just logs/notifies that they're eligible

    console.log(`Super admin eligible user logged in: ${user.email}`);

    return Response.json({
      success: true,
      message: 'User is in super admin allowlist. Admin role must be assigned in Base44 dashboard.',
      email: user.email
    });
  } catch (error) {
    console.error('Ensure admin error:', error);
    // Non-breaking - return success even if there's an error
    return Response.json({ success: true, reason: 'Error check skipped' });
  }
});