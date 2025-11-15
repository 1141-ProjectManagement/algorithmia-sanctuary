import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Award, Play, Trash2, Plus, Check, X, Code2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import arrayPillars from "@/assets/array-pillars.png";
import linkedBeads from "@/assets/linked-beads.png";
import stoneTablet from "@/assets/stone-tablet.jpg";

type Section = "teach" | "demo" | "test";
type DemoMode = "insert" | "delete" | "access";

const Chapter1Gate2 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { completeGate, isGateCompleted } = useChapterProgress("chapter-1");
  
  const [currentSection, setCurrentSection] = useState<Section>("teach");
  const [demoMode, setDemoMode] = useState<DemoMode>("insert");
  const [arrayItems, setArrayItems] = useState([10, 20, 30, 40, 50]);
  const [linkedItems, setLinkedItems] = useState([10, 20, 30, 40, 50]);
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [operationTime, setOperationTime] = useState<{ array: number; linked: number } | null>(null);
  
  // Test section state
  const [testAnswers, setTestAnswers] = useState<Record<number, string>>({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testScore, setTestScore] = useState(0);

  const completed = isGateCompleted("gate-2");

  // Code snippets for demo
  const codeSnippets = {
    insert: {
      array: `// Array 插入開頭
const arr = [10, 20, 30, 40, 50];
arr.unshift(5); // O(n)
// 需要移動所有元素`,
      linked: `// Linked List 插入開頭
const newNode = { val: 5, next: head };
head = newNode; // O(1)
// 只需改變指標`,
    },
    delete: {
      array: `// Array 刪除開頭
const arr = [10, 20, 30, 40, 50];
arr.shift(); // O(n)
// 需要移動所有元素`,
      linked: `// Linked List 刪除開頭
head = head.next; // O(1)
// 只需改變指標`,
    },
    access: {
      array: `// Array 隨機存取
const arr = [10, 20, 30, 40, 50];
const value = arr[2]; // O(1)
// 直接計算記憶體位置`,
      linked: `// Linked List 隨機存取
let curr = head;
for (let i = 0; i < 2; i++) {
  curr = curr.next; // O(n)
}
// 需要循序遍歷`,
    },
  };

  // Test questions
  const testQuestions = [
    {
      id: 1,
      question: "Array 的隨機存取時間複雜度？",
      options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
      correct: "O(1)",
    },
    {
      id: 2,
      question: "Linked List 在開頭插入的時間複雜度？",
      options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
      correct: "O(1)",
    },
    {
      id: 3,
      question: "當需要頻繁隨機存取時，應選擇？",
      options: ["Array", "Linked List", "都可以", "都不適合"],
      correct: "Array",
    },
  ];

  const handleArrayInsert = () => {
    const start = Date.now();
    setActiveCode("array-insert");
    setTimeout(() => {
      const newItems = [Math.floor(Math.random() * 100), ...arrayItems];
      setArrayItems(newItems);
      const time = Date.now() - start + Math.random() * 100; // Simulate O(n)
      setOperationTime(prev => ({ ...prev!, array: time }));
      setActiveCode(null);
    }, 800);
  };

  const handleLinkedInsert = () => {
    const start = Date.now();
    setActiveCode("linked-insert");
    setTimeout(() => {
      const newItems = [Math.floor(Math.random() * 100), ...linkedItems];
      setLinkedItems(newItems);
      const time = Date.now() - start + 5; // Simulate O(1)
      setOperationTime(prev => ({ ...prev!, linked: time }));
      setActiveCode(null);
    }, 800);
  };

  const handleArrayDelete = () => {
    if (arrayItems.length === 0) return;
    const start = Date.now();
    setActiveCode("array-delete");
    setTimeout(() => {
      setArrayItems(prev => prev.slice(1));
      const time = Date.now() - start + Math.random() * 100;
      setOperationTime(prev => ({ ...prev!, array: time }));
      setActiveCode(null);
    }, 800);
  };

  const handleLinkedDelete = () => {
    if (linkedItems.length === 0) return;
    const start = Date.now();
    setActiveCode("linked-delete");
    setTimeout(() => {
      setLinkedItems(prev => prev.slice(1));
      const time = Date.now() - start + 5;
      setOperationTime(prev => ({ ...prev!, linked: time }));
      setActiveCode(null);
    }, 800);
  };

  const handleArrayAccess = () => {
    const start = Date.now();
    setActiveCode("array-access");
    const index = Math.floor(arrayItems.length / 2);
    setTimeout(() => {
      const time = Date.now() - start + 2;
      setOperationTime(prev => ({ ...prev!, array: time }));
      toast({ title: `存取值: ${arrayItems[index]}`, description: `耗時: ${time.toFixed(1)}ms (O(1))` });
      setActiveCode(null);
    }, 800);
  };

  const handleLinkedAccess = () => {
    const start = Date.now();
    setActiveCode("linked-access");
    const index = Math.floor(linkedItems.length / 2);
    setTimeout(() => {
      const time = Date.now() - start + index * 10;
      setOperationTime(prev => ({ ...prev!, linked: time }));
      toast({ title: `存取值: ${linkedItems[index]}`, description: `耗時: ${time.toFixed(1)}ms (O(n))` });
      setActiveCode(null);
    }, 800);
  };

  const handleTestSubmit = () => {
    let score = 0;
    testQuestions.forEach(q => {
      if (testAnswers[q.id] === q.correct) score++;
    });
    setTestScore(score);
    setTestSubmitted(true);

    if (score === testQuestions.length) {
      setTimeout(() => {
        completeGate("gate-2");
        toast({
          title: "🎉 關卡完成！",
          description: "你已掌握陣列與鏈結串列的特性！",
        });
      }, 1000);
    }
  };

  const resetTest = () => {
    setTestAnswers({});
    setTestSubmitted(false);
    setTestScore(0);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div
        className="relative h-[30vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${stoneTablet})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-temple-black/70 via-temple-black/50 to-background" />
        
        <div className="relative z-10 container mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-4 text-primary hover:text-primary/80 hover:bg-primary/10"
            onClick={() => navigate("/chapter1")}
            aria-label="返回章節選單"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回章節
          </Button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-primary mb-3 drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">
              容器遺跡
            </h1>
            <p className="text-lg text-foreground/90 font-inter">陣列 vs 鏈結串列</p>
          </motion.div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 justify-center flex-wrap">
            {(["teach", "demo", "test"] as Section[]).map((section) => (
              <Button
                key={section}
                variant={currentSection === section ? "default" : "outline"}
                onClick={() => setCurrentSection(section)}
                className={currentSection === section ? "shadow-glow-gold" : ""}
                aria-pressed={currentSection === section}
              >
                {section === "teach" && "📚 教學"}
                {section === "demo" && "🎮 演示"}
                {section === "test" && "✅測驗"}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <AnimatePresence mode="wait">
          {/* TEACH SECTION */}
          {currentSection === "teach" && (
            <motion.div
              key="teach"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-8 p-6 bg-card/40 rounded-lg border border-border">
                <h2 className="text-2xl font-cinzel text-primary mb-4">遺跡故事</h2>
                <p className="text-foreground/80 leading-relaxed font-inter">
                  在古老的神殿深處，探險家發現兩種截然不同的寶石容器：一種是整齊排列的石柱（陣列），
                  另一種是靈活連結的水晶珠鍊（鏈結串列）。每種容器都有其獨特的優勢與限制...
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Array */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-6 bg-card/30 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors"
                >
                  <h3 className="text-2xl font-cinzel text-primary mb-4 text-center">
                    固定石陣 Array
                  </h3>
                  <img
                    src={arrayPillars}
                    alt="Array - 固定排列的石柱結構"
                    className="w-full h-40 object-cover rounded-lg mb-4 opacity-80"
                  />
                  
                  <div className="space-y-4 mb-6">
                    <div className="p-3 bg-muted/30 rounded border-l-4 border-primary">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-muted-foreground font-inter">隨機存取</span>
                        <span className="text-primary font-bold">O(1) ⚡</span>
                      </div>
                      <p className="text-xs text-foreground/70">直接計算記憶體位置</p>
                    </div>
                    
                    <div className="p-3 bg-muted/30 rounded border-l-4 border-destructive">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-muted-foreground font-inter">插入/刪除</span>
                        <span className="text-destructive font-bold">O(n) 🐌</span>
                      </div>
                      <p className="text-xs text-foreground/70">需要移動後續所有元素</p>
                    </div>
                    
                    <div className="p-3 bg-muted/30 rounded border-l-4 border-secondary">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-muted-foreground font-inter">記憶體配置</span>
                        <span className="text-secondary font-bold">連續</span>
                      </div>
                      <p className="text-xs text-foreground/70">元素緊密相鄰，快取友善</p>
                    </div>
                  </div>
                </motion.div>

                {/* Linked List */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-6 bg-card/30 rounded-lg border border-secondary/20 hover:border-secondary/40 transition-colors"
                >
                  <h3 className="text-2xl font-cinzel text-secondary mb-4 text-center">
                    流動鏈珠 Linked List
                  </h3>
                  <img
                    src={linkedBeads}
                    alt="Linked List - 靈活連結的珠鍊結構"
                    className="w-full h-40 object-cover rounded-lg mb-4 opacity-80"
                  />
                  
                  <div className="space-y-4 mb-6">
                    <div className="p-3 bg-muted/30 rounded border-l-4 border-destructive">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-muted-foreground font-inter">隨機存取</span>
                        <span className="text-destructive font-bold">O(n) 🐌</span>
                      </div>
                      <p className="text-xs text-foreground/70">需要循序遍歷節點</p>
                    </div>
                    
                    <div className="p-3 bg-muted/30 rounded border-l-4 border-primary">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-muted-foreground font-inter">插入/刪除</span>
                        <span className="text-primary font-bold">O(1) ⚡</span>
                      </div>
                      <p className="text-xs text-foreground/70">只需改變指標連結</p>
                    </div>
                    
                    <div className="p-3 bg-muted/30 rounded border-l-4 border-secondary">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-muted-foreground font-inter">記憶體配置</span>
                        <span className="text-secondary font-bold">分散</span>
                      </div>
                      <p className="text-xs text-foreground/70">節點分散各處，動態靈活</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-border">
                <h3 className="text-xl font-cinzel text-primary mb-4">關鍵洞察 💡</h3>
                <ul className="space-y-3 text-foreground/80 font-inter">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✦</span>
                    <span><strong className="text-primary">陣列</strong>：連續記憶體，隨機存取極快 (O(1))，但插入刪除需移動元素 (O(n))</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">✦</span>
                    <span><strong className="text-secondary">鏈結串列</strong>：分散記憶體，插入刪除靈活 (O(1))，但存取需遍歷 (O(n))</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">✦</span>
                    <span><strong className="text-accent">選擇策略</strong>：根據操作頻率選擇 — 頻繁存取用 Array，頻繁增刪用 Linked List</span>
                  </li>
                </ul>
              </div>

              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => setCurrentSection("demo")}
                  size="lg"
                  className="shadow-glow-gold"
                  aria-label="前往演示區"
                >
                  前往演示區 <Play className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* DEMO SECTION */}
          {currentSection === "demo" && (
            <motion.div
              key="demo"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-cinzel text-primary mb-4 text-center">互動演示</h2>
                <div className="flex gap-2 justify-center flex-wrap">
                  {(["insert", "delete", "access"] as DemoMode[]).map((mode) => (
                    <Button
                      key={mode}
                      variant={demoMode === mode ? "default" : "outline"}
                      onClick={() => {
                        setDemoMode(mode);
                        setOperationTime(null);
                      }}
                      size="sm"
                      className={demoMode === mode ? "shadow-glow-gold" : ""}
                    >
                      {mode === "insert" && <Plus className="mr-2 h-4 w-4" />}
                      {mode === "delete" && <Trash2 className="mr-2 h-4 w-4" />}
                      {mode === "access" && <Code2 className="mr-2 h-4 w-4" />}
                      {mode === "insert" && "插入"}
                      {mode === "delete" && "刪除"}
                      {mode === "access" && "存取"}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {/* Array Demo */}
                <div className="p-6 bg-card/30 rounded-lg border border-primary/20">
                  <h3 className="text-xl font-cinzel text-primary mb-4 text-center">Array 操作</h3>
                  
                  <div className="flex flex-wrap gap-2 mb-4 min-h-[100px] p-4 bg-muted/20 rounded-lg">
                    {arrayItems.map((item, index) => (
                      <motion.div
                        key={`${item}-${index}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="w-14 h-14 bg-gradient-to-br from-primary/40 to-amber/30 rounded border-2 border-primary/60 flex items-center justify-center text-primary font-bold shadow-glow-gold"
                      >
                        {item}
                      </motion.div>
                    ))}
                  </div>

                  <div className="space-y-2 mb-4">
                    {demoMode === "insert" && (
                      <Button onClick={handleArrayInsert} className="w-full" disabled={activeCode === "array-insert"}>
                        <Plus className="mr-2 h-4 w-4" />
                        {activeCode === "array-insert" ? "執行中..." : "插入到開頭"}
                      </Button>
                    )}
                    {demoMode === "delete" && (
                      <Button onClick={handleArrayDelete} className="w-full" disabled={activeCode === "array-delete" || arrayItems.length === 0}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        {activeCode === "array-delete" ? "執行中..." : "刪除開頭"}
                      </Button>
                    )}
                    {demoMode === "access" && (
                      <Button onClick={handleArrayAccess} className="w-full" disabled={activeCode === "array-access" || arrayItems.length === 0}>
                        <Code2 className="mr-2 h-4 w-4" />
                        {activeCode === "array-access" ? "執行中..." : "存取中間元素"}
                      </Button>
                    )}
                    
                    {operationTime?.array !== undefined && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-sm p-2 bg-primary/10 rounded border border-primary/30"
                      >
                        耗時: <span className="font-bold text-primary">{operationTime.array.toFixed(1)}ms</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Code Display */}
                  {activeCode?.includes("array") && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-4 bg-temple-black rounded-lg border border-primary/30 overflow-hidden"
                    >
                      <pre className="text-xs text-primary font-mono whitespace-pre-wrap">
                        {codeSnippets[demoMode].array}
                      </pre>
                    </motion.div>
                  )}
                </div>

                {/* Linked List Demo */}
                <div className="p-6 bg-card/30 rounded-lg border border-secondary/20">
                  <h3 className="text-xl font-cinzel text-secondary mb-4 text-center">Linked List 操作</h3>
                  
                  <div className="flex flex-wrap gap-2 mb-4 min-h-[100px] p-4 bg-muted/20 rounded-lg">
                    {linkedItems.map((item, index) => (
                      <motion.div
                        key={`${item}-${index}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="relative"
                      >
                        <div className="w-14 h-14 bg-gradient-to-br from-secondary/40 to-lapis/30 rounded-full border-2 border-secondary/60 flex items-center justify-center text-secondary font-bold shadow-glow-amber">
                          {item}
                        </div>
                        {index < linkedItems.length - 1 && (
                          <div className="absolute top-1/2 -right-2 w-4 h-0.5 bg-secondary/60" />
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <div className="space-y-2 mb-4">
                    {demoMode === "insert" && (
                      <Button onClick={handleLinkedInsert} variant="secondary" className="w-full" disabled={activeCode === "linked-insert"}>
                        <Plus className="mr-2 h-4 w-4" />
                        {activeCode === "linked-insert" ? "執行中..." : "插入到開頭"}
                      </Button>
                    )}
                    {demoMode === "delete" && (
                      <Button onClick={handleLinkedDelete} variant="secondary" className="w-full" disabled={activeCode === "linked-delete" || linkedItems.length === 0}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        {activeCode === "linked-delete" ? "執行中..." : "刪除開頭"}
                      </Button>
                    )}
                    {demoMode === "access" && (
                      <Button onClick={handleLinkedAccess} variant="secondary" className="w-full" disabled={activeCode === "linked-access" || linkedItems.length === 0}>
                        <Code2 className="mr-2 h-4 w-4" />
                        {activeCode === "linked-access" ? "執行中..." : "存取中間元素"}
                      </Button>
                    )}
                    
                    {operationTime?.linked !== undefined && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-sm p-2 bg-secondary/10 rounded border border-secondary/30"
                      >
                        耗時: <span className="font-bold text-secondary">{operationTime.linked.toFixed(1)}ms</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Code Display */}
                  {activeCode?.includes("linked") && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-4 bg-temple-black rounded-lg border border-secondary/30 overflow-hidden"
                    >
                      <pre className="text-xs text-secondary font-mono whitespace-pre-wrap">
                        {codeSnippets[demoMode].linked}
                      </pre>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={() => setCurrentSection("test")}
                  size="lg"
                  className="shadow-glow-gold"
                  aria-label="前往測驗區"
                >
                  準備測驗 <Award className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* TEST SECTION */}
          {currentSection === "test" && (
            <motion.div
              key="test"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-cinzel text-primary mb-2">知識測驗</h2>
                <p className="text-muted-foreground font-inter">測試你對 Array 和 Linked List 的理解</p>
              </div>

              <div className="space-y-6 max-w-3xl mx-auto">
                {testQuestions.map((q, idx) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 bg-card/40 rounded-lg border border-border"
                  >
                    <h3 className="text-lg font-inter font-semibold mb-4 text-foreground">
                      {idx + 1}. {q.question}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((option) => {
                        const isSelected = testAnswers[q.id] === option;
                        const isCorrect = option === q.correct;
                        const showResult = testSubmitted;

                        return (
                          <button
                            key={option}
                            onClick={() => !testSubmitted && setTestAnswers(prev => ({ ...prev, [q.id]: option }))}
                            disabled={testSubmitted}
                            className={`
                              p-4 rounded-lg border-2 transition-all font-inter text-left
                              ${!showResult && !isSelected && "border-border bg-card/20 hover:border-primary/40 hover:bg-card/40"}
                              ${!showResult && isSelected && "border-primary bg-primary/10 shadow-glow-gold"}
                              ${showResult && isSelected && isCorrect && "border-accent bg-accent/20"}
                              ${showResult && isSelected && !isCorrect && "border-destructive bg-destructive/20"}
                              ${showResult && !isSelected && isCorrect && "border-accent/60 bg-accent/10"}
                              ${testSubmitted && "cursor-not-allowed"}
                            `}
                            aria-pressed={isSelected}
                            aria-label={`選項: ${option}`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option}</span>
                              {showResult && isSelected && isCorrect && <Check className="h-5 w-5 text-accent" />}
                              {showResult && isSelected && !isCorrect && <X className="h-5 w-5 text-destructive" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col items-center gap-4 mt-8">
                {!testSubmitted ? (
                  <Button
                    onClick={handleTestSubmit}
                    size="lg"
                    disabled={Object.keys(testAnswers).length !== testQuestions.length}
                    className="shadow-glow-gold"
                    aria-label="提交測驗答案"
                  >
                    提交答案
                  </Button>
                ) : (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-center p-6 bg-card/60 rounded-lg border-2 border-primary shadow-glow-gold"
                    >
                      <Award className="h-16 w-16 text-primary mx-auto mb-3 animate-pulse-glow" />
                      <h3 className="text-2xl font-cinzel text-primary mb-2">
                        得分: {testScore} / {testQuestions.length}
                      </h3>
                      <p className="text-muted-foreground font-inter">
                        {testScore === testQuestions.length ? "完美！你已完全掌握！" : "再試一次，你可以做得更好！"}
                      </p>
                    </motion.div>

                    <div className="flex gap-3">
                      {testScore === testQuestions.length ? (
                        <Button
                          onClick={() => navigate("/chapter1")}
                          size="lg"
                          className="shadow-glow-gold"
                        >
                          返回章節 {completed && <Check className="ml-2 h-5 w-5" />}
                        </Button>
                      ) : (
                        <Button
                          onClick={resetTest}
                          size="lg"
                          variant="outline"
                        >
                          重新測驗
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Chapter1Gate2;
