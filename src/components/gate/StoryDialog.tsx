import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Scroll } from "lucide-react";
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

interface StoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onComplete: () => void;
  completeButtonText?: string;
  children: ReactNode;
}

const StoryDialog = ({
  open,
  onOpenChange,
  title,
  onComplete,
  completeButtonText = "進入知識殿堂",
  children,
}: StoryDialogProps) => {
  const { playClick } = useAudioContext();

  const handleComplete = () => {
    playClick();
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0 border-2 border-primary/40 bg-gradient-to-b from-card to-card/80">
        <ScrollArea className="max-h-[80vh] p-8">
          <DialogHeader>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-4"
            >
              <Scroll className="w-8 h-8 text-primary" />
              <DialogTitle className="text-3xl font-['Cinzel'] text-primary">
                古老卷軸：{title}
              </DialogTitle>
            </motion.div>
            <DialogDescription className="sr-only">
              關卡故事介紹
            </DialogDescription>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 text-foreground/90"
          >
            {children}

            <div className="flex justify-center pt-4">
              <Button
                size="lg"
                onClick={handleComplete}
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-gold"
              >
                {completeButtonText}
              </Button>
            </div>
          </motion.div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default StoryDialog;
