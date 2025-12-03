-- Add notification preferences to profiles table
ALTER TABLE public.profiles 
ADD COLUMN email_notifications BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN notify_on_verified BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN notify_on_flagged BOOLEAN NOT NULL DEFAULT true;

-- Create email log table for auditing
CREATE TABLE public.email_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_email TEXT NOT NULL,
  recipient_user_id UUID NOT NULL,
  log_id UUID NOT NULL,
  log_type TEXT NOT NULL,
  notification_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on email logs
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view email logs
CREATE POLICY "Admins can view email logs"
ON public.email_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- System can insert email logs (via service role)
CREATE POLICY "Service role can insert email logs"
ON public.email_logs
FOR INSERT
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_email_logs_recipient ON public.email_logs(recipient_user_id);
CREATE INDEX idx_email_logs_created ON public.email_logs(created_at DESC);