import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { ProfileProvider } from "./context/ProfileContext.tsx";
import { ModeProvider } from "./context/ModeContext.tsx";
import { SidebarProvider } from "./context/SidebarContext.tsx";
import { patchSpeechSynthesis } from "./utils/patchSpeechSynthesis";

// Ensure all modules that use window.speechSynthesis directly
// still respect the global voice instructions setting.
patchSpeechSynthesis();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ProfileProvider>
        <SidebarProvider>
          <ModeProvider>
            <AppWrapper>
              <App />
            </AppWrapper>
          </ModeProvider>
        </SidebarProvider>
      </ProfileProvider>
    </ThemeProvider>
  </StrictMode>,
);
