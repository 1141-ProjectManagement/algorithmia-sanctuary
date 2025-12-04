import { motion } from "framer-motion";

interface CodeDisplayProps {
  highlightLine: number;
  comparator: ">" | "<";
  onComparatorChange: (comp: ">" | "<") => void;
}

const CodeDisplay = ({ highlightLine, comparator, onComparatorChange }: CodeDisplayProps) => {
  const codeLines = [
    { num: 1, code: "function bubbleSort(arr) {", indent: 0 },
    { num: 2, code: "  const n = arr.length;", indent: 1 },
    { num: 3, code: "  for (let i = 0; i < n-1; i++) {", indent: 1, isOuter: true },
    { num: 4, code: "    for (let j = 0; j < n-i-1; j++) {", indent: 2, isInner: true },
    { num: 5, code: `      if (arr[j] ${comparator} arr[j+1]) {`, indent: 3, isCompare: true },
    { num: 6, code: "        swap(arr[j], arr[j+1]);", indent: 4, isSwap: true },
    { num: 7, code: "      }", indent: 3 },
    { num: 8, code: "    }", indent: 2 },
    { num: 9, code: "  }", indent: 1 },
    { num: 10, code: "}", indent: 0 },
  ];

  return (
    <div className="bg-background/80 rounded-lg border border-border p-4 font-mono text-sm">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
        <span className="text-xs text-muted-foreground">bubble-sort.js</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">比較方向:</span>
          <button
            onClick={() => onComparatorChange(">")}
            className={`px-2 py-1 text-xs rounded ${
              comparator === ">" 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            }`}
          >
            &gt; 升序
          </button>
          <button
            onClick={() => onComparatorChange("<")}
            className={`px-2 py-1 text-xs rounded ${
              comparator === "<" 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            }`}
          >
            &lt; 降序
          </button>
        </div>
      </div>
      
      <div className="space-y-0.5">
        {codeLines.map((line) => {
          const isHighlighted = 
            (highlightLine === 3 && line.isOuter) ||
            (highlightLine === 4 && line.isInner) ||
            (highlightLine === 5 && line.isCompare) ||
            (highlightLine === 6 && line.isSwap);

          return (
            <motion.div
              key={line.num}
              animate={{
                backgroundColor: isHighlighted ? "rgba(212, 175, 55, 0.2)" : "transparent",
              }}
              className={`flex items-center rounded px-2 py-0.5 ${
                isHighlighted ? "border-l-2 border-primary" : ""
              }`}
            >
              <span className="w-6 text-muted-foreground text-right mr-4">
                {line.num}
              </span>
              <span className={isHighlighted ? "text-primary font-semibold" : "text-foreground/80"}>
                {line.code}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CodeDisplay;
