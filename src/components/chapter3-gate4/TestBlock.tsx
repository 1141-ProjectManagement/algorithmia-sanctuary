import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface TestBlockProps {
  onComplete: () => void;
}

interface NodeData {
  id: string;
  char: string | null;
  freq: number;
  isSelected: boolean;
}

const initialNodes: NodeData[] = [
  { id: '1', char: 'A', freq: 5, isSelected: false },
  { id: '2', char: 'B', freq: 9, isSelected: false },
  { id: '3', char: 'C', freq: 12, isSelected: false },
  { id: '4', char: null, freq: 25, isSelected: false }, // Already merged node
];

const TestBlock = ({ onComplete }: TestBlockProps) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [nodes, setNodes] = useState<NodeData[]>(initialNodes);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [testResult, setTestResult] = useState<'idle' | 'success' | 'fail'>('idle');
  const [showHint, setShowHint] = useState(false);
  const [codeAnswer, setCodeAnswer] = useState('');
  const { toast } = useToast();

  const challenges = useMemo(() => [
    {
      type: 'select',
      instruction: '選擇下一步應該合併的兩個節點',
      hint: '貪婪策略：總是選擇頻率最小的兩個！',
      correctAnswer: ['1', '2'], // A(5) and B(9) are smallest
    },
    {
      type: 'code',
      instruction: '補全合併節點的代碼',
      hint: '新節點的頻率 = 左子頻率 + 右子頻率',
      correctAnswer: 'left.freq + right.freq',
      codeTemplate: `function combineNodes(left, right) {
  const newFreq = __________;
  return {
    freq: newFreq,
    left: left,
    right: right,
    char: null
  };
}`,
    },
  ], []);

  const handleNodeClick = (nodeId: string) => {
    if (challenges[currentChallenge].type !== 'select') return;
    if (testResult === 'success') return;

    setSelectedNodes(prev => {
      if (prev.includes(nodeId)) {
        return prev.filter(id => id !== nodeId);
      }
      if (prev.length < 2) {
        return [...prev, nodeId];
      }
      return [prev[1], nodeId]; // Replace first selection
    });
  };

  const handleSubmit = () => {
    const challenge = challenges[currentChallenge];
    
    if (challenge.type === 'select') {
      const sortedSelected = [...selectedNodes].sort();
      const sortedCorrect = [...challenge.correctAnswer].sort();
      const isCorrect = JSON.stringify(sortedSelected) === JSON.stringify(sortedCorrect);
      
      if (isCorrect) {
        setTestResult('success');
        toast({
          title: "✨ 正確！",
          description: "你找到了頻率最小的兩個節點！",
        });
        
        setTimeout(() => {
          if (currentChallenge < challenges.length - 1) {
            setCurrentChallenge(prev => prev + 1);
            setSelectedNodes([]);
            setTestResult('idle');
            setShowHint(false);
          } else {
            onComplete();
          }
        }, 1500);
      } else {
        setTestResult('fail');
        toast({
          title: "❌ 不對喔",
          description: "這不是最小的兩個節點，再想想貪婪策略的原則",
          variant: "destructive",
        });
      }
    } else if (challenge.type === 'code') {
      const normalizedAnswer = codeAnswer.replace(/\s/g, '').toLowerCase();
      const correctPatterns = [
        'left.freq+right.freq',
        'right.freq+left.freq',
        'left.freq+right.freq;',
        'right.freq+left.freq;',
      ];
      
      const isCorrect = correctPatterns.some(pattern => 
        normalizedAnswer.includes(pattern.replace(/\s/g, '').toLowerCase())
      );
      
      if (isCorrect) {
        setTestResult('success');
        toast({
          title: "✨ 完美！",
          description: "霍夫曼編碼的核心邏輯正確！",
        });
        setTimeout(() => {
          onComplete();
        }, 1500);
      } else {
        setTestResult('fail');
        toast({
          title: "❌ 邏輯有誤",
          description: "新節點頻率應該是兩個子節點頻率的和",
          variant: "destructive",
        });
      }
    }
  };

  const handleReset = () => {
    setSelectedNodes([]);
    setTestResult('idle');
    setShowHint(false);
    setCodeAnswer('');
  };

  const currentChallengeData = challenges[currentChallenge];

  return (
    <div className="space-y-6">
      {/* Challenge Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-card/40 rounded-xl border border-primary/30"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-primary font-['Cinzel']">
            手動執行合併
          </h3>
          <span className="text-sm text-muted-foreground">
            挑戰 {currentChallenge + 1} / {challenges.length}
          </span>
        </div>
        <p className="text-muted-foreground">
          {currentChallengeData.instruction}
        </p>
      </motion.div>

      {/* Challenge Content */}
      {currentChallengeData.type === 'select' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-black/40 rounded-xl border border-primary/30"
        >
          <h4 className="text-sm font-semibold text-primary mb-4">當前節點池（點擊選擇兩個）</h4>
          
          <div className="flex flex-wrap justify-center gap-6">
            {nodes.map((node) => {
              const isSelected = selectedNodes.includes(node.id);
              const isCorrect = testResult === 'success' && isSelected;
              const isWrong = testResult === 'fail' && isSelected;
              
              return (
                <motion.div
                  key={node.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNodeClick(node.id)}
                  className={`
                    w-24 h-24 rounded-full flex flex-col items-center justify-center
                    cursor-pointer border-2 transition-all duration-300
                    ${isCorrect 
                      ? 'border-green-500 bg-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.6)]' 
                      : isWrong 
                      ? 'border-red-500 bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.6)]' 
                      : isSelected 
                      ? 'border-primary bg-primary/20 shadow-[0_0_15px_rgba(212,175,55,0.5)]' 
                      : 'border-primary/30 bg-card/40 hover:border-primary/60'
                    }
                  `}
                >
                  <span className="text-2xl font-bold text-foreground">
                    {node.char || '⊕'}
                  </span>
                  <span className="text-sm text-muted-foreground mt-1">
                    freq: {node.freq}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-4 text-sm text-muted-foreground">
            已選擇: {selectedNodes.length} / 2
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-black/60 rounded-xl border border-primary/30"
        >
          <h4 className="text-sm font-semibold text-primary mb-3">補全代碼</h4>
          
          <pre className="bg-black/40 p-4 rounded-lg font-mono text-sm text-green-400 mb-4 overflow-x-auto">
{`function combineNodes(left, right) {
  const newFreq = `}
            <input
              type="text"
              value={codeAnswer}
              onChange={(e) => setCodeAnswer(e.target.value)}
              placeholder="???"
              className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded border border-amber-500/50 font-mono text-sm w-40"
            />
{`;
  return {
    freq: newFreq,
    left: left,
    right: right,
    char: null
  };
}`}
          </pre>
        </motion.div>
      )}

      {/* Hint */}
      {showHint && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg"
        >
          <p className="text-amber-400 text-sm flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            {currentChallengeData.hint}
          </p>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowHint(!showHint)}
        >
          <Lightbulb className="w-4 h-4 mr-1" />
          {showHint ? '隱藏提示' : '顯示提示'}
        </Button>
        
        <Button
          variant="outline"
          onClick={handleReset}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          重置
        </Button>
        
        <Button
          onClick={handleSubmit}
          disabled={
            testResult === 'success' || 
            (currentChallengeData.type === 'select' && selectedNodes.length !== 2) ||
            (currentChallengeData.type === 'code' && !codeAnswer.trim())
          }
          className="min-w-32"
        >
          {testResult === 'success' ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              已通過
            </>
          ) : testResult === 'fail' ? (
            <>
              <XCircle className="w-4 h-4 mr-2" />
              再試一次
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              確認合併
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default TestBlock;
