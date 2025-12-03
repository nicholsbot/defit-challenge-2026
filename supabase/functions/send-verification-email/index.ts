import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'https://esm.sh/resend@2.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  userId: string;
  userEmail: string;
  userName: string;
  logId: string;
  logType: 'cardio' | 'strength' | 'hiit' | 'tmarm';
  logDate: string;
  logDetails: string;
  notificationType: 'verified' | 'flagged';
  adminComment?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(resendApiKey);
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: EmailRequest = await req.json();
    const {
      userId,
      userEmail,
      userName,
      logId,
      logType,
      logDate,
      logDetails,
      notificationType,
      adminComment,
    } = body;

    console.log('Sending verification email:', { userId, userEmail, logType, notificationType });

    // Check user's notification preferences
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email_notifications, notify_on_verified, notify_on_flagged')
      .eq('user_id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
    }

    // Check if user wants this notification
    if (profile) {
      if (!profile.email_notifications) {
        console.log('User has disabled email notifications');
        return new Response(
          JSON.stringify({ success: true, skipped: true, reason: 'notifications_disabled' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (notificationType === 'verified' && !profile.notify_on_verified) {
        console.log('User has disabled verification notifications');
        return new Response(
          JSON.stringify({ success: true, skipped: true, reason: 'verified_notifications_disabled' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (notificationType === 'flagged' && !profile.notify_on_flagged) {
        console.log('User has disabled flag notifications');
        return new Response(
          JSON.stringify({ success: true, skipped: true, reason: 'flagged_notifications_disabled' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Format the activity type for display
    const activityTypeDisplay = logType.toUpperCase() === 'TMARM' ? 'TMAR-M' : logType.charAt(0).toUpperCase() + logType.slice(1);
    
    // Create email content based on notification type
    const isVerified = notificationType === 'verified';
    const subject = isVerified 
      ? `[DEFIT] Your ${activityTypeDisplay} Log Has Been Verified ✓`
      : `[DEFIT] Your ${activityTypeDisplay} Log Requires Attention`;
    
    const statusColor = isVerified ? '#22c55e' : '#ef4444';
    const statusText = isVerified ? 'Verified' : 'Flagged for Review';
    const statusIcon = isVerified ? '✓' : '⚠';

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #1a1a1a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #262626; border-radius: 16px; overflow: hidden; border: 1px solid #404040;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #ca8a04 0%, #a16207 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #1a1a1a; font-size: 28px; font-weight: bold; letter-spacing: 2px;">DEFIT</h1>
              <p style="margin: 8px 0 0 0; color: #1a1a1a; font-size: 14px; opacity: 0.8;">Double Eagle Fitness Challenge</p>
            </td>
          </tr>
          
          <!-- Status Badge -->
          <tr>
            <td style="padding: 30px 30px 0 30px; text-align: center;">
              <div style="display: inline-block; background-color: ${statusColor}20; border: 2px solid ${statusColor}; border-radius: 50px; padding: 12px 24px;">
                <span style="color: ${statusColor}; font-size: 18px; font-weight: bold;">${statusIcon} ${statusText}</span>
              </div>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <p style="margin: 0 0 20px 0; color: #e5e5e5; font-size: 16px; line-height: 1.6;">
                Hello ${userName || 'Participant'},
              </p>
              <p style="margin: 0 0 20px 0; color: #e5e5e5; font-size: 16px; line-height: 1.6;">
                ${isVerified 
                  ? 'Great news! Your workout log has been reviewed and verified by USARC personnel.'
                  : 'Your workout log has been flagged and requires your attention.'}
              </p>
              
              <!-- Log Details Box -->
              <div style="background-color: #1a1a1a; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #404040;">
                <h3 style="margin: 0 0 16px 0; color: #ca8a04; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Log Details</h3>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0; color: #a3a3a3; font-size: 14px; width: 120px;">Activity Type:</td>
                    <td style="padding: 8px 0; color: #e5e5e5; font-size: 14px; font-weight: 500;">${activityTypeDisplay}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #a3a3a3; font-size: 14px;">Date:</td>
                    <td style="padding: 8px 0; color: #e5e5e5; font-size: 14px; font-weight: 500;">${logDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #a3a3a3; font-size: 14px;">Details:</td>
                    <td style="padding: 8px 0; color: #e5e5e5; font-size: 14px; font-weight: 500;">${logDetails}</td>
                  </tr>
                </table>
              </div>
              
              ${!isVerified && adminComment ? `
              <!-- Admin Comment -->
              <div style="background-color: #7f1d1d20; border-left: 4px solid #ef4444; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <h4 style="margin: 0 0 8px 0; color: #ef4444; font-size: 14px; font-weight: 600;">Reviewer Comment:</h4>
                <p style="margin: 0; color: #fca5a5; font-size: 14px; line-height: 1.5;">${adminComment}</p>
              </div>
              ` : ''}
              
              <p style="margin: 20px 0; color: #a3a3a3; font-size: 14px; line-height: 1.6;">
                ${isVerified 
                  ? 'This log now counts toward your challenge totals and leaderboard ranking.'
                  : 'Please review the comment above and update your log or contact your unit POC if you have questions.'}
              </p>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${supabaseUrl.replace('.supabase.co', '.lovable.app')}/dashboard/history" 
                   style="display: inline-block; background: linear-gradient(135deg, #ca8a04 0%, #a16207 100%); color: #1a1a1a; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 14px;">
                  View Your Workout History
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1a1a1a; padding: 24px 30px; border-top: 1px solid #404040;">
              <p style="margin: 0 0 8px 0; color: #737373; font-size: 12px; text-align: center;">
                This is an automated notification from the DEFIT Challenge system.
              </p>
              <p style="margin: 0; color: #737373; font-size: 12px; text-align: center;">
                To manage your notification preferences, visit your <a href="${supabaseUrl.replace('.supabase.co', '.lovable.app')}/profile/settings" style="color: #ca8a04;">Profile Settings</a>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Send email
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'DEFIT Challenge <onboarding@resend.dev>',
      to: [userEmail],
      subject: subject,
      html: html,
    });

    if (emailError) {
      console.error('Error sending email:', emailError);
      
      // Log failed email attempt
      await supabase.from('email_logs').insert({
        recipient_email: userEmail,
        recipient_user_id: userId,
        log_id: logId,
        log_type: logType,
        notification_type: notificationType,
        status: 'failed',
        error_message: emailError.message,
      });

      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: emailError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Email sent successfully:', emailData);

    // Log successful email
    await supabase.from('email_logs').insert({
      recipient_email: userEmail,
      recipient_user_id: userId,
      log_id: logId,
      log_type: logType,
      notification_type: notificationType,
      status: 'sent',
    });

    return new Response(
      JSON.stringify({ success: true, emailId: emailData?.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
