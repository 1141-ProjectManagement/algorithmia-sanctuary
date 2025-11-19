import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createUser, getUserByEmail, setCurrentUser, createAdminUser } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, ShieldCheck } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const AuthModal = ({ open, onOpenChange, onSuccess }: AuthModalProps) => {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAdminLogin = async () => {
    setIsLoading(true);
    try {
      const adminUser = await createAdminUser();
      if (adminUser) {
        setCurrentUser(adminUser.email);
        toast({
          title: "管理員登入成功",
          description: "已解鎖所有課程關卡",
        });
        onSuccess();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast({
        title: "錯誤",
        description: "管理員登入失敗",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !nickname) {
      toast({
        title: "錯誤",
        description: "請填寫所有欄位",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "錯誤",
        description: "請輸入有效的電子郵件地址",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check if user exists
      const existingUser = await getUserByEmail(email);
      
      if (existingUser) {
        // User exists, login
        setCurrentUser(email);
        toast({
          title: "歡迎回來！",
          description: `${existingUser.nickname}，很高興再次見到你`,
        });
      } else {
        // Create new user
        const newUser = await createUser(email, nickname);
        if (newUser) {
          setCurrentUser(email);
          toast({
            title: "註冊成功！",
            description: `歡迎 ${nickname} 加入 Algorithmia 探險之旅`,
          });
        } else {
          throw new Error("創建用戶失敗");
        }
      }

      onSuccess();
      onOpenChange(false);
      setEmail("");
      setNickname("");
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        title: "錯誤",
        description: "登入/註冊失敗，請稍後再試",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-temple-gold/20">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 mb-4 relative">
            <Sparkles className="w-6 h-6 text-temple-gold animate-pulse-glow" />
            <DialogTitle className="font-cinzel text-2xl text-temple-gold">
              開始探險
            </DialogTitle>
            
            {/* Admin Icon */}
            <HoverCard>
              <HoverCardTrigger asChild>
                <button
                  type="button"
                  onClick={handleAdminLogin}
                  disabled={isLoading}
                  className="absolute right-0 p-2 rounded-lg hover:bg-temple-gold/10 transition-all duration-300 group"
                  aria-label="管理員登入"
                >
                  <ShieldCheck className="w-5 h-5 text-temple-gold/50 group-hover:text-temple-gold group-hover:scale-110 transition-all" />
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 bg-background border-temple-gold/20">
                <div className="space-y-2">
                  <h4 className="text-sm font-cinzel text-temple-gold font-semibold">管理員快速登入</h4>
                  <p className="text-xs text-foreground/70">
                    點擊此圖標可創建並登入管理員帳號，自動解鎖所有課程關卡。
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          <DialogDescription className="text-center text-foreground/70">
            輸入你的資料以追蹤學習進度
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              電子郵件
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="explorer@algorithmia.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-temple-gold/30 focus:border-temple-gold bg-background/50"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nickname" className="text-foreground">
              探險者暱稱
            </Label>
            <Input
              id="nickname"
              type="text"
              placeholder="輸入你的暱稱"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="border-temple-gold/30 focus:border-temple-gold bg-background/50"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full font-cinzel bg-temple-gold/20 text-temple-gold border-2 border-temple-gold hover:bg-temple-gold/30 transition-all duration-300"
            style={{
              boxShadow: "0 0 20px hsla(43, 74%, 53%, 0.3)",
            }}
            disabled={isLoading}
          >
            {isLoading ? "處理中..." : "開始冒險"}
          </Button>

          <p className="text-xs text-center text-foreground/50">
            未來將支援 OAuth 第三方登入
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};
