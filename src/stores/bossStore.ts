import { create } from 'zustand';

export type ShieldType = 'sorting' | 'graph' | 'dp';
export type PhaseStatus = 'locked' | 'active' | 'completed' | 'failed';

interface Shield {
  type: ShieldType;
  name: string;
  health: number;
  maxHealth: number;
  color: string;
  status: PhaseStatus;
}

interface BossState {
  shields: Shield[];
  currentPhase: number;
  playerHP: number;
  maxPlayerHP: number;
  failCount: number;
  hintsEnabled: boolean;
  isAnimating: boolean;
  showVictory: boolean;
  sRankAchieved: boolean;
  attackLog: string[];
  
  // Actions
  initBattle: () => void;
  attackShield: (shieldType: ShieldType, damage: number) => void;
  damagePlayer: (amount: number) => void;
  completePhase: (shieldType: ShieldType) => void;
  failPhase: () => void;
  setAnimating: (animating: boolean) => void;
  setVictory: (victory: boolean) => void;
  setSRank: (achieved: boolean) => void;
  addLog: (message: string) => void;
  reset: () => void;
}

const initialShields: Shield[] = [
  {
    type: 'sorting',
    name: '秩序護盾',
    health: 100,
    maxHealth: 100,
    color: '#ef4444',
    status: 'active',
  },
  {
    type: 'graph',
    name: '連結護盾',
    health: 100,
    maxHealth: 100,
    color: '#3b82f6',
    status: 'locked',
  },
  {
    type: 'dp',
    name: '優化護盾',
    health: 100,
    maxHealth: 100,
    color: '#d4af37',
    status: 'locked',
  },
];

export const useBossStore = create<BossState>((set, get) => ({
  shields: JSON.parse(JSON.stringify(initialShields)),
  currentPhase: 0,
  playerHP: 100,
  maxPlayerHP: 100,
  failCount: 0,
  hintsEnabled: false,
  isAnimating: false,
  showVictory: false,
  sRankAchieved: false,
  attackLog: [],

  initBattle: () => {
    set({
      shields: JSON.parse(JSON.stringify(initialShields)),
      currentPhase: 0,
      playerHP: 100,
      failCount: 0,
      hintsEnabled: false,
      isAnimating: false,
      showVictory: false,
      sRankAchieved: false,
      attackLog: ['⚔️ 戰鬥開始！第一層護盾已激活'],
    });
  },

  attackShield: (shieldType, damage) => {
    set((state) => ({
      shields: state.shields.map((shield) =>
        shield.type === shieldType
          ? { ...shield, health: Math.max(0, shield.health - damage) }
          : shield
      ),
      attackLog: [...state.attackLog, `💥 對 ${shieldType} 護盾造成 ${damage} 點傷害`],
    }));
  },

  damagePlayer: (amount) => {
    set((state) => ({
      playerHP: Math.max(0, state.playerHP - amount),
      attackLog: [...state.attackLog, `❌ 反噬！受到 ${amount} 點傷害`],
    }));
  },

  completePhase: (shieldType) => {
    const state = get();
    const phaseIndex = state.shields.findIndex((s) => s.type === shieldType);
    
    set((state) => {
      const newShields = state.shields.map((shield, idx) => {
        if (shield.type === shieldType) {
          return { ...shield, health: 0, status: 'completed' as PhaseStatus };
        }
        if (idx === phaseIndex + 1) {
          return { ...shield, status: 'active' as PhaseStatus };
        }
        return shield;
      });

      const nextPhase = Math.min(state.currentPhase + 1, 2);
      const allCompleted = newShields.every((s) => s.status === 'completed');

      return {
        shields: newShields,
        currentPhase: nextPhase,
        showVictory: allCompleted,
        attackLog: [
          ...state.attackLog,
          `✨ ${shieldType} 護盾已破碎！`,
          ...(allCompleted ? ['🎉 Boss 已被淨化！'] : [`⚡ 第 ${nextPhase + 1} 層護盾激活`]),
        ],
      };
    });
  },

  failPhase: () => {
    set((state) => {
      const newFailCount = state.failCount + 1;
      return {
        failCount: newFailCount,
        hintsEnabled: newFailCount >= 2,
        attackLog: [
          ...state.attackLog,
          `💔 挑戰失敗 (${newFailCount}/3)`,
          ...(newFailCount >= 2 ? ['💡 智者提示已解鎖'] : []),
        ],
      };
    });
  },

  setAnimating: (animating) => set({ isAnimating: animating }),
  setVictory: (victory) => set({ showVictory: victory }),
  setSRank: (achieved) => set({ sRankAchieved: achieved }),
  addLog: (message) => set((state) => ({ attackLog: [...state.attackLog, message] })),
  reset: () => {
    set({
      shields: JSON.parse(JSON.stringify(initialShields)),
      currentPhase: 0,
      playerHP: 100,
      failCount: 0,
      hintsEnabled: false,
      isAnimating: false,
      showVictory: false,
      sRankAchieved: false,
      attackLog: [],
    });
  },
}));
