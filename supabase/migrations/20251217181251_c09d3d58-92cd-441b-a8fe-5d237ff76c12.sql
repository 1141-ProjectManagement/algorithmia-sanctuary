-- Create subscription tier enum
CREATE TYPE subscription_tier AS ENUM ('explorer', 'adventurer');

-- Create subscription status enum
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'past_due', 'expired');

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  tier subscription_tier NOT NULL DEFAULT 'explorer',
  status subscription_status NOT NULL DEFAULT 'active',
  stripe_customer_id TEXT,
  stripe_payment_intent_id TEXT,
  purchased_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscription
CREATE POLICY "Users can view own subscription"
ON public.subscriptions
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own subscription (for initial creation)
CREATE POLICY "Users can insert own subscription"
ON public.subscriptions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create subscription_events table for webhook logging
CREATE TABLE public.subscription_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  payload JSONB,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on events table
ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;

-- Only service role can access events (via Edge Functions)
-- No user policies needed as this is internal

-- Create trigger for updated_at
CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to initialize subscription on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, tier, status)
  VALUES (NEW.id, 'explorer', 'active');
  RETURN NEW;
END;
$$;

-- Trigger to auto-create subscription when user signs up
CREATE TRIGGER on_auth_user_created_subscription
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_subscription();