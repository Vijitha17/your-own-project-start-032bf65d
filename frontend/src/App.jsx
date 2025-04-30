// src/App.jsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Index from "./pages/Index.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NotFound from "./pages/NotFound.tsx";
import Reports from "./pages/Reports.jsx";
import UserManagement from "./pages/UserManagement.jsx";
import Requirements from "./pages/Requirements.jsx";
import StockManagement from "./pages/StockManagement.jsx";
import StockMovement from "./pages/StockMovement.jsx";
import VendorManagement from "./pages/VendorManagement.jsx";
import PurchaseManagement from "./pages/PurchaseManagement.jsx";
import ExpenditureManagement from "./pages/ExpenditureManagement.jsx";
import RequestApproval from "./pages/RequestApproval.jsx";
import Profile from "./pages/Profile.jsx";
import AuthRoute from "./components/AuthRoute.jsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<AuthRoute><Dashboard /></AuthRoute>} />
          <Route path="/profile" element={<AuthRoute><Profile /></AuthRoute>} />
          <Route path="/reports" element={<AuthRoute><Reports /></AuthRoute>} />
          
          {/* User Management Routes */}
          <Route path="/users" element={<AuthRoute><UserManagement /></AuthRoute>}>
            <Route index element={<Outlet />} />
            <Route path=":id" element={<Outlet />} />
          </Route>

          {/* Requirement Routes */}
          <Route path="/requirement" element={<AuthRoute><Requirements /></AuthRoute>}>
            <Route index element={<Outlet />} />
            <Route path="current" element={<Outlet />} />
            <Route path="history" element={<Outlet />} />
          </Route>

          {/* Stock Management Routes */}
          <Route path="/stock" element={<AuthRoute><StockManagement /></AuthRoute>}>
            <Route index element={<Outlet />} />
            <Route path="allocated" element={<Outlet />} />
            <Route path="service" element={<Outlet />} />
            <Route path="trashed" element={<Outlet />} />
            <Route path="sold" element={<Outlet />} />
          </Route>

          {/* Stock Movement Routes */}
          <Route path="/movement" element={<AuthRoute><StockMovement /></AuthRoute>}>
            <Route index element={<Outlet />} />
            <Route path=":id" element={<Outlet />} />
          </Route>

          {/* Vendor Management Routes */}
          <Route path="/vendor" element={<AuthRoute><VendorManagement /></AuthRoute>}>
            <Route index element={<Outlet />} />
            <Route path=":id" element={<Outlet />} />
          </Route>

          {/* Purchase Management Routes */}
          <Route path="/purchase" element={<AuthRoute><PurchaseManagement /></AuthRoute>}>
            <Route index element={<Outlet />} />
            <Route path=":id" element={<Outlet />} />
          </Route>

          {/* Expenditure Management Routes */}
          <Route path="/expenditure" element={<AuthRoute><ExpenditureManagement /></AuthRoute>}>
            <Route index element={<Outlet />} />
            <Route path=":id" element={<Outlet />} />
          </Route>

          {/* Request Approval Routes */}
          <Route path="/request" element={<AuthRoute><RequestApproval /></AuthRoute>}>
            <Route index element={<Outlet />} />
            <Route path=":id" element={<Outlet />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;