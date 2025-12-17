import { ReactNode } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import PaywallOverlay from "@/components/PaywallOverlay";

interface ProtectedChapterProps {
  children: ReactNode;
  chapterNumber: number;
}

const ProtectedChapter = ({ children, chapterNumber }: ProtectedChapterProps) => {
  const { canAccessChapter, isLoading } = useSubscription();

  // Don't show paywall while loading
  if (isLoading) {
    return <>{children}</>;
  }

  // Chapter 1 is always free
  if (chapterNumber === 1) {
    return <>{children}</>;
  }

  // Check if user can access this chapter
  if (!canAccessChapter(chapterNumber)) {
    return (
      <>
        {children}
        <PaywallOverlay 
          title={`第 ${chapterNumber} 章需要冒險家權限`}
          description="升級至冒險家方案，解鎖全部 6 章 28 關卡"
        />
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedChapter;
