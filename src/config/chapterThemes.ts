// Chapter theme configuration - extracted from Realms section
import realm1Image from "@/assets/realm-1-origins.jpg";
import realm2Image from "@/assets/realm-2-chronos.jpg";
import realm3Image from "@/assets/realm-3-echoes.jpg";
import realm4Image from "@/assets/realm-4-paths.jpg";
import realm5Image from "@/assets/realm-5-judgment.jpg";
import realm6Image from "@/assets/realm-6-unity.jpg";

export interface ChapterTheme {
  image: string;
  accentColor: string;
  glowColor: string;
  gradientFrom: string;
  gradientTo: string;
}

export const chapterThemes: Record<number, ChapterTheme> = {
  1: {
    image: realm1Image,
    accentColor: "hsl(43, 74%, 53%)", // Gold - Origins
    glowColor: "rgba(212, 175, 55, 0.5)",
    gradientFrom: "hsl(43, 74%, 53%)",
    gradientTo: "hsl(43, 74%, 40%)",
  },
  2: {
    image: realm2Image,
    accentColor: "hsl(220, 70%, 55%)", // Blue - Chronos/Time
    glowColor: "rgba(66, 133, 244, 0.5)",
    gradientFrom: "hsl(220, 70%, 55%)",
    gradientTo: "hsl(220, 70%, 40%)",
  },
  3: {
    image: realm3Image,
    accentColor: "hsl(280, 60%, 55%)", // Purple - Echoes/Recursion
    glowColor: "rgba(156, 39, 176, 0.5)",
    gradientFrom: "hsl(280, 60%, 55%)",
    gradientTo: "hsl(280, 60%, 40%)",
  },
  4: {
    image: realm4Image,
    accentColor: "hsl(160, 60%, 45%)", // Teal - Paths/Graphs
    glowColor: "rgba(38, 166, 154, 0.5)",
    gradientFrom: "hsl(160, 60%, 45%)",
    gradientTo: "hsl(160, 60%, 35%)",
  },
  5: {
    image: realm5Image,
    accentColor: "hsl(340, 65%, 55%)", // Rose - Judgment/DP
    glowColor: "rgba(233, 30, 99, 0.5)",
    gradientFrom: "hsl(340, 65%, 55%)",
    gradientTo: "hsl(340, 65%, 40%)",
  },
  6: {
    image: realm6Image,
    accentColor: "hsl(45, 90%, 55%)", // Bright Gold - Unity
    glowColor: "rgba(255, 193, 7, 0.6)",
    gradientFrom: "hsl(45, 90%, 55%)",
    gradientTo: "hsl(43, 74%, 45%)",
  },
};

export const getChapterTheme = (chapterNumber: number): ChapterTheme => {
  return chapterThemes[chapterNumber] || chapterThemes[1];
};
