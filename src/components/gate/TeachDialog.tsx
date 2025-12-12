import { ReactNode } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAudioContext } from "@/contexts/AudioContext";

interface TeachDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onComplete: () => void;
  completeButtonText?: string;
  isCompleted?: boolean;
  children: ReactNode;
}

const TeachDialog = ({
  open,
  onOpenChange,
  title,
  onComplete,
  completeButtonText = "完成學習，開始挑戰",
  isCompleted = false,
  children,
}: TeachDialogProps) => {
  const { playClick } = useAudioContext();

  const handleComplete = () => {
    playClick();
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] p-0 border-2 border-primary/40 bg-gradient-to-b from-card to-card/80">
        <ScrollArea className="max-h-[85vh] p-8">
          <DialogHeader>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-4"
            >
              <BookOpen className="w-8 h-8 text-primary" />
              <DialogTitle className="text-3xl font-['Cinzel'] text-primary">
                知識卷軸：{title}
              </DialogTitle>
            </motion.div>
            <DialogDescription className="sr-only">
              {title}知識講解
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {children}

            <div className="flex justify-center pt-6 border-t border-border">
              <Button
                size="lg"
                onClick={handleComplete}
                disabled={!isCompleted}
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-gold disabled:opacity-50"
              >
                {completeButtonText}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TeachDialog;
