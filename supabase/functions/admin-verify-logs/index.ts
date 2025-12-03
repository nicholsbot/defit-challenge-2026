import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyRequest {
  logId: string;
  logType: 'cardio' | 'strength' | 'hiit' | 'tmarm';
  action: 'verify' | 'flag';
  comment?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get auth header and verify user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user from auth header
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.log('Invalid token or user not found:', userError);
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError || !roleData) {
      console.log('User is not admin:', user.id);
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Admin verified:', user.id);

    // Handle GET - fetch all logs
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const status = url.searchParams.get('status') || 'all';
      const logType = url.searchParams.get('type') || 'all';
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const offset = (page - 1) * limit;

      console.log('Fetching logs with filters:', { status, logType, page, limit });

      const logs: any[] = [];

      // Helper function to fetch logs from a table
      const fetchLogs = async (tableName: string, type: string): Promise<any[]> => {
        let query = supabase
          .from(tableName)
          .select('*')
          .order('created_at', { ascending: false });

        // Filter by status
        if (status === 'pending') {
          query = query.eq('verified', false).is('verified_by', null);
        } else if (status === 'verified') {
          query = query.eq('verified', true);
        } else if (status === 'flagged') {
          query = query.eq('verified', false).not('admin_comment', 'is', null);
        }

        const { data, error } = await query;

        if (error) {
          console.error(`Error fetching ${tableName}:`, error);
          return [];
        }

        return (data || []).map((log) => ({
          ...log,
          log_type: type,
          table_name: tableName,
        }));
      };

      // Fetch from relevant tables
      if (logType === 'all' || logType === 'cardio') {
        const cardioLogs = await fetchLogs('cardio_logs', 'cardio');
        logs.push(...cardioLogs);
      }
      if (logType === 'all' || logType === 'strength') {
        const strengthLogs = await fetchLogs('strength_logs', 'strength');
        logs.push(...strengthLogs);
      }
      if (logType === 'all' || logType === 'hiit') {
        const hiitLogs = await fetchLogs('hiit_logs', 'hiit');
        logs.push(...hiitLogs);
      }
      if (logType === 'all' || logType === 'tmarm') {
        const tmarmLogs = await fetchLogs('tmarm_logs', 'tmarm');
        logs.push(...tmarmLogs);
      }

      // Get user profiles for participant names
      const userIds = [...new Set(logs.map(l => l.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, unit, unit_category')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      // Enrich logs with profile data
      const enrichedLogs = logs.map(log => ({
        ...log,
        participant_name: profileMap.get(log.user_id)?.full_name || 'Unknown',
        unit: profileMap.get(log.user_id)?.unit || 'N/A',
        unit_category: profileMap.get(log.user_id)?.unit_category || 'other',
        status: log.verified ? 'verified' : (log.admin_comment ? 'flagged' : 'pending'),
      }));

      // Sort by created_at and paginate
      enrichedLogs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      const paginatedLogs = enrichedLogs.slice(offset, offset + limit);

      console.log(`Returning ${paginatedLogs.length} logs out of ${enrichedLogs.length} total`);

      return new Response(
        JSON.stringify({
          logs: paginatedLogs,
          total: enrichedLogs.length,
          page,
          limit,
          totalPages: Math.ceil(enrichedLogs.length / limit),
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle POST - verify or flag a log
    if (req.method === 'POST') {
      const body: VerifyRequest = await req.json();
      const { logId, logType, action, comment } = body;

      if (!logId || !logType || !action) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: logId, logType, action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const tableName = `${logType}_logs`;
      console.log(`Processing ${action} for ${tableName}:${logId}`);

      // Get current log state for audit
      const { data: currentLog } = await supabase
        .from(tableName)
        .select('verified, admin_comment')
        .eq('id', logId)
        .single();

      const previousStatus = currentLog?.verified ? 'verified' : (currentLog?.admin_comment ? 'flagged' : 'pending');

      // Update the log
      const updateData: any = {
        verified: action === 'verify',
        verified_by: user.id,
        verified_at: new Date().toISOString(),
      };

      if (action === 'flag' && comment) {
        updateData.admin_comment = comment;
      } else if (action === 'verify') {
        updateData.admin_comment = null;
      }

      const { error: updateError } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', logId);

      if (updateError) {
        console.error('Error updating log:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update log' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create audit log entry
      const { error: auditError } = await supabase
        .from('admin_audit_logs')
        .insert({
          admin_id: user.id,
          action: action,
          target_table: tableName,
          target_id: logId,
          previous_status: previousStatus,
          new_status: action === 'verify' ? 'verified' : 'flagged',
          comment: comment || null,
        });

      if (auditError) {
        console.error('Error creating audit log:', auditError);
        // Don't fail the request, just log the error
      }

      console.log(`Successfully ${action}ed log ${logId}`);

      return new Response(
        JSON.stringify({ success: true, action, logId }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
