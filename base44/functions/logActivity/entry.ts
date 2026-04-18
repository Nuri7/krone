import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Logs a significant user action to the ActivityLog entity.
 *
 * Expected payload:
 * {
 *   action: string (required),
 *   description: string (required),
 *   entity_type?: string,
 *   entity_id?: string,
 *   entity_ref?: string,
 *   metadata?: object
 * }
 *
 * The actor is derived from the authenticated session automatically.
 * If no session exists (e.g. public form submission), actor_email defaults to "anonymous".
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const { action, description, entity_type, entity_id, entity_ref, metadata } = body;

    if (!action || !description) {
      return Response.json({ error: 'action and description are required' }, { status: 400 });
    }

    // Try to get the authenticated user; fall back to anonymous for public actions
    let actor_email = 'anonymous';
    let actor_role = 'guest';
    try {
      const user = await base44.auth.me();
      if (user) {
        actor_email = user.email;
        actor_role = user.role || 'user';
      }
    } catch (_) {
      // unauthenticated — keep defaults
    }

    const log = await base44.asServiceRole.entities.ActivityLog.create({
      actor_email,
      actor_role,
      action,
      entity_type: entity_type || null,
      entity_id: entity_id || null,
      entity_ref: entity_ref || null,
      description,
      metadata: metadata || {},
      performed_at: new Date().toISOString(),
    });

    return Response.json({ success: true, log_id: log.id });
  } catch (error) {
    console.error('logActivity error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});