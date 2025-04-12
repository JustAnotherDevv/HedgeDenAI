import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Dashboard from "@/components/Dashboard";
import VoiceChat from "./components/VoiceChat";

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <main className="min-h-screen bg-background">
        {/* <Dashboard /> */}
        <VoiceChat />
      </main>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
