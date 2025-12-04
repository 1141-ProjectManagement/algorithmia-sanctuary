import { create } from "zustand";

export interface HashEntry {
  key: string | number;
  value: string;
  index: number;
}

export interface HashStep {
  key: string | number;
  value: string;
  computedHash: number;
  targetIndex: number;
  collision: boolean;
  collisionResolution?: number;
  description: string;
  phase: 'hash' | 'check' | 'resolve' | 'insert' | 'complete';
}

interface HashTableState {
  buckets: (HashEntry | null)[];
  bucketSize: number;
  steps: HashStep[];
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  hashFormula: 'simple' | 'multiplied';
  pendingKeys: { key: string | number; value: string }[];
  
  setBucketSize: (size: number) => void;
  setHashFormula: (formula: 'simple' | 'multiplied') => void;
  addKey: (key: string | number, value: string) => void;
  generateSteps: () => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  setPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  goToStep: (step: number) => void;
  clearBuckets: () => void;
}

const computeHash = (key: string | number, size: number, formula: 'simple' | 'multiplied'): number => {
  const numKey = typeof key === 'string' 
    ? key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    : key;
  
  if (formula === 'simple') {
    return numKey % size;
  } else {
    return (numKey * 31) % size;
  }
};

const generateHashSteps = (
  keys: { key: string | number; value: string }[],
  bucketSize: number,
  formula: 'simple' | 'multiplied'
): { steps: HashStep[]; finalBuckets: (HashEntry | null)[] } => {
  const steps: HashStep[] = [];
  const buckets: (HashEntry | null)[] = Array(bucketSize).fill(null);

  for (const { key, value } of keys) {
    const hash = computeHash(key, bucketSize, formula);
    
    // Step 1: Compute hash
    steps.push({
      key,
      value,
      computedHash: hash,
      targetIndex: hash,
      collision: false,
      description: `計算雜湊值：${typeof key === 'string' ? `"${key}"` : key} → hash = ${hash}`,
      phase: 'hash'
    });

    // Step 2: Check for collision
    let finalIndex = hash;
    let hasCollision = buckets[hash] !== null;

    if (hasCollision) {
      steps.push({
        key,
        value,
        computedHash: hash,
        targetIndex: hash,
        collision: true,
        description: `碰撞發生！索引 ${hash} 已被 "${buckets[hash]?.value}" 佔用`,
        phase: 'check'
      });

      // Step 3: Linear probing to find empty slot
      let probeIndex = (hash + 1) % bucketSize;
      let probeCount = 1;
      
      while (buckets[probeIndex] !== null && probeCount < bucketSize) {
        probeIndex = (probeIndex + 1) % bucketSize;
        probeCount++;
      }

      if (buckets[probeIndex] === null) {
        finalIndex = probeIndex;
        steps.push({
          key,
          value,
          computedHash: hash,
          targetIndex: finalIndex,
          collision: true,
          collisionResolution: finalIndex,
          description: `線性探測：移動到索引 ${finalIndex}（空位）`,
          phase: 'resolve'
        });
      }
    }

    // Step 4: Insert
    buckets[finalIndex] = { key, value, index: finalIndex };
    steps.push({
      key,
      value,
      computedHash: hash,
      targetIndex: finalIndex,
      collision: hasCollision,
      description: `成功存入！"${value}" 存放於寶箱 #${finalIndex}`,
      phase: 'insert'
    });
  }

  steps.push({
    key: '',
    value: '',
    computedHash: 0,
    targetIndex: -1,
    collision: false,
    description: `所有鑰匙已存入完畢！`,
    phase: 'complete'
  });

  return { steps, finalBuckets: buckets };
};

export const useHashTableStore = create<HashTableState>((set, get) => ({
  buckets: Array(8).fill(null),
  bucketSize: 8,
  steps: [],
  currentStep: 0,
  isPlaying: false,
  speed: 1500,
  hashFormula: 'simple',
  pendingKeys: [
    { key: 12, value: '龍之淚' },
    { key: 25, value: '鳳凰羽' },
    { key: 37, value: '星辰石' },
  ],

  setBucketSize: (size) => {
    set({ bucketSize: size, buckets: Array(size).fill(null) });
    get().generateSteps();
  },

  setHashFormula: (formula) => {
    set({ hashFormula: formula });
    get().generateSteps();
  },

  addKey: (key, value) => {
    const { pendingKeys } = get();
    set({ pendingKeys: [...pendingKeys, { key, value }] });
    get().generateSteps();
  },

  generateSteps: () => {
    const { pendingKeys, bucketSize, hashFormula } = get();
    const { steps, finalBuckets } = generateHashSteps(pendingKeys, bucketSize, hashFormula);
    set({ steps, currentStep: 0, buckets: Array(bucketSize).fill(null) });
  },

  nextStep: () => {
    const { currentStep, steps, bucketSize, hashFormula, pendingKeys } = get();
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      
      // Rebuild buckets up to this step
      const insertSteps = steps.slice(0, newStep + 1).filter(s => s.phase === 'insert');
      const newBuckets: (HashEntry | null)[] = Array(bucketSize).fill(null);
      
      insertSteps.forEach((step, idx) => {
        if (idx < pendingKeys.length) {
          newBuckets[step.targetIndex] = {
            key: step.key,
            value: step.value,
            index: step.targetIndex
          };
        }
      });
      
      set({ currentStep: newStep, buckets: newBuckets });
    }
  },

  prevStep: () => {
    const { currentStep, steps, bucketSize, pendingKeys } = get();
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      
      // Rebuild buckets up to this step
      const insertSteps = steps.slice(0, newStep + 1).filter(s => s.phase === 'insert');
      const newBuckets: (HashEntry | null)[] = Array(bucketSize).fill(null);
      
      insertSteps.forEach((step, idx) => {
        if (idx < pendingKeys.length) {
          newBuckets[step.targetIndex] = {
            key: step.key,
            value: step.value,
            index: step.targetIndex
          };
        }
      });
      
      set({ currentStep: newStep, buckets: newBuckets });
    }
  },

  reset: () => {
    const { bucketSize } = get();
    set({ currentStep: 0, isPlaying: false, buckets: Array(bucketSize).fill(null) });
  },

  setPlaying: (playing) => set({ isPlaying: playing }),

  setSpeed: (speed) => set({ speed }),

  goToStep: (step) => {
    const { steps, bucketSize, pendingKeys } = get();
    if (step >= 0 && step < steps.length) {
      // Rebuild buckets up to this step
      const insertSteps = steps.slice(0, step + 1).filter(s => s.phase === 'insert');
      const newBuckets: (HashEntry | null)[] = Array(bucketSize).fill(null);
      
      insertSteps.forEach((s, idx) => {
        if (idx < pendingKeys.length) {
          newBuckets[s.targetIndex] = {
            key: s.key,
            value: s.value,
            index: s.targetIndex
          };
        }
      });
      
      set({ currentStep: step, buckets: newBuckets });
    }
  },

  clearBuckets: () => {
    const { bucketSize } = get();
    set({ 
      buckets: Array(bucketSize).fill(null),
      pendingKeys: [],
      steps: [],
      currentStep: 0
    });
  },
}));
