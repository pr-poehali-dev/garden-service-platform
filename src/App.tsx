
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
import Team from "./pages/Team";
import Reviews from "./pages/Reviews";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminOrders from "./pages/AdminOrders";
import AdminPortfolio from "./pages/AdminPortfolio";
import AdminServices from "./pages/AdminServices";
import AdminContacts from "./pages/AdminContacts";
import AdminTeam from "./pages/AdminTeam";
import AdminContent from "./pages/AdminContent";
import AdminContentPosts from "./pages/AdminContentPosts";
import AdminContentTeam from "./pages/AdminContentTeam";
import AdminContentContact from "./pages/AdminContentContact";
import AdminContentHomepage from "./pages/AdminContentHomepage";
import AdminContentReviews from "./pages/AdminContentReviews";
import AdminIntegrations from "./pages/AdminIntegrations";
import AdminApplications from "./pages/AdminApplications";
import AdminOrdersNew from "./pages/AdminOrdersNew";
import AdminServicesBlocks from "./pages/AdminServicesBlocks";
import AdminServicesCategoryEdit from "./pages/AdminServicesCategoryEdit";
import { OrderProvider } from "./contexts/OrderContext";
import { OrderRequestProvider } from "./contexts/OrderRequestContext";
import { AuthProvider } from "./contexts/AuthContext";
import { PortfolioProvider } from "./contexts/PortfolioContext";
import { SiteSettingsProvider } from "./contexts/SiteSettingsContext";
import { ServicesProvider } from "./contexts/ServicesContext";
import { AdminContentProvider } from "./contexts/AdminContentContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SiteSettingsProvider>
            <ServicesProvider>
              <PortfolioProvider>
                <OrderRequestProvider>
                  <OrderProvider>
                    <AdminContentProvider>
                      <Layout>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/services" element={<Services />} />
                          <Route path="/services/:slug" element={<ServiceCategory />} />
                          <Route path="/order" element={<Order />} />
                          <Route path="/portfolio" element={<Portfolio />} />
                          <Route path="/team" element={<Team />} />
                          <Route path="/reviews" element={<Reviews />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/admin" element={<AdminDashboard />} />
                          <Route path="/admin/login" element={<AdminLogin />} />
                          <Route path="/admin/orders" element={<AdminOrders />} />
                          <Route path="/admin/portfolio" element={<AdminPortfolio />} />
                          <Route path="/admin/services" element={<AdminServicesBlocks />} />
                          <Route path="/admin/services/:slug" element={<AdminServicesCategoryEdit />} />
                          <Route path="/admin/contacts" element={<AdminContacts />} />
                          <Route path="/admin/team" element={<AdminTeam />} />
                          <Route path="/admin/content" element={<AdminContent />} />
                          <Route path="/admin/content/posts" element={<AdminContentPosts />} />
                          <Route path="/admin/content/team" element={<AdminContentTeam />} />
                          <Route path="/admin/content/contact" element={<AdminContentContact />} />
                          <Route path="/admin/content/homepage" element={<AdminContentHomepage />} />
                          <Route path="/admin/content/reviews" element={<AdminContentReviews />} />
                          <Route path="/admin/integrations" element={<AdminIntegrations />} />
                          <Route path="/admin/applications" element={<AdminApplications />} />
                          <Route path="/admin/orders-new" element={<AdminOrdersNew />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Layout>
                    </AdminContentProvider>
                  </OrderProvider>
                </OrderRequestProvider>
              </PortfolioProvider>
            </ServicesProvider>
          </SiteSettingsProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;