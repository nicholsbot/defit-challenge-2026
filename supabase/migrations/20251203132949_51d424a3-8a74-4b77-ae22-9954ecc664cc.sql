-- Add notification_mode to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS notification_mode text NOT NULL DEFAULT 'immediate' 
CHECK (notification_mode IN ('immediate', 'digest', 'none'));

-- Create digest queue table to track status changes for daily digest
CREATE TABLE public.digest_queue (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  log_id uuid NOT NULL,
  log_type text NOT NULL CHECK (log_type IN ('cardio', 'strength', 'hiit', 'tmarm')),
  log_date date NOT NULL,
  log_details text NOT NULL,
  previous_status text NOT NULL,
  new_status text NOT NULL,
  admin_comment text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  processed boolean NOT NULL DEFAULT false,
  processed_at timestamp with time zone
);

-- Enable RLS
ALTER TABLE public.digest_queue ENABLE ROW LEVEL SECURITY;

-- Service role can manage digest queue
CREATE POLICY "Service role can manage digest queue"
ON public.digest_queue
FOR ALL
USING (true)
WITH CHECK (true);

-- Create index for efficient querying
CREATE INDEX idx_digest_queue_user_processed ON public.digest_queue(user_id, processed);
CREATE INDEX idx_digest_queue_created ON public.digest_queue(created_at);