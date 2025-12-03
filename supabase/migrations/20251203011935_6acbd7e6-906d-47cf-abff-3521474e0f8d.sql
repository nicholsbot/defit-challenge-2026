-- Create verification status enum
CREATE TYPE public.verification_status AS ENUM ('pending', 'verified', 'flagged');

-- Add admin_comment column to all log tables
ALTER TABLE public.cardio_logs ADD COLUMN admin_comment TEXT;
ALTER TABLE public.strength_logs ADD COLUMN admin_comment TEXT;
ALTER TABLE public.hiit_logs ADD COLUMN admin_comment TEXT;
ALTER TABLE public.tmarm_logs ADD COLUMN admin_comment TEXT;

-- Create audit log table for admin actions
CREATE TABLE public.admin_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL,
  action TEXT NOT NULL,
  target_table TEXT NOT NULL,
  target_id UUID NOT NULL,
  previous_status TEXT,
  new_status TEXT,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
ON public.admin_audit_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can insert audit logs
CREATE POLICY "Admins can insert audit logs"
ON public.admin_audit_logs
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster queries
CREATE INDEX idx_audit_logs_target ON public.admin_audit_logs(target_table, target_id);
CREATE INDEX idx_audit_logs_admin ON public.admin_audit_logs(admin_id);
CREATE INDEX idx_audit_logs_created ON public.admin_audit_logs(created_at DESC);