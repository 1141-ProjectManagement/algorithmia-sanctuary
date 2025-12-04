import { Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useState } from "react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Temple background images
import realm1Image from "@/assets/realm-1-origins.jpg";
import realm2Image from "@/assets/realm-2-chronos.jpg";
import realm3Image from "@/assets/realm-3-echoes.jpg";
import realm4Image from "@/assets/realm-4-paths.jpg";
import realm5Image from "@/assets/realm-5-judgment.jpg";
import realm6Image from "@/assets/realm-6-unity.jpg";

const realms = [
  {
    name: "起源聖殿",
    englishName: "Sanctuary of Origins",
    image: realm1Image,
    description: "探索演算法的根基與基礎概念",
    link: "/chapter1",
    available: true,
    chapter: 1,
  },
  {
    name: "時序神殿",
    englishName: "Temple of Chronos",
    image: realm2Image,
    description: "掌握排序與時間複雜度的奧秘",
    link: "/chapter2",
    available: true,
    chapter: 2,
  },
  {
    name: "迴聲神殿",
    englishName: "Temple of Echoes",
    image: realm3Image,
    description: "習得遞迴與分治的智慧",
    link: "/chapter3",
    available: true,
    chapter: 3,
  },
  {
    name: "織徑神殿",
    englishName: "Temple of Woven Paths",
    image: realm4Image,
    description: "穿梭圖論與路徑探索之道",
    link: "/chapter4",
    available: true,
    chapter: 4,
  },
  {
    name: "抉擇神殿",
    englishName: "Temple of Judgment",
    image: realm5Image,
    description: "洞悉動態規劃與最優決策",
    link: "/chapter5",
    available: true,
    chapter: 5,
  },
  {
    name: "整合神殿",
    englishName: "Temple of Unity",
    image: realm6Image,
    description: "融合所有知識，達至圓滿",
    link: "/chapter6",
    available: true,
    chapter: 6,
  },
];

const swiperStyles = `
  .realms-swiper {
    width: 100%;
    padding: 50px 0;
  }
  
  .realms-swiper .swiper-slide {
    width: 320px;
    transition: all 0.4s ease;
  }
  
  .realms-swiper .swiper-slide-active {
    transform: scale(1.05);
  }
  
  .realms-swiper .swiper-3d .swiper-slide-shadow-left,
  .realms-swiper .swiper-3d .swiper-slide-shadow-right {
    background: none;
  }
  
  .realms-swiper .swiper-pagination-bullet {
    width: 10px;
    height: 10px;
    background: hsl(43, 74%, 53%, 0.3);
    opacity: 1;
    transition: all 0.4s ease;
  }
  
  .realms-swiper .swiper-pagination-bullet-active {
    width: 28px;
    border-radius: 5px;
    background: hsl(43, 74%, 53%);
    box-shadow: 0 0 12px rgba(212, 175, 55, 0.7), 0 0 20px rgba(212, 175, 55, 0.4);
  }
  
  .realms-swiper .swiper-button-prev,
  .realms-swiper .swiper-button-next {
    color: hsl(43, 74%, 53%);
    width: 44px;
    height: 44px;
    border: 1px solid hsl(43, 74%, 53%, 0.5);
    border-radius: 50%;
    background: hsl(0, 0%, 0%, 0.5);
    backdrop-filter: blur(4px);
    transition: all 0.3s ease;
  }
  
  .realms-swiper .swiper-button-prev:hover,
  .realms-swiper .swiper-button-next:hover {
    background: hsl(43, 74%, 53%, 0.1);
    border-color: hsl(43, 74%, 53%);
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.5);
  }
  
  .realms-swiper .swiper-button-prev::after,
  .realms-swiper .swiper-button-next::after {
    font-size: 18px;
    font-weight: bold;
  }
`;

const Realms = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleRealmClick = (realm: (typeof realms)[0]) => {
    if (realm.available && realm.link) {
      navigate(realm.link);
    }
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  };

  return (
    <section
      id="realms-section"
      className="min-h-screen flex items-center justify-center px-4 md:px-6 relative py-12"
      aria-label="Six Sacred Temples"
    >
      <style>{swiperStyles}</style>
      
      {/* Background subtle gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse at top, hsl(30, 20%, 6%) 0%, transparent 50%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
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

        {/* Swiper Carousel */}
        <Swiper
          className="realms-swiper"
          modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          slidesPerView="auto"
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 150,
            modifier: 2,
            slideShadows: false,
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: true,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          onSlideChange={handleSlideChange}
        >
          {realms.map((realm, index) => {
            const isActive = activeIndex === index;

            return (
              <SwiperSlide key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut",
                    delay: index * 0.1,
                  }}
                  className="h-full"
                >
                  <div
                    onClick={() => handleRealmClick(realm)}
                    className={`relative overflow-hidden rounded-2xl group transition-all duration-300 h-[420px] ${
                      realm.available ? "hover:scale-[1.02] cursor-pointer" : "opacity-60 cursor-not-allowed"
                    }`}
                    style={{
                      boxShadow: isActive
                        ? "0 0 35px rgba(212, 175, 55, 0.5), 0 0 60px rgba(212, 175, 55, 0.3), 0 4px 20px rgba(0, 0, 0, 0.4)"
                        : "0 0 20px rgba(212, 175, 55, 0.2)",
                      border: "1px solid rgba(212, 175, 55, 0.3)",
                      transition: "all 400ms ease-out",
                    }}
                    tabIndex={0}
                    role="article"
                    aria-label={`${realm.name} - ${realm.englishName}${!realm.available ? " - 即將推出" : ""}`}
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <img
                        src={realm.image}
                        alt={realm.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
                    </div>

                    {/* Chapter Number Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center font-cinzel text-xl font-bold"
                        style={{
                          background: "linear-gradient(135deg, hsl(43, 74%, 53%) 0%, hsl(43, 74%, 40%) 100%)",
                          boxShadow: "0 0 15px rgba(212, 175, 55, 0.6)",
                          color: "hsl(0, 0%, 5%)",
                        }}
                      >
                        {realm.chapter}
                      </div>
                    </div>

                    {/* Hover glow effect */}
                    {realm.available && (
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                        style={{
                          boxShadow: "inset 0 0 30px rgba(212, 175, 55, 0.3)",
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

                    {/* Content - positioned at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                      {/* Chinese name */}
                      <h3 
                        className="font-cinzel text-2xl font-bold mb-1"
                        style={{
                          color: "hsl(43, 74%, 53%)",
                          textShadow: "0 0 20px rgba(212, 175, 55, 0.5)",
                        }}
                      >
                        {realm.name}
                      </h3>

                      {/* English name */}
                      <p className="font-inter text-sm text-foreground/70 mb-3 italic">{realm.englishName}</p>

                      {/* Description */}
                      <p className="font-inter text-sm text-foreground/90 leading-relaxed mb-4">
                        {realm.description}
                      </p>

                      {/* Available indicator */}
                      {realm.available && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs font-medium flex items-center gap-1"
                          style={{ color: "hsl(43, 74%, 53%)" }}
                        >
                          <span>點擊進入探索</span>
                          <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                            →
                          </motion.span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default Realms;
