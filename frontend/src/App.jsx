// src/App.jsx
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import AddDepartmentForm from "./components/users/AddDepartmentForm.jsx";
import AddCollegeForm from "./components/users/AddCollegeForm.jsx";
import AddCategoryForm from "./components/stock/AddCategoryForm.jsx";
import AddLocationForm from "./components/stock/AddLocationForm.jsx";
import CurrentStock from "./components/stock/CurrentStock";
import CategoryList from "./components/stock/CategoryList";
import LocationList from "./components/stock/LocationList";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <AuthRoute><Dashboard /></AuthRoute>,
  },
  {
    path: "/profile",
    element: <AuthRoute><Profile /></AuthRoute>,
  },
  {
    path: "/reports",
    element: <AuthRoute><Reports /></AuthRoute>,
  },
  {
    path: "/users",
    element: <AuthRoute><UserManagement /></AuthRoute>,
    children: [
      { index: true, element: <></> },
      { path: ":id", element: <></> },
    ],
  },
  {
    path: "/users/departments/add",
    element: <AuthRoute><AddDepartmentForm /></AuthRoute>,
  },
  {
    path: "/users/colleges/add",
    element: <AuthRoute><AddCollegeForm /></AuthRoute>,
  },
  {
    path: "/requirement",
    element: <AuthRoute><Requirements /></AuthRoute>,
    children: [
      { index: true, element: <></> },
      { path: "current", element: <></> },
      { path: "history", element: <></> },
    ],
  },
  {
    path: "/stock",
    element: <AuthRoute><StockManagement /></AuthRoute>,
    children: [
      { index: true, element: <CurrentStock /> },
      { path: "current", element: <CurrentStock /> },
      { path: "allocated", element: <></> },
      { path: "service", element: <></> },
      { path: "trashed", element: <></> },
      { path: "sold", element: <></> },
      { path: "categories", element: <CategoryList /> },
      { path: "locations", element: <LocationList /> },
    ],
  },
  {
    path: "/stock/categories/add",
    element: <AuthRoute><AddCategoryForm /></AuthRoute>,
  },
  {
    path: "/stock/locations/add",
    element: <AuthRoute><AddLocationForm /></AuthRoute>,
  },
  {
    path: "/movement",
    element: <AuthRoute><StockMovement /></AuthRoute>,
    children: [
      { index: true, element: <></> },
      { path: ":id", element: <></> },
    ],
  },
  {
    path: "/vendor",
    element: <AuthRoute><VendorManagement /></AuthRoute>,
    children: [
      { index: true, element: <></> },
      { path: ":id", element: <></> },
    ],
  },
  {
    path: "/purchase",
    element: <AuthRoute><PurchaseManagement /></AuthRoute>,
    children: [
      { index: true, element: <></> },
      { path: ":id", element: <></> },
    ],
  },
  {
    path: "/expenditure",
    element: <AuthRoute><ExpenditureManagement /></AuthRoute>,
    children: [
      { index: true, element: <></> },
      { path: ":id", element: <></> },
    ],
  },
  {
    path: "/request",
    element: <AuthRoute><RequestApproval /></AuthRoute>,
    children: [
      { index: true, element: <></> },
      { path: ":id", element: <></> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  }
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
