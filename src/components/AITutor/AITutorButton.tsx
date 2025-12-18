import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { useAudioContext } from "@/contexts/AudioContext";
import { AITutorChat } from "./AITutorChat";
import { AIUpgradeModal } from "./AIUpgradeModal";

interface AITutorButtonProps {
  context?: string;
}

export const AITutorButton = ({ context }: AITutorButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { isPremium } = useSubscription();
  const { playClick } = useAudioContext();

  const handleClick = () => {
    playClick();
    if (!isPremium) {
      setShowUpgradeModal(true);
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <Button
          onClick={handleClick}
          size="lg"
          className={`
            rounded-full w-14 h-14 shadow-lg
            ${isOpen 
              ? "bg-muted hover:bg-muted/80" 
              : "bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            }
          `}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="bot"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
              >
                <Bot className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        {/* Pulse effect for non-premium */}
        {!isPremium && (
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/30"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && isPremium && (
          <AITutorChat 
            context={context} 
            onClose={() => setIsOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Upgrade Modal */}
      <AIUpgradeModal 
        open={showUpgradeModal} 
        onOpenChange={setShowUpgradeModal} 
      />
    </>
  );
};
