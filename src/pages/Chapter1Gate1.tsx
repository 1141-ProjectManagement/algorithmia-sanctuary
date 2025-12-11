import { useNavigate } from "react-router-dom";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import Module1_1 from "./Module1-1";
import type { SectionType } from "@/lib/auth";

const Chapter1Gate1 = () => {
  const navigate = useNavigate();
  const { completeSection, isGateCompleted } = useChapterProgress("chapter1");

  const handleSectionComplete = async (section: SectionType) => {
    await completeSection("gate1", section);
  };

  const handleGateComplete = () => {
    // Gate is fully completed when all sections done
    setTimeout(() => navigate("/chapter1"), 1500);
  };

  return (
    <Module1_1
      onSectionComplete={handleSectionComplete}
      onGateComplete={handleGateComplete}
      returnPath="/chapter1"
    />
  );
};

export default Chapter1Gate1;
