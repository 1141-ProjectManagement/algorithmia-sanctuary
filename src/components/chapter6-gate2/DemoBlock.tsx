import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBitManipulationStore, toBinaryString } from "@/stores/bitManipulationStore";
import BitScene from "./BitScene";

interface DemoBlockProps {
  onComplete: () => void;
}

const DemoBlock = ({ onComplete }: DemoBlockProps) => {
  const {
    valueA,
    valueB,
    result,
    operation,
    shiftAmount,
    animatingBits,
    isAnimating,
    setValueA,
    setValueB,
    setOperation,
    setShiftAmount,
    animateCalculation,
    reset,
  } = useBitManipulationStore();

  const [hasInteracted, setHasInteracted] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);

  useEffect(() => {
    // Initialize calculation
    useBitManipulationStore.getState().calculate();
  }, []);

  const handleExecute = async () => {
    setHasInteracted(true);
    setInteractionCount((c) => c + 1);
    await animateCalculation();
  };

  useEffect(() => {
    if (interactionCount >= 3) {
      onComplete();
    }
  }, [interactionCount, onComplete]);

  const operations: { value: '&' | '|' | '^' | '~' | '<<' | '>>'; label: string }[] = [
    { value: '&', label: 'AND' },
    { value: '|', label: 'OR' },
    { value: '^', label: 'XOR' },
    { value: '~', label: 'NOT' },
    { value: '<<', label: '<<' },
    { value: '>>', label: '>>' },
  ];

  const showB = operation !== '~' && operation !== '<<' && operation !== '>>';

  return (
    <div className="space-y-6">
      {/* 3D Visualization */}
      <BitScene
        valueA={valueA}
        valueB={valueB}
        result={result}
        operation={operation}
        animatingBits={animatingBits}
        showB={showB}
      />

      {/* Controls */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Panel - Inputs */}
        <div className="space-y-4">
          {/* Value A */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card/40 border border-primary/20 rounded-lg p-4"
          >
            <Label className="text-primary font-semibold">數值 A</Label>
            <div className="flex items-center gap-3 mt-2">
              <Input
                type="number"
                value={valueA}
                onChange={(e) => setValueA(parseInt(e.target.value) || 0)}
                className="w-24"
                min={0}
                max={255}
              />
              <div className="flex-1 p-2 bg-black/30 rounded font-mono text-sm">
                <span className="text-muted-foreground">0b</span>
                <span className="text-primary">{toBinaryString(valueA)}</span>
              </div>
            </div>
          </motion.div>

          {/* Value B (conditional) */}
          {showB && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card/40 border border-blue-500/20 rounded-lg p-4"
            >
              <Label className="text-blue-400 font-semibold">數值 B</Label>
              <div className="flex items-center gap-3 mt-2">
                <Input
                  type="number"
                  value={valueB}
                  onChange={(e) => setValueB(parseInt(e.target.value) || 0)}
                  className="w-24"
                  min={0}
                  max={255}
                />
                <div className="flex-1 p-2 bg-black/30 rounded font-mono text-sm">
                  <span className="text-muted-foreground">0b</span>
                  <span className="text-blue-400">{toBinaryString(valueB)}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Shift Amount (for shift operations) */}
          {(operation === '<<' || operation === '>>') && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card/40 border border-primary/20 rounded-lg p-4"
            >
              <Label className="text-primary font-semibold">位移量</Label>
              <Input
                type="number"
                value={shiftAmount}
                onChange={(e) => setShiftAmount(parseInt(e.target.value) || 0)}
                className="w-24 mt-2"
                min={0}
                max={7}
              />
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleExecute}
              disabled={isAnimating}
              className="flex-1"
            >
              <Play className="w-4 h-4 mr-2" />
              執行運算
            </Button>
            <Button onClick={reset} variant="outline">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Right Panel - Operation Selection & Result */}
        <div className="space-y-4">
          {/* Operation Tabs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card/40 border border-primary/20 rounded-lg p-4"
          >
            <Label className="text-primary font-semibold mb-3 block">運算符號</Label>
            <Tabs value={operation} onValueChange={(v) => setOperation(v as typeof operation)}>
              <TabsList className="grid grid-cols-6 w-full">
                {operations.map((op) => (
                  <TabsTrigger key={op.value} value={op.value} className="text-xs">
                    {op.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </motion.div>

          {/* Result Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-4"
          >
            <Label className="text-green-400 font-semibold">結果</Label>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">十進位</span>
                <span className="text-2xl font-bold text-green-400">{result}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">二進位</span>
                <span className="font-mono text-green-400">0b{toBinaryString(result)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">十六進位</span>
                <span className="font-mono text-green-400">0x{result.toString(16).toUpperCase().padStart(2, '0')}</span>
              </div>
            </div>
          </motion.div>

          {/* Expression Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/30 rounded-lg p-4"
          >
            <Label className="text-muted-foreground text-sm mb-2 block">運算表達式</Label>
            <div className="font-mono text-lg">
              {operation === '~' ? (
                <span>
                  <span className="text-yellow-400">~</span>
                  <span className="text-primary">{valueA}</span>
                  <span className="text-muted-foreground"> = </span>
                  <span className="text-green-400">{result}</span>
                </span>
              ) : operation === '<<' || operation === '>>' ? (
                <span>
                  <span className="text-primary">{valueA}</span>
                  <span className="text-yellow-400"> {operation} </span>
                  <span className="text-blue-400">{shiftAmount}</span>
                  <span className="text-muted-foreground"> = </span>
                  <span className="text-green-400">{result}</span>
                </span>
              ) : (
                <span>
                  <span className="text-primary">{valueA}</span>
                  <span className="text-yellow-400"> {operation} </span>
                  <span className="text-blue-400">{valueB}</span>
                  <span className="text-muted-foreground"> = </span>
                  <span className="text-green-400">{result}</span>
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Interaction hint */}
      <p className="text-center text-sm text-muted-foreground">
        嘗試不同的數值和運算符號，觀察位元變化 ({interactionCount}/3 次互動)
      </p>
    </div>
  );
};

export default DemoBlock;
