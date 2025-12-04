import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface TestBlockProps {
  onComplete: () => void;
}

const initialCode = `function siftDown(index, heap, heapSize) {
  let leftChild = 2 * index + 1;
  let rightChild = 2 * index + 2;
  let largest = index;

  // 檢查左子節點
  if (leftChild < heapSize && heap[leftChild] > heap[largest]) {
    largest = leftChild;
  }

  // TODO: 請補全右子節點的判斷邏輯
  // if (??? && ???) {
  //   largest = ???;
  // }

  // TODO: 如果 largest 改變了，進行交換並遞迴
  // if (???) {
  //   [heap[index], heap[largest]] = [heap[largest], heap[index]];
  //   siftDown(???, heap, heapSize);
  // }
}`;

const correctPatterns = [
  /if\s*\(\s*rightChild\s*<\s*heapSize\s*&&\s*heap\s*\[\s*rightChild\s*\]\s*>\s*heap\s*\[\s*largest\s*\]\s*\)/,
  /largest\s*=\s*rightChild/,
  /if\s*\(\s*largest\s*!==?\s*index\s*\)/,
  /siftDown\s*\(\s*largest/,
];

const TestBlock = ({ onComplete }: TestBlockProps) => {
  const [code, setCode] = useState(initialCode);
  const [testResult, setTestResult] = useState<'idle' | 'success' | 'fail'>('idle');
  const [showHint, setShowHint] = useState(false);
  const [visualHeap, setVisualHeap] = useState([50, 30, 40, 35, 10, 25, 15]);
  const [violatedIndices, setViolatedIndices] = useState<number[]>([]);
  const { toast } = useToast();

  // Find violations in heap
  useEffect(() => {
    const violations: number[] = [];
    for (let i = 0; i < Math.floor(visualHeap.length / 2); i++) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < visualHeap.length && visualHeap[i] < visualHeap[left]) {
        violations.push(i, left);
      }
      if (right < visualHeap.length && visualHeap[i] < visualHeap[right]) {
        violations.push(i, right);
      }
    }
    setViolatedIndices([...new Set(violations)]);
  }, [visualHeap]);

  const handleRunCode = () => {
    // Check if all patterns are present
    const allCorrect = correctPatterns.every(pattern => pattern.test(code));
    
    if (allCorrect) {
      setTestResult('success');
      // Animate fixing the heap
      setVisualHeap([50, 35, 40, 30, 10, 25, 15]);
      toast({
        title: "✨ 完美！",
        description: "siftDown 邏輯正確，堆積已修復！",
      });
      setTimeout(() => {
        onComplete();
      }, 1500);
    } else {
      setTestResult('fail');
      toast({
        title: "❌ 邏輯有誤",
        description: "請檢查右子節點判斷和交換條件",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    setTestResult('idle');
    setShowHint(false);
    setVisualHeap([50, 30, 40, 35, 10, 25, 15]);
  };

  return (
    <div className="space-y-6">
      {/* Challenge Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-card/40 rounded-xl border border-primary/30"
      >
        <h3 className="text-xl font-bold text-primary font-['Cinzel'] mb-3">
          修復秩序的守護者
        </h3>
        <p className="text-muted-foreground">
          優先峰頂的秩序被打亂了！有些節點違反了 Max Heap 性質（紅色標記）。
          請補全 <code className="text-primary">siftDown</code> 函數的核心邏輯，讓金字塔恢復秩序。
        </p>
      </motion.div>

      {/* Visual Heap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 bg-black/40 rounded-xl border border-primary/30"
      >
        <h4 className="text-sm font-semibold text-primary mb-4">當前堆積狀態</h4>
        
        {/* Tree visualization */}
        <div className="flex flex-col items-center gap-4">
          {/* Level 0 */}
          <div className="flex justify-center">
            <HeapNode 
              value={visualHeap[0]} 
              index={0} 
              isViolated={violatedIndices.includes(0)}
              isFixed={testResult === 'success'}
            />
          </div>
          {/* Level 1 */}
          <div className="flex justify-center gap-16">
            <HeapNode 
              value={visualHeap[1]} 
              index={1} 
              isViolated={violatedIndices.includes(1)}
              isFixed={testResult === 'success'}
            />
            <HeapNode 
              value={visualHeap[2]} 
              index={2} 
              isViolated={violatedIndices.includes(2)}
              isFixed={testResult === 'success'}
            />
          </div>
          {/* Level 2 */}
          <div className="flex justify-center gap-8">
            <HeapNode 
              value={visualHeap[3]} 
              index={3} 
              isViolated={violatedIndices.includes(3)}
              isFixed={testResult === 'success'}
            />
            <HeapNode 
              value={visualHeap[4]} 
              index={4} 
              isViolated={violatedIndices.includes(4)}
              isFixed={testResult === 'success'}
            />
            <HeapNode 
              value={visualHeap[5]} 
              index={5} 
              isViolated={violatedIndices.includes(5)}
              isFixed={testResult === 'success'}
            />
            <HeapNode 
              value={visualHeap[6]} 
              index={6} 
              isViolated={violatedIndices.includes(6)}
              isFixed={testResult === 'success'}
            />
          </div>
        </div>

        {/* Array view */}
        <div className="flex justify-center gap-2 mt-6">
          {visualHeap.map((val, i) => (
            <motion.div
              key={i}
              animate={{
                backgroundColor: violatedIndices.includes(i) && testResult !== 'success'
                  ? 'rgba(239, 68, 68, 0.3)'
                  : testResult === 'success'
                  ? 'rgba(34, 197, 94, 0.3)'
                  : 'rgba(212, 175, 55, 0.1)',
              }}
              className="w-10 h-10 rounded border border-primary/30 flex items-center justify-center"
            >
              <span className="font-mono text-sm">{val}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Code Editor */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 bg-black/60 rounded-xl border border-primary/30"
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-primary">程式碼編輯器</h4>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHint(!showHint)}
            >
              <Lightbulb className="w-4 h-4 mr-1" />
              提示
            </Button>
          </div>
        </div>
        
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-80 bg-black/40 text-green-400 font-mono text-sm p-4 rounded-lg border border-primary/20 focus:border-primary/50 focus:outline-none resize-none"
          spellCheck={false}
        />

        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg"
          >
            <p className="text-amber-400 text-sm">
              💡 提示：右子節點的判斷邏輯與左子節點類似，只是用 <code>rightChild</code> 替換 <code>leftChild</code>。
              交換條件是當 <code>largest !== index</code> 時才需要交換並遞迴。
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={handleReset}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          重置
        </Button>
        <Button
          onClick={handleRunCode}
          disabled={testResult === 'success'}
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
              執行修復
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

// Helper component for heap node visualization
const HeapNode = ({ 
  value, 
  index, 
  isViolated,
  isFixed,
}: { 
  value: number; 
  index: number; 
  isViolated: boolean;
  isFixed: boolean;
}) => (
  <motion.div
    animate={{
      scale: isViolated && !isFixed ? [1, 1.1, 1] : 1,
      boxShadow: isFixed 
        ? '0 0 20px rgba(34, 197, 94, 0.6)' 
        : isViolated 
        ? '0 0 15px rgba(239, 68, 68, 0.6)' 
        : '0 0 10px rgba(212, 175, 55, 0.3)',
    }}
    transition={{ 
      scale: { repeat: isViolated && !isFixed ? Infinity : 0, duration: 1 }
    }}
    className={`
      w-14 h-14 rounded-full flex flex-col items-center justify-center
      border-2 transition-colors duration-300
      ${isFixed 
        ? 'border-green-500 bg-green-500/20' 
        : isViolated 
        ? 'border-red-500 bg-red-500/20' 
        : 'border-primary bg-primary/10'
      }
    `}
  >
    <span className="font-bold text-lg">{value}</span>
    <span className="text-xs text-muted-foreground">[{index}]</span>
  </motion.div>
);

export default TestBlock;
