import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Lightbulb, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface TestBlockProps {
  onComplete: () => void;
}

const TestBlock = ({ onComplete }: TestBlockProps) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [codeAnswer, setCodeAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState(0);
  const { toast } = useToast();

  const challenges = [
    {
      id: 1,
      type: 'debug',
      title: '循環解除 (Debug Mode)',
      description: '以下依賴圖存在循環依賴，導致編譯系統死鎖。請點選應該移除的邊：',
      edges: [
        { from: 'A', to: 'B', label: 'A → B' },
        { from: 'B', to: 'C', label: 'B → C' },
        { from: 'C', to: 'D', label: 'C → D' },
        { from: 'D', to: 'B', label: 'D → B', isCycle: true },
      ],
      correctAnswer: 'D-B',
      hint: '找出形成環的那條「回頭邊」。從 D 指向 B 會讓 B → C → D → B 形成循環。',
    },
    {
      id: 2,
      type: 'code',
      title: '邏輯填空 (Coding Mode)',
      description: '請補全 Kahn 演算法中更新入度的邏輯：',
      codeTemplate: `while (queue.length > 0) {
  const node = queue.shift();
  result.push(node);
  
  for (const neighbor of adj[node]) {
    // TODO: 減少鄰居的入度
    ______________________
    
    // TODO: 如果入度變為 0，加入佇列
    if (______________________) {
      queue.push(neighbor);
    }
  }
}`,
      correctAnswers: [
        ['indegree[neighbor]--', 'indegree[neighbor] -= 1', 'indegree[neighbor] = indegree[neighbor] - 1'],
        ['indegree[neighbor] === 0', 'indegree[neighbor] == 0', '!indegree[neighbor]'],
      ],
      hint: '第一空：每處理一個前置任務，鄰居的入度應該減 1。\n第二空：當入度降為 0 時，該節點就可以執行了。',
    },
  ];

  const handleEdgeSelect = (edgeKey: string) => {
    setSelectedEdge(edgeKey);
    setIsCorrect(null);
    setShowHint(false);
  };

  const handleDebugSubmit = () => {
    const challenge = challenges[currentChallenge];
    if (challenge.type !== 'debug') return;

    const correct = selectedEdge === challenge.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      toast({
        title: "✅ 正確！",
        description: "成功移除導致循環的邊，系統現在可以完成拓撲排序了。",
      });
      setTimeout(() => nextChallenge(), 1500);
    } else {
      toast({
        title: "❌ 錯誤",
        description: "這不是導致循環的邊，請再仔細觀察依賴關係。",
        variant: "destructive",
      });
    }
  };

  const handleCodeSubmit = () => {
    const challenge = challenges[currentChallenge];
    if (challenge.type !== 'code') return;

    const lines = codeAnswer.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) {
      toast({
        title: "請填寫兩個空格",
        description: "需要補全兩行程式碼。",
        variant: "destructive",
      });
      return;
    }

    const [first, second] = lines;
    const correctFirst = challenge.correctAnswers![0].some(ans => 
      first.replace(/\s/g, '').includes(ans.replace(/\s/g, ''))
    );
    const correctSecond = challenge.correctAnswers![1].some(ans => 
      second.replace(/\s/g, '').includes(ans.replace(/\s/g, ''))
    );

    const correct = correctFirst && correctSecond;
    setIsCorrect(correct);

    if (correct) {
      toast({
        title: "✅ 完美！",
        description: "Kahn 演算法邏輯正確，任務卡片將依序啟動！",
      });
      setTimeout(() => nextChallenge(), 1500);
    } else {
      let feedback = '';
      if (!correctFirst) feedback += '第一空：入度減少邏輯有誤。';
      if (!correctSecond) feedback += '第二空：入度為 0 的判斷有誤。';
      toast({
        title: "❌ 邏輯錯誤",
        description: feedback,
        variant: "destructive",
      });
    }
  };

  const nextChallenge = () => {
    const newCompleted = completedChallenges + 1;
    setCompletedChallenges(newCompleted);
    
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
      setSelectedEdge(null);
      setCodeAnswer('');
      setIsCorrect(null);
      setShowHint(false);
    } else {
      onComplete();
      toast({
        title: "🎉 恭喜通關！",
        description: "你已掌握拓撲排序的核心概念！",
      });
    }
  };

  const challenge = challenges[currentChallenge];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-block px-4 py-1 bg-primary/20 rounded-full text-primary text-sm mb-4">
          挑戰 {currentChallenge + 1} / {challenges.length}
        </div>
        <h3 className="text-xl font-['Cinzel'] text-foreground mb-2">
          {challenge.title}
        </h3>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
          {challenge.description}
        </p>
      </motion.div>

      {challenge.type === 'debug' && (
        <div className="space-y-4">
          {/* Visual graph representation */}
          <div className="bg-card/40 border border-primary/30 rounded-lg p-6">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {['A', 'B', 'C', 'D'].map((node, idx) => (
                <div key={node} className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-bold">
                    {node}
                  </div>
                  {idx < 3 && <span className="text-primary">→</span>}
                </div>
              ))}
              <div className="text-destructive ml-4">↺ (D → B)</div>
            </div>
          </div>

          {/* Edge selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {challenge.edges.map((edge) => {
              const key = `${edge.from}-${edge.to}`;
              const isSelected = selectedEdge === key;
              return (
                <Button
                  key={key}
                  onClick={() => handleEdgeSelect(key)}
                  variant={isSelected ? "default" : "outline"}
                  className={`${
                    isSelected 
                      ? 'bg-primary text-primary-foreground' 
                      : 'border-primary/50 text-primary hover:bg-primary/20'
                  } ${edge.isCycle ? 'ring-2 ring-destructive/50' : ''}`}
                >
                  {edge.label}
                </Button>
              );
            })}
          </div>

          <Button
            onClick={handleDebugSubmit}
            disabled={!selectedEdge}
            className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50"
          >
            <Play className="w-4 h-4 mr-2" />
            移除選中的邊
          </Button>
        </div>
      )}

      {challenge.type === 'code' && (
        <div className="space-y-4">
          <div className="bg-black/30 border border-primary/30 rounded-lg p-4">
            <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
              {challenge.codeTemplate}
            </pre>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              請填寫兩行程式碼（每行一個答案）：
            </label>
            <textarea
              value={codeAnswer}
              onChange={(e) => {
                setCodeAnswer(e.target.value);
                setIsCorrect(null);
              }}
              className="w-full h-24 bg-black/30 border border-primary/30 rounded p-3 font-mono text-sm text-foreground"
              placeholder="indegree[neighbor]--&#10;indegree[neighbor] === 0"
            />
          </div>

          <Button
            onClick={handleCodeSubmit}
            disabled={!codeAnswer.trim()}
            className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50"
          >
            <Play className="w-4 h-4 mr-2" />
            執行驗證
          </Button>
        </div>
      )}

      {/* Result indicator */}
      {isCorrect !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`flex items-center justify-center gap-2 p-3 rounded-lg ${
            isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-destructive/20 text-destructive'
          }`}
        >
          {isCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          {isCorrect ? '正確！' : '再試一次'}
        </motion.div>
      )}

      {/* Hint button */}
      {!showHint && isCorrect === false && (
        <Button
          onClick={() => setShowHint(true)}
          variant="ghost"
          className="w-full text-muted-foreground hover:text-primary"
        >
          <Lightbulb className="w-4 h-4 mr-2" />
          需要提示？
        </Button>
      )}

      {showHint && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 border border-primary/30 rounded-lg p-4 text-sm text-primary whitespace-pre-wrap"
        >
          💡 {challenge.hint}
        </motion.div>
      )}
    </div>
  );
};

export default TestBlock;
