import { motion } from "framer-motion";
import { SortAlgorithm } from "@/stores/bubbleSortStore";

interface CodeDisplayProps {
  highlightLine: number;
  comparator: ">" | "<";
  onComparatorChange: (comp: ">" | "<") => void;
  algorithm: SortAlgorithm;
}

const CodeDisplay = ({ highlightLine, comparator, onComparatorChange, algorithm }: CodeDisplayProps) => {
  const bubbleSortLines = [
    { num: 1, code: "function bubbleSort(arr) {", indent: 0 },
    { num: 2, code: "  const n = arr.length;", indent: 1 },
    { num: 3, code: "  for (let i = 0; i < n-1; i++) {", indent: 1 },
    { num: 4, code: "    for (let j = 0; j < n-i-1; j++) {", indent: 2 },
    { num: 5, code: `      if (arr[j] ${comparator} arr[j+1]) {`, indent: 3, isCompare: true },
    { num: 6, code: "        swap(arr[j], arr[j+1]);", indent: 4, isSwap: true },
    { num: 7, code: "      }", indent: 3 },
    { num: 8, code: "    }", indent: 2 },
    { num: 9, code: "  }", indent: 1 },
    { num: 10, code: "}", indent: 0 },
  ];

  const insertionSortLines = [
    { num: 1, code: "function insertionSort(arr) {", indent: 0 },
    { num: 2, code: "  const n = arr.length;", indent: 1 },
    { num: 3, code: "  for (let i = 1; i < n; i++) {", indent: 1 },
    { num: 4, code: "    let key = arr[i];", indent: 2, isKey: true },
    { num: 5, code: "    let j = i - 1;", indent: 2 },
    { num: 6, code: `    while (j >= 0 && arr[j] ${comparator} key) {`, indent: 2, isCompare: true },
    { num: 7, code: "      arr[j + 1] = arr[j];", indent: 3, isSwap: true },
    { num: 8, code: "      j--;", indent: 3 },
    { num: 9, code: "    }", indent: 2 },
    { num: 10, code: "    arr[j + 1] = key;", indent: 2, isInsert: true },
    { num: 11, code: "  }", indent: 1 },
    { num: 12, code: "}", indent: 0 },
  ];

  const codeLines = algorithm === 'bubble' ? bubbleSortLines : insertionSortLines;

  return (
    <div className="bg-background/80 rounded-lg border border-border p-4 font-mono text-sm">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
        <span className="text-xs text-muted-foreground">
          {algorithm === 'bubble' ? 'bubble-sort.js' : 'insertion-sort.js'}
        </span>
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
          const isHighlighted = line.num === highlightLine;

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
