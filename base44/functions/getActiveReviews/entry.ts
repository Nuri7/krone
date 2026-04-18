import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const reviews = await base44.asServiceRole.entities.Review.filter(
      { is_active: true },
      'sort_order',
      50
    );
    return Response.json({ reviews });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});