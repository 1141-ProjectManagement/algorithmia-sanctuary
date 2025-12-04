import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Binary, Zap, Layers, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TeachBlockProps {
  onComplete: () => void;
}

const TeachBlock = ({ onComplete }: TeachBlockProps) => {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    onComplete();
  };

  const operations = [
    {
      icon: "∧",
      name: "AND (&)",
      description: "嚴格的守門人——兩者皆亮才放行",
      example: "1010 & 0110 = 0010",
      rule: "1 & 1 = 1，其他皆為 0",
    },
    {
      icon: "∨",
      name: "OR (|)",
      description: "寬容的匯聚者——有光即保留",
      example: "1010 | 0110 = 1110",
      rule: "0 | 0 = 0，其他皆為 1",
    },
    {
      icon: "⊕",
      name: "XOR (^)",
      description: "差異的共鳴——不同則亮",
      example: "1010 ^ 0110 = 1100",
      rule: "相同為 0，不同為 1",
    },
    {
      icon: "¬",
      name: "NOT (~)",
      description: "完全反轉——0 變 1，1 變 0",
      example: "~1010 = 0101",
      rule: "每一位取反",
    },
  ];

  const shiftOps = [
    {
      name: "左移 (<<)",
      description: "能量倍增——每左移一位，數值乘以 2",
      example: "5 << 1 = 10 (0101 → 1010)",
    },
    {
      name: "右移 (>>)",
      description: "能量衰減——每右移一位，數值除以 2",
      example: "10 >> 1 = 5 (1010 → 0101)",
    },
  ];

  const useCases = [
    { name: "檢測奇偶", code: "n & 1", desc: "結果為 1 是奇數" },
    { name: "清除最低位 1", code: "n & (n-1)", desc: "位元計數技巧" },
    { name: "檢測第 k 位", code: "(n >> k) & 1", desc: "取得特定位元值" },
    { name: "設置第 k 位", code: "n | (1 << k)", desc: "將第 k 位設為 1" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h3 className="text-2xl font-['Cinzel'] text-primary mb-2">
          位元運算的核心概念
        </h3>
        <p className="text-muted-foreground">
          位元是計算機世界的最小單位，掌握它就掌握了底層的力量
        </p>
      </motion.div>

      {/* Binary Basics */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-primary/10 border border-primary/30 rounded-lg p-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <Binary className="w-5 h-5 text-primary" />
          <h4 className="text-lg font-semibold text-primary">二進位表示</h4>
        </div>
        <p className="text-foreground mb-4">
          每個整數都可以表示為二進位形式。例如數字 <code className="bg-black/30 px-2 py-1 rounded">10</code> 的二進位是 <code className="bg-black/30 px-2 py-1 rounded">1010</code>
        </p>
        <div className="grid grid-cols-4 gap-2 text-center font-mono">
          {[8, 4, 2, 1].map((val, i) => (
            <div key={i} className="p-2 bg-black/20 rounded">
              <div className="text-xs text-muted-foreground">2^{3-i}</div>
              <div className="text-lg text-primary">{val}</div>
              <div className="text-sm text-foreground">{i === 0 || i === 2 ? '1' : '0'}</div>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-3 text-center">
          1×8 + 0×4 + 1×2 + 0×1 = 10
        </p>
      </motion.div>

      {/* Core Operations */}
      <div className="grid md:grid-cols-2 gap-4">
        {operations.map((op, index) => (
          <motion.div
            key={op.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-card/40 border border-primary/20 rounded-lg p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold text-primary">{op.icon}</span>
              <h4 className="font-semibold text-foreground">{op.name}</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{op.description}</p>
            <div className="bg-black/30 p-2 rounded font-mono text-sm">
              <span className="text-green-400">{op.example}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{op.rule}</p>
          </motion.div>
        ))}
      </div>

      {/* Shift Operations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card/40 border border-primary/20 rounded-lg p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <ArrowLeftRight className="w-5 h-5 text-primary" />
          <h4 className="text-lg font-semibold text-primary">位移運算</h4>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {shiftOps.map((op) => (
            <div key={op.name} className="p-3 bg-black/20 rounded">
              <h5 className="font-semibold text-foreground mb-1">{op.name}</h5>
              <p className="text-sm text-muted-foreground mb-2">{op.description}</p>
              <code className="text-xs text-green-400">{op.example}</code>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bitmask Techniques */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/30 rounded-lg p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-primary" />
          <h4 className="text-lg font-semibold text-primary">位元遮罩技巧</h4>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {useCases.map((uc) => (
            <div key={uc.name} className="p-3 bg-black/20 rounded flex items-center gap-3">
              <code className="text-sm text-yellow-400 bg-black/30 px-2 py-1 rounded">{uc.code}</code>
              <div>
                <p className="text-sm font-semibold text-foreground">{uc.name}</p>
                <p className="text-xs text-muted-foreground">{uc.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Complete Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center"
      >
        <Button
          onClick={handleComplete}
          disabled={completed}
          className="px-8 py-3"
          variant={completed ? "secondary" : "default"}
        >
          {completed ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              已完成學習
            </>
          ) : (
            "我理解了"
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default TeachBlock;
