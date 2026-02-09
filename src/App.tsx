import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/components/ui/toaster";

import Home from "@/pages/Home";
import Product from "@/pages/Product";
import HowItWorks from "@/pages/HowItWorks";
import Gallery from "@/pages/Gallery";
import Quote from "@/pages/Quote";
import Login from "@/pages/Login";
import DashboardLayout from "@/pages/DashboardLayout";
import NotFound from "@/pages/not-found";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/smart-film" component={Product} />
          <Route path="/how-it-works" component={HowItWorks} />
          <Route path="/gallery" component={Gallery} />
          <Route path="/quote" component={Quote} />
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={DashboardLayout} />
          <Route path="/dashboard/:rest*" component={DashboardLayout} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
