import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { signInWithGoogle, setMasterKeyPending } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const AuthModal = ({ open, onOpenChange, onSuccess }: AuthModalProps) => {
  const [masterKey, setMasterKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    try {
      // Store master key if provided (will be processed after OAuth redirect)
      if (masterKey === "ABAB") {
        setMasterKeyPending(masterKey);
      }

      const { error } = await signInWithGoogle();

      if (error) {
        toast({
          title: "登入失敗",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
      }
      // Note: On success, the page will redirect to Google, so no need to handle success here
    } catch (error) {
      console.error("Google sign in error:", error);
      toast({
        title: "錯誤",
        description: "登入失敗，請稍後再試",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-temple-gold/20">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-temple-gold animate-pulse-glow" />
            <DialogTitle className="font-cinzel text-2xl text-temple-gold">
              開始探險
            </DialogTitle>
          </div>
          <DialogDescription className="text-center text-foreground/70">
            使用 Google 帳號登入以追蹤學習進度
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="masterKey" className="text-foreground flex items-center gap-2">
              <span>🔑 通關密鑰</span>
              <span className="text-xs text-foreground/50">(選填)</span>
            </Label>
            <Input
              id="masterKey"
              type="text"
              placeholder="輸入通關密鑰解鎖所有關卡"
              value={masterKey}
              onChange={(e) => setMasterKey(e.target.value)}
              className="border-temple-gold/30 focus:border-temple-gold bg-background/50 font-mono"
              disabled={isLoading}
            />
          </div>

          <Button
            onClick={handleGoogleSignIn}
            className="w-full font-cinzel bg-temple-gold/20 text-temple-gold border-2 border-temple-gold hover:bg-temple-gold/30 transition-all duration-300 flex items-center justify-center gap-3"
            style={{
              boxShadow: "0 0 20px hsla(43, 74%, 53%, 0.3)",
            }}
            disabled={isLoading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isLoading ? "處理中..." : "使用 Google 登入"}
          </Button>

          <p className="text-xs text-center text-foreground/50">
            登入即表示您同意我們的服務條款與隱私政策
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
