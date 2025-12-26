import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// ============================================
// PWA Service Worker Registration
// ============================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration.scope);
        
        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
}

// ============================================
// PWA Install Prompt
// ============================================
let deferredPrompt: any;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the default install prompt
  e.preventDefault();
  deferredPrompt = e;
  
  // Optional: Show custom install button
  console.log('💡 PWA Install available');
  
  // You can show a custom install button here
  // Example: showInstallButton();
});

window.addEventListener('appinstalled', () => {
  console.log('🎉 PWA installed successfully!');
  deferredPrompt = null;
});

