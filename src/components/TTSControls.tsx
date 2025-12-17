import { Volume2, VolumeX, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TTSControlsProps {
  isSpeaking: boolean;
  isLoading: boolean;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onStop: () => void;
  onReplay: () => void;
  accentColor?: string;
}

const SPEED_OPTIONS = [
  { value: 0.7, label: "0.7x" },
  { value: 0.85, label: "0.85x" },
  { value: 1, label: "1x" },
  { value: 1.1, label: "1.1x" },
  { value: 1.2, label: "1.2x" },
];

export const TTSControls = ({
  isSpeaking,
  isLoading,
  speed,
  onSpeedChange,
  onStop,
  onReplay,
  accentColor = "hsl(var(--primary))",
}: TTSControlsProps) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50">
      {/* Speaking indicator */}
      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">載入語音...</span>
        </div>
      ) : isSpeaking ? (
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1"
            style={{ color: accentColor }}
          >
            <Volume2 className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-medium">朗讀中</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={onStop}
            className="h-7 px-2 hover:bg-destructive/10 hover:text-destructive"
          >
            <VolumeX className="w-4 h-4 mr-1" />
            停止
          </Button>
        </div>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          onClick={onReplay}
          className="h-7"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          重新朗讀
        </Button>
      )}

      {/* Speed selector */}
      <div className="flex items-center gap-2 ml-auto">
        <span className="text-xs text-muted-foreground">速度</span>
        <Select
          value={speed.toString()}
          onValueChange={(v) => onSpeedChange(parseFloat(v))}
        >
          <SelectTrigger className="h-7 w-20 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SPEED_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value.toString()}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TTSControls;
