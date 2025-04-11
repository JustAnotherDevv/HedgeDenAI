import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Dashboard from "@/components/Dashboard";

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <main className="min-h-screen bg-background">
        <Dashboard />
      </main>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
