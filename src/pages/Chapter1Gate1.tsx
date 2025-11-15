import { useNavigate } from "react-router-dom";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import Module1_1 from "./Module1-1";

const Chapter1Gate1 = () => {
  const navigate = useNavigate();
  const { completeGate, addBadge } = useChapterProgress("chapter-1");

  const handleComplete = () => {
    completeGate("gate-1");
  };

  const handleBadgeEarned = () => {
    addBadge("big-o-mastery");
    handleComplete();
  };

  return <Module1_1 onGateComplete={handleComplete} onBadgeEarn={handleBadgeEarned} returnPath="/chapter1" />;
};

export default Chapter1Gate1;
