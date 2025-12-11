import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signUp, signIn, unlockAllGates } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const AuthModal = ({ open, onOpenChange, onSuccess }: AuthModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [masterKey, setMasterKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "錯誤",
        description: "請填寫所有欄位",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { user, error } = await signIn(email, password);

      if (error) {
        toast({
          title: "登入失敗",
          description: error.message === "Invalid login credentials" 
            ? "電子郵件或密碼錯誤" 
            : error.message,
          variant: "destructive",
        });
        return;
      }

      if (user) {
        // Check master key and unlock all gates if correct
        if (masterKey === "ABAB") {
          await unlockAllGates(user.id);
          toast({
            title: "🔓 通關密鑰已驗證！",
            description: "所有關卡已解鎖，盡情探索吧！",
          });
        } else {
          toast({
            title: "歡迎回來！",
            description: "登入成功",
          });
        }

        onSuccess();
        onOpenChange(false);
        resetForm();
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "錯誤",
        description: "登入失敗，請稍後再試",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !nickname) {
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

    if (password.length < 6) {
      toast({
        title: "錯誤",
        description: "密碼至少需要 6 個字元",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { user, error } = await signUp(email, password, nickname);

      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: "註冊失敗",
            description: "此電子郵件已被註冊，請直接登入",
            variant: "destructive",
          });
        } else {
          toast({
            title: "註冊失敗",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      if (user) {
        // Check master key and unlock all gates if correct
        if (masterKey === "ABAB") {
          await unlockAllGates(user.id);
          toast({
            title: "🔓 通關密鑰已驗證！",
            description: "所有關卡已解鎖，開始你的冒險吧！",
          });
        } else {
          toast({
            title: "註冊成功！",
            description: `歡迎 ${nickname} 加入 Algorithmia 探險之旅`,
          });
        }

        onSuccess();
        onOpenChange(false);
        resetForm();
      }
    } catch (error) {
      console.error("Register error:", error);
      toast({
        title: "錯誤",
        description: "註冊失敗，請稍後再試",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setNickname("");
    setMasterKey("");
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
            登入或註冊以追蹤學習進度
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")} className="mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-background/50 border border-temple-gold/20">
            <TabsTrigger value="login" className="data-[state=active]:bg-temple-gold/20 data-[state=active]:text-temple-gold">
              登入
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-temple-gold/20 data-[state=active]:text-temple-gold">
              註冊
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-foreground">
                  電子郵件
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="explorer@algorithmia.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-temple-gold/30 focus:border-temple-gold bg-background/50"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-foreground">
                  密碼
                </Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="輸入密碼"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-temple-gold/30 focus:border-temple-gold bg-background/50"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-masterKey" className="text-foreground flex items-center gap-2">
                  <span>🔑 通關密鑰</span>
                  <span className="text-xs text-foreground/50">(選填)</span>
                </Label>
                <Input
                  id="login-masterKey"
                  type="text"
                  placeholder="輸入通關密鑰解鎖所有關卡"
                  value={masterKey}
                  onChange={(e) => setMasterKey(e.target.value)}
                  className="border-temple-gold/30 focus:border-temple-gold bg-background/50 font-mono"
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
                {isLoading ? "處理中..." : "登入"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-foreground">
                  電子郵件
                </Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="explorer@algorithmia.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-temple-gold/30 focus:border-temple-gold bg-background/50"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-foreground">
                  密碼
                </Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="至少 6 個字元"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-temple-gold/30 focus:border-temple-gold bg-background/50"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-nickname" className="text-foreground">
                  探險者暱稱
                </Label>
                <Input
                  id="register-nickname"
                  type="text"
                  placeholder="輸入你的暱稱"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="border-temple-gold/30 focus:border-temple-gold bg-background/50"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-masterKey" className="text-foreground flex items-center gap-2">
                  <span>🔑 通關密鑰</span>
                  <span className="text-xs text-foreground/50">(選填)</span>
                </Label>
                <Input
                  id="register-masterKey"
                  type="text"
                  placeholder="輸入通關密鑰解鎖所有關卡"
                  value={masterKey}
                  onChange={(e) => setMasterKey(e.target.value)}
                  className="border-temple-gold/30 focus:border-temple-gold bg-background/50 font-mono"
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
                {isLoading ? "處理中..." : "註冊"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
