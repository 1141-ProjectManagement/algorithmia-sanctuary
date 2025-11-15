import { Circle, Clock, GitBranch, Network, GitFork, Database, Layers } from "lucide-react";
import { Card } from "@/components/ui/card";

const realms = [
  {
    name: "起源聖殿",
    englishName: "Sanctuary of Origins",
    icon: Circle,
    description: "探索演算法的根基與基礎概念",
  },
  {
    name: "時序神殿",
    englishName: "Temple of Chronos",
    icon: Clock,
    description: "掌握排序與時間複雜度的奧秘",
  },
  {
    name: "迴聲神殿",
    englishName: "Temple of Echoes",
    icon: GitBranch,
    description: "習得遞迴與分治的智慧",
  },
  {
    name: "織徑神殿",
    englishName: "Temple of Woven Paths",
    icon: Network,
    description: "穿梭圖論與路徑探索之道",
  },
  {
    name: "抉擇神殿",
    englishName: "Temple of Judgment",
    icon: GitFork,
    description: "洞悉動態規劃與最優決策",
  },
  {
    name: "記憶神殿",
    englishName: "Temple of Akasha",
    icon: Database,
    description: "領悟記憶化與緩存策略",
  },
  {
    name: "整合神殿",
    englishName: "Temple of Unity",
    icon: Layers,
    description: "融合所有知識，達至圓滿",
  },
];

const Realms = () => {
  return (
    <section className="py-32 px-6 relative">
      {/* Background subtle gradient */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at top, hsl(30, 20%, 6%) 0%, transparent 50%)'
        }}
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section title */}
        <div className="text-center mb-20">
          <h2 
            className="font-cinzel text-4xl md:text-6xl font-bold mb-4 inline-block relative"
            style={{
              background: 'linear-gradient(135deg, hsl(43, 74%, 53%) 0%, hsl(43, 74%, 40%) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            七座聖殿
          </h2>
          <div 
            className="h-1 w-32 mx-auto mt-4 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, hsl(43, 74%, 53%), transparent)',
              boxShadow: '0 0 20px hsla(45, 100%, 50%, 0.5)'
            }}
          />
          <p className="font-inter text-lg text-foreground/70 mt-6">
            Seven Sacred Temples of Algorithmic Wisdom
          </p>
        </div>
        
        {/* Realms grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-6">
          {realms.map((realm, index) => {
            const Icon = realm.icon;
            return (
              <Card
                key={index}
                className="bg-card/50 backdrop-blur-sm border-temple-gold/30 p-6 relative overflow-hidden group hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{
                  boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)',
                  borderImage: 'linear-gradient(135deg, hsl(43, 74%, 53%), hsl(43, 74%, 40%)) 1',
                }}
              >
                {/* Hover glow effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    boxShadow: '0 0 30px rgba(212, 175, 55, 0.6), 0 0 50px rgba(212, 175, 55, 0.4)'
                  }}
                />
                
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center h-full">
                  {/* Icon */}
                  <div className="mb-6 group-hover:animate-float-gentle">
                    <Icon 
                      className="w-16 h-16 text-temple-gold" 
                      style={{
                        filter: 'drop-shadow(0 0 8px hsla(43, 74%, 53%, 0.8))'
                      }}
                    />
                  </div>
                  
                  {/* Chinese name */}
                  <h3 className="font-cinzel text-xl font-semibold text-temple-gold mb-2">
                    {realm.name}
                  </h3>
                  
                  {/* English name */}
                  <p className="font-inter text-sm text-foreground/60 mb-4 italic">
                    {realm.englishName}
                  </p>
                  
                  {/* Description */}
                  <p className="font-inter text-sm text-foreground/80 leading-relaxed flex-grow">
                    {realm.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Realms;
