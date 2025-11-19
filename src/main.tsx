import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initDatabase, createAdminUser } from "./lib/database";

// 初始化資料庫並創建管理員帳號
initDatabase().then(async () => {
  // 自動注入管理員種子數據
  await createAdminUser();
  console.log('Database initialized. Admin account: admin@admin.com');
});

createRoot(document.getElementById("root")!).render(<App />);
