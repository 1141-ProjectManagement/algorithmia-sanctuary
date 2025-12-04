import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Lightbulb, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { toBinaryString } from "@/stores/bitManipulationStore";
import BitScene from "./BitScene";

interface TestBlockProps {
  onComplete: () => void;
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  initialValue: number;
  targetValue: number;
  hint: string;
  validateCode: (code: string) => boolean;
}

const challenges: Challenge[] = [
  {
    id: 1,
    title: "清零低 4 位",
    description: "使用 AND 遮罩將低 4 位清零，保留高 4 位",
    initialValue: 0b11011010, // 218
    targetValue: 0b11010000, // 208
    hint: "使用 state & 0xF0 或 state & 0b11110000",
    validateCode: (code) => {
      const normalized = code.replace(/\s/g, '').toLowerCase();
      return normalized.includes('&0xf0') || 
             normalized.includes('&0b11110000') ||
             normalized.includes('&240');
    },
  },
  {
    id: 2,
    title: "翻轉第 3 位",
    description: "使用 XOR 翻轉第 3 位（從 0 開始計數）",
    initialValue: 0b10100110, // 166
    targetValue: 0b10101110, // 174
    hint: "使用 state ^ (1 << 3) 或 state ^ 0b00001000",
    validateCode: (code) => {
      const normalized = code.replace(/\s/g, '').toLowerCase();
      return normalized.includes('^(1<<3)') || 
             normalized.includes('^0b00001000') ||
             normalized.includes('^8') ||
             normalized.includes('^0x08');
    },
  },
  {
    id: 3,
    title: "檢測第 5 位",
    description: "編寫表達式檢測第 5 位是否為 1（返回 0 或 1）",
    initialValue: 0b10100110, // 166
    targetValue: 1, // bit 5 is 1
    hint: "使用 (state >> 5) & 1",
    validateCode: (code) => {
      const normalized = code.replace(/\s/g, '').toLowerCase();
      return normalized.includes('(state>>5)&1') ||
             normalized.includes('(state>>5)&1') ||
             normalized.includes('state>>5&1');
    },
  },
];

const TestBlock = ({ onComplete }: TestBlockProps) => {
  const { toast } = useToast();
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userCode, setUserCode] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [displayValue, setDisplayValue] = useState(challenges[0].initialValue);
  const [isAnimating, setIsAnimating] = useState(false);

  const challenge = challenges[currentChallenge];

  const executeCode = async () => {
    setIsAnimating(true);
    
    // Validate code pattern
    const isValid = challenge.validateCode(userCode);
    
    // Simulate execution
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (isValid) {
      // Animate bits changing
      setDisplayValue(challenge.targetValue);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setIsCorrect(true);
      toast({
        title: "✨ 正確！",
        description: "位元操作成功執行",
      });
      
      setTimeout(() => {
        if (currentChallenge < challenges.length - 1) {
          setCurrentChallenge(currentChallenge + 1);
          setUserCode("");
          setIsCorrect(null);
          setShowHint(false);
          setDisplayValue(challenges[currentChallenge + 1].initialValue);
        } else {
          onComplete();
          toast({
            title: "🎉 恭喜通關！",
            description: "你已掌握位元運算技巧",
          });
        }
      }, 1500);
    } else {
      setIsCorrect(false);
      toast({
        title: "❌ 運算錯誤",
        description: "檢查你的位元遮罩是否正確",
        variant: "destructive",
      });
    }
    
    setIsAnimating(false);
  };

  const resetChallenge = () => {
    setUserCode("");
    setIsCorrect(null);
    setShowHint(false);
    setDisplayValue(challenge.initialValue);
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex justify-center gap-2">
        {challenges.map((c, i) => (
          <div
            key={c.id}
            className={`w-3 h-3 rounded-full ${
              i < currentChallenge
                ? "bg-green-500"
                : i === currentChallenge
                ? "bg-primary"
                : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Challenge Description */}
      <motion.div
        key={challenge.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/10 to-red-500/10 border border-primary/30 rounded-lg p-6"
      >
        <h3 className="text-xl font-['Cinzel'] text-primary mb-2">
          挑戰 {currentChallenge + 1}: {challenge.title}
        </h3>
        <p className="text-muted-foreground">{challenge.description}</p>
      </motion.div>

      {/* Visual Display */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card/40 border border-primary/20 rounded-lg p-4">
          <h4 className="text-sm text-muted-foreground mb-2">當前狀態</h4>
          <div className="text-center">
            <div className="font-mono text-2xl text-primary mb-2">
              {toBinaryString(displayValue)}
            </div>
            <div className="text-sm text-muted-foreground">
              十進位: {displayValue} | 十六進位: 0x{displayValue.toString(16).toUpperCase().padStart(2, '0')}
            </div>
          </div>
        </div>
        
        <div className="bg-card/40 border border-green-500/20 rounded-lg p-4">
          <h4 className="text-sm text-muted-foreground mb-2">目標狀態</h4>
          <div className="text-center">
            <div className="font-mono text-2xl text-green-400 mb-2">
              {toBinaryString(challenge.targetValue)}
            </div>
            <div className="text-sm text-muted-foreground">
              十進位: {challenge.targetValue} | 十六進位: 0x{challenge.targetValue.toString(16).toUpperCase().padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>

      {/* Mini 3D Scene */}
      <div className="h-[200px]">
        <BitScene
          valueA={displayValue}
          valueB={0}
          result={displayValue}
          operation="&"
          animatingBits={[]}
          showB={false}
        />
      </div>

      {/* Code Editor */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 rounded-lg p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-muted-foreground font-mono">state =</span>
          <input
            type="text"
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            placeholder="輸入位元運算表達式..."
            className={`flex-1 bg-black/50 border rounded px-3 py-2 font-mono ${
              isCorrect === true
                ? "border-green-500 text-green-400"
                : isCorrect === false
                ? "border-red-500 text-red-400"
                : "border-primary/30 text-foreground"
            }`}
            disabled={isAnimating || isCorrect === true}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          提示：使用 state 代表當前值，例如 <code>state & 0xFF</code>
        </p>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={executeCode}
          disabled={isAnimating || isCorrect === true || !userCode.trim()}
          className="flex-1"
        >
          {isAnimating ? (
            "執行中..."
          ) : isCorrect === true ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              正確！
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              執行代碼
            </>
          )}
        </Button>

        <Button onClick={resetChallenge} variant="outline" disabled={isAnimating}>
          <RotateCcw className="w-4 h-4 mr-2" />
          重置
        </Button>

        {isCorrect === false && !showHint && (
          <Button onClick={() => setShowHint(true)} variant="secondary">
            <Lightbulb className="w-4 h-4 mr-2" />
            提示
          </Button>
        )}
      </div>

      {/* Hint */}
      {showHint && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4"
        >
          <div className="flex items-start gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <p className="text-sm text-foreground">{challenge.hint}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Success for final challenge */}
      {isCorrect === true && currentChallenge === challenges.length - 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center"
        >
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-green-400 mb-2">
            位元聖典已解鎖！
          </h4>
          <p className="text-sm text-muted-foreground">
            你已掌握位元運算的核心技巧，可以在底層操控數據的每一個位元。
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default TestBlock;
