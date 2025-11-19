import { Circle, Clock, GitBranch, Network, GitFork, Database, Layers, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";

const realms = [
  {
    name: "起源聖殿",
    englishName: "Sanctuary of Origins",
    icon: Circle,
    description: "探索演算法的根基與基礎概念",
    link: "/chapter1",
    available: true,
  },
  {
    name: "時序神殿",
    englishName: "Temple of Chronos",
    icon: Clock,
    description: "掌握排序與時間複雜度的奧秘",
    link: "/chapter2",
    available: true,
  },
  {
    name: "迴聲神殿",
    englishName: "Temple of Echoes",
    icon: GitBranch,
    description: "習得遞迴與分治的智慧",
    link: "/chapter3",
    available: true,
  },
  {
    name: "織徑神殿",
    englishName: "Temple of Woven Paths",
    icon: Network,
    description: "穿梭圖論與路徑探索之道",
    link: "/chapter4",
    available: true,
  },
  {
    name: "抉擇神殿",
    englishName: "Temple of Judgment",
    icon: GitFork,
    description: "洞悉動態規劃與最優決策",
    link: "/chapter5",
    available: true,
  },
  {
    name: "整合神殿",
    englishName: "Temple of Unity",
    icon: Layers,
    description: "融合所有知識，達至圓滿",
    link: "/chapter6",
    available: true,
  },
];

const Realms = () => {
  const navigate = useNavigate();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const handleRealmClick = (realm: (typeof realms)[0]) => {
    if (realm.available && realm.link) {
      navigate(realm.link);
    }
  };

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section
      id="realms-section"
      className="h-screen flex items-center justify-center px-6 relative"
      aria-label="Seven Sacred Temples"
    >
      {/* Background subtle gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse at top, hsl(30, 20%, 6%) 0%, transparent 50%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10 w-full py-20 pr-16 md:pr-20">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2
            className="font-cinzel text-4xl md:text-6xl font-bold mb-4 inline-block relative"
            style={{
              background: "linear-gradient(135deg, hsl(43, 74%, 53%) 0%, hsl(43, 74%, 40%) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            六座聖殿
          </h2>
          <div
            className="h-1 w-32 mx-auto mt-4 rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent, hsl(43, 74%, 53%), transparent)",
              boxShadow: "0 0 20px hsla(45, 100%, 50%, 0.5)",
            }}
          />
          <p className="font-inter text-lg text-foreground/70 mt-6">Six Sacred Temples of Algorithmic Wisdom</p>
        </motion.div>

        {/* Carousel */}
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
            dragFree: false,
          }}
          className="w-full max-w-full"
        >
          <CarouselContent className="-ml-4">
            {realms.map((realm, index) => {
              const Icon = realm.icon;
              const isActive = current === index;

              return (
                <CarouselItem key={index} className="pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.8,
                      ease: "easeOut",
                      delay: index * 0.1,
                    }}
                    animate={{
                      scale: isActive ? 1.08 : 1,
                    }}
                    className="transition-all duration-400 h-full"
                  >
                    <Card
                      onClick={() => handleRealmClick(realm)}
                      className={`bg-card/50 backdrop-blur-sm border-temple-gold/30 p-6 relative overflow-hidden group transition-all duration-300 h-full min-h-[320px] ${
                        realm.available ? "hover:scale-105 cursor-pointer" : "opacity-60 cursor-not-allowed"
                      }`}
                      style={{
                        boxShadow: isActive
                          ? "0 0 35px rgba(212, 175, 55, 0.7), 0 0 60px rgba(212, 175, 55, 0.5), 0 4px 20px rgba(0, 0, 0, 0.4)"
                          : "0 0 20px rgba(212, 175, 55, 0.3)",
                        borderImage: "linear-gradient(135deg, hsl(43, 74%, 53%), hsl(43, 74%, 40%)) 1",
                        transition: "all 400ms ease-out",
                      }}
                      tabIndex={0}
                      role="article"
                      aria-label={`${realm.name} - ${realm.englishName}${!realm.available ? " - 即將推出" : ""}`}
                    >
                      {/* Hover glow effect */}
                      {realm.available && (
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          style={{
                            boxShadow: "0 0 30px rgba(212, 175, 55, 0.6), 0 0 50px rgba(212, 175, 55, 0.4)",
                          }}
                        />
                      )}

                      {/* Locked overlay for unavailable realms */}
                      {!realm.available && (
                        <div className="absolute top-4 right-4 z-20">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/80 backdrop-blur-sm rounded-full border border-border">
                            <Lock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground font-medium">即將推出</span>
                          </div>
                        </div>
                      )}

                      {/* Content */}
                      <div className="relative z-10 flex flex-col items-center text-center h-full">
                        {/* Icon */}
                        <div className="mb-6">
                          <Icon
                            className={`w-16 h-16 text-temple-gold transition-all duration-500 ${realm.available ? "group-hover:rotate-[5deg]" : ""}`}
                            style={{
                              filter:
                                "drop-shadow(0 0 12px hsla(43, 74%, 53%, 0.9)) drop-shadow(0 0 20px hsla(43, 74%, 53%, 0.5))",
                            }}
                          />
                        </div>

                        {/* Chinese name */}
                        <h3 className="font-cinzel text-xl font-semibold text-temple-gold mb-2">{realm.name}</h3>

                        {/* English name */}
                        <p className="font-inter text-sm text-foreground/60 mb-4 italic">{realm.englishName}</p>

                        {/* Description */}
                        <p className="font-inter text-sm text-foreground/80 leading-relaxed flex-grow">
                          {realm.description}
                        </p>

                        {/* Available indicator */}
                        {realm.available && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 text-xs text-primary font-medium flex items-center gap-1"
                          >
                            <span>點擊進入探索</span>
                            <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                              →
                            </motion.span>
                          </motion.div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {/* Navigation arrows - desktop only */}
          <div className="hidden lg:block">
            <CarouselPrevious
              className="text-temple-gold border-temple-gold/50 hover:bg-temple-gold/10 hover:text-temple-gold hover:border-temple-gold transition-all duration-300 -left-4 xl:-left-12"
              style={{
                boxShadow: "0 0 15px rgba(212, 175, 55, 0.3)",
              }}
              aria-label="View previous realm"
            />
            <CarouselNext
              className="text-temple-gold border-temple-gold/50 hover:bg-temple-gold/10 hover:text-temple-gold hover:border-temple-gold transition-all duration-300 -right-4 xl:-right-12"
              style={{
                boxShadow: "0 0 15px rgba(212, 175, 55, 0.3)",
              }}
              aria-label="View next realm"
            />
          </div>
        </Carousel>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-10" role="tablist" aria-label="Realm slides">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className="transition-all duration-400 focus:outline-none focus:ring-2 focus:ring-temple-gold focus:ring-offset-2 focus:ring-offset-background rounded-full"
              style={{
                width: current === index ? "28px" : "10px",
                height: "10px",
                borderRadius: "5px",
                background: current === index ? "hsl(43, 74%, 53%)" : "hsl(43, 74%, 53%, 0.3)",
                boxShadow:
                  current === index ? "0 0 12px rgba(212, 175, 55, 0.7), 0 0 20px rgba(212, 175, 55, 0.4)" : "none",
                transition: "all 400ms ease-out",
              }}
              role="tab"
              aria-label={`Go to realm ${index + 1}`}
              aria-selected={current === index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Realms;
