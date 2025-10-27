
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceCategory from "./pages/ServiceCategory";
import Order from "./pages/Order";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminOrders from "./pages/AdminOrders";
import AdminPortfolio from "./pages/AdminPortfolio";
import AdminServices from "./pages/AdminServices";
import AdminContacts from "./pages/AdminContacts";
import { OrderProvider } from "./contexts/OrderContext";
import { OrderRequestProvider } from "./contexts/OrderRequestContext";
import { AuthProvider } from "./contexts/AuthContext";
import { PortfolioProvider } from "./contexts/PortfolioContext";
import { SiteSettingsProvider } from "./contexts/SiteSettingsContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SiteSettingsProvider>
            <PortfolioProvider>
              <OrderRequestProvider>
                <OrderProvider>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/services/:slug" element={<ServiceCategory />} />
                      <Route path="/order" element={<Order />} />
                      <Route path="/portfolio" element={<Portfolio />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/admin/login" element={<AdminLogin />} />
                      <Route path="/admin/orders" element={<AdminOrders />} />
                      <Route path="/admin/portfolio" element={<AdminPortfolio />} />
                      <Route path="/admin/services" element={<AdminServices />} />
                      <Route path="/admin/contacts" element={<AdminContacts />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                </OrderProvider>
              </OrderRequestProvider>
            </PortfolioProvider>
          </SiteSettingsProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;