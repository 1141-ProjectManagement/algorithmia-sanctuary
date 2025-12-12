import { motion } from "framer-motion";
import { Music, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AudioControlsProps {
  bgmPlaying: boolean;
  sfxEnabled: boolean;
  volume: number;
  onToggleBgm: () => void;
  onToggleSfx: () => void;
  onVolumeChange: (volume: number) => void;
  onButtonClick?: () => void;
}

export function AudioControls({
  bgmPlaying,
  sfxEnabled,
  volume,
  onToggleBgm,
  onToggleSfx,
  onVolumeChange,
  onButtonClick,
}: AudioControlsProps) {
  const handleClick = (action: () => void) => {
    onButtonClick?.();
    action();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2"
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-background/80 backdrop-blur-sm border-primary/30 hover:border-primary hover:bg-primary/10 shadow-lg"
            onClick={() => onButtonClick?.()}
          >
            <Volume2 className="h-5 w-5 text-primary" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="left"
          className="w-48 bg-background/95 backdrop-blur-sm border-primary/30"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">音量</span>
              <span className="text-sm text-primary">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <Slider
              value={[volume * 100]}
              onValueChange={([val]) => onVolumeChange(val / 100)}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex gap-2">
              <Button
                variant={bgmPlaying ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => handleClick(onToggleBgm)}
              >
                <Music className="h-4 w-4 mr-1" />
                {bgmPlaying ? "暫停" : "播放"}
              </Button>
              <Button
                variant={sfxEnabled ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => handleClick(onToggleSfx)}
              >
                {sfxEnabled ? (
                  <Volume2 className="h-4 w-4 mr-1" />
                ) : (
                  <VolumeX className="h-4 w-4 mr-1" />
                )}
                音效
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Button
        variant={bgmPlaying ? "default" : "outline"}
        size="icon"
        className="rounded-full bg-background/80 backdrop-blur-sm border-primary/30 hover:border-primary hover:bg-primary/10 shadow-lg"
        onClick={() => handleClick(onToggleBgm)}
      >
        <Music className={`h-5 w-5 ${bgmPlaying ? "text-primary-foreground" : "text-primary"}`} />
      </Button>
    </motion.div>
  );
}
