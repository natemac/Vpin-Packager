import { Switch, Route, Router } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import FileOrganizer from "@/pages/file-organizer";
import NotFound from "@/pages/not-found";

function AppRouter() {
  const base = import.meta.env.PROD ? "/Vpin-Packager" : "";
  
  return (
    <Router base={base}>
      <Switch>
        <Route path="/" component={FileOrganizer} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <AppRouter />
    </TooltipProvider>
  );
}

export default App;
