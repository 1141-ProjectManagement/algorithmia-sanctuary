import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import hourglassCrystal from "@/assets/hourglass-crystal.png";

interface CodeExample {
  id: string;
  code: string;
  complexity: string;
  description: string;
  speed: "fast" | "medium" | "slow";
}

const codeExamples: CodeExample[] = [
  {
    id: "o1",
    code: "return array[0];",
    complexity: "O(1)",
    description: "直接存取陣列第一個元素",
    speed: "fast"
  },
  {
    id: "on",
    code: "for (let i = 0; i < n; i++) {\n  console.log(array[i]);\n}",
    complexity: "O(n)",
    description: "遍歷整個陣列",
    speed: "medium"
  },
  {
    id: "on2",
    code: "for (let i = 0; i < n; i++) {\n  for (let j = 0; j < n; j++) {\n    console.log(array[i], array[j]);\n  }\n}",
    complexity: "O(n²)",
    description: "巢狀迴圈，每個元素與其他元素配對",
    speed: "slow"
  }
];

interface DemoBlockProps {
  onComplete: () => void;
}

const DemoBlock = ({ onComplete }: DemoBlockProps) => {
  const [selectedCode, setSelectedCode] = useState<CodeExample | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [viewedAll, setViewedAll] = useState(false);
  const [viewedExamples, setViewedExamples] = useState<Set<string>>(new Set());

  const handleCodeSelect = (example: CodeExample) => {
    setSelectedCode(example);
    setIsAnimating(true);
    
    const newViewed = new Set(viewedExamples);
    newViewed.add(example.id);
    setViewedExamples(newViewed);
    
    if (newViewed.size === codeExamples.length && !viewedAll) {
      setViewedAll(true);
      onComplete();
    }

    setTimeout(() => setIsAnimating(false), 2000);
  };

  const getGlowColor = (speed: string) => {
    switch (speed) {
      case "fast": return "shadow-[0_0_30px_rgba(212,175,55,0.8)]";
      case "medium": return "shadow-[0_0_30px_rgba(40,50,194,0.8)]";
      case "slow": return "shadow-[0_0_30px_rgba(239,68,68,0.8)]";
      default: return "";
    }
  };

  const getSandSpeed = (speed: string) => {
    switch (speed) {
      case "fast": return 0.5;
      case "medium": return 2;
      case "slow": return 4;
      default: return 2;
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-lg text-foreground/90 mb-2">
          點擊下方程式碼片段，觀察沙漏水晶的流動速度
        </p>
        <p className="text-sm text-muted-foreground">
          已探索 {viewedExamples.size} / {codeExamples.length} 種複雜度
        </p>
      </motion.div>

      {/* Code Examples */}
      <div className="grid md:grid-cols-3 gap-4">
        {codeExamples.map((example, index) => (
          <motion.div
            key={example.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleCodeSelect(example)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedCode?.id === example.id
                ? "border-primary bg-primary/10 shadow-glow-gold"
                : "border-border bg-card/40 hover:border-primary/50"
            } ${viewedExamples.has(example.id) ? "opacity-100" : "opacity-70"}`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Code2 className="w-5 h-5 text-primary" />
              <span className="font-semibold text-primary">{example.complexity}</span>
              {viewedExamples.has(example.id) && (
                <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />
              )}
            </div>
            <pre className="text-xs font-mono bg-black/40 p-3 rounded overflow-x-auto mb-2">
              {example.code}
            </pre>
            <p className="text-sm text-muted-foreground">{example.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Hourglass Display */}
      <div className="relative min-h-[400px] flex flex-col items-center justify-center p-8 bg-gradient-to-br from-card to-card/30 rounded-lg border border-primary/20">
        <AnimatePresence mode="wait">
          {selectedCode ? (
            <motion.div
              key={selectedCode.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-6"
            >
              <motion.div
                animate={isAnimating ? {
                  filter: [
                    "drop-shadow(0 0 20px rgba(212, 175, 55, 0.4))",
                    "drop-shadow(0 0 40px rgba(212, 175, 55, 0.8))",
                    "drop-shadow(0 0 20px rgba(212, 175, 55, 0.4))"
                  ]
                } : {}}
                transition={{ duration: getSandSpeed(selectedCode.speed), repeat: Infinity }}
                className="relative"
              >
                <img 
                  src={hourglassCrystal} 
                  alt="沙漏水晶"
                  className={`w-48 h-48 object-contain ${isAnimating ? getGlowColor(selectedCode.speed) : ""}`}
                />
                {isAnimating && (
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: getSandSpeed(selectedCode.speed), repeat: Infinity }}
                  >
                    <Zap className="w-8 h-8 text-amber-glow" />
                  </motion.div>
                )}
              </motion.div>

              <div className="text-center space-y-2">
                <h3 className="text-2xl font-['Cinzel'] text-primary">
                  {selectedCode.complexity}
                </h3>
                <p className="text-foreground/80">
                  {selectedCode.speed === "fast" && "⚡ 瞬息完成 - 黃金光芒"}
                  {selectedCode.speed === "medium" && "🌊 穩定流動 - 青金藍光"}
                  {selectedCode.speed === "slow" && "🔥 緩慢執行 - 深紅警示"}
                </p>
                <p className="text-sm text-muted-foreground max-w-md">
                  {selectedCode.description}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-muted-foreground"
            >
              <img 
                src={hourglassCrystal} 
                alt="沙漏水晶 - 等待啟動"
                className="w-32 h-32 object-contain mx-auto mb-4 opacity-50"
              />
              <p>點擊上方程式碼片段開始演示</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {viewedAll && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <div className="flex items-center gap-2 text-primary">
            <CheckCircle2 className="w-5 h-5" />
            <span>已完成所有演示探索！</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DemoBlock;
