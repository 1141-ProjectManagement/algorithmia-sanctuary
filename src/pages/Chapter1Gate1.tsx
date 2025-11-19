import { useNavigate } from "react-router-dom";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import Module1_1 from "./Module1-1";

const Chapter1Gate1 = () => {
  const navigate = useNavigate();
  const { completeGate } = useChapterProgress("chapter-1");

  const handleComplete = () => {
    completeGate("gate-1");
    setTimeout(() => navigate("/chapter1"), 1500);
  };

  return <Module1_1 onGateComplete={handleComplete} returnPath="/chapter1" />;
};

export default Chapter1Gate1;
