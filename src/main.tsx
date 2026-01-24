import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerSW } from "virtual:pwa-register";

// Enregistrement du Service Worker pour le mode hors-ligne
registerSW({
  onNeedRefresh() {
    console.log("Nouvelle version disponible");
  },
  onOfflineReady() {
    console.log("Application prête pour le mode hors-ligne");
  },
});

createRoot(document.getElementById("root")!).render(<App />);
