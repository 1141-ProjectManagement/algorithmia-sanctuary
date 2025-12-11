-- Add section completion columns to progress table
ALTER TABLE public.progress 
ADD COLUMN IF NOT EXISTS teach_completed boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS demo_completed boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS test_completed boolean NOT NULL DEFAULT false;

-- Update completed column to be computed from all sections
-- A gate is completed when all three sections are done
CREATE OR REPLACE FUNCTION public.update_gate_completion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.completed = NEW.teach_completed AND NEW.demo_completed AND NEW.test_completed;
  IF NEW.completed AND OLD.completed = false THEN
    NEW.completed_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger to auto-update completed status
DROP TRIGGER IF EXISTS update_progress_completion ON public.progress;
CREATE TRIGGER update_progress_completion
BEFORE UPDATE ON public.progress
FOR EACH ROW
EXECUTE FUNCTION public.update_gate_completion();