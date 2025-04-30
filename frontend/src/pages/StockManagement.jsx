import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Plus, 
  Filter, 
  Package, 
  Share2, 
  Wrench,
  Trash2,
  DollarSign
} from "lucide-react";
import StockList from "@/components/stock/StockList";
import AllocatedStockList from "@/components/stock/AllocatedStockList";
import ServiceStockList from "@/components/stock/ServiceStockList";
import AddStockForm from "@/components/stock/AddStockForm";
import TrashedStockList from "@/components/stock/TrashedStockList";
import SoldStockList from "@/components/stock/SoldStockList";

const StockManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the current tab from the URL path
  const currentTab = location.pathname.split('/').pop() || '';

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAddStock = () => setActiveForm('add');
  const handleCancel = () => setActiveForm(null);

  const handleTabChange = (value) => {
    navigate(`/stock/${value}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} />
        
        <main className={`flex-1 p-6 md:p-8 transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <h1 className="text-2xl font-bold mb-4 md:mb-0">
              {activeForm === 'add' ? 'Add New Stock' : 'Stock Management'}
            </h1>
            
            <div className="flex flex-col md:flex-row w-full md:w-auto space-y-2 md:space-y-0 md:space-x-2">
              {!activeForm && (
                <>
                  <Button onClick={handleAddStock} className="w-full md:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Stock
                  </Button>
                  <Button variant="outline" className="w-full md:w-auto">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </>
              )}
            </div>
          </div>

          {activeForm === 'add' ? (
            <AddStockForm onCancel={handleCancel} />
          ) : (
            <>
              <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="">Current Stock</TabsTrigger>
                  <TabsTrigger value="allocated">Allocated</TabsTrigger>
                  <TabsTrigger value="service">Service</TabsTrigger>
                  <TabsTrigger value="trashed">Trashed</TabsTrigger>
                  <TabsTrigger value="sold">Sold</TabsTrigger>
                </TabsList>
                <TabsContent value="">
                  <StockList />
                </TabsContent>
                <TabsContent value="allocated">
                  <AllocatedStockList />
                </TabsContent>
                <TabsContent value="service">
                  <ServiceStockList />
                </TabsContent>
                <TabsContent value="trashed">
                  <TrashedStockList />
                </TabsContent>
                <TabsContent value="sold">
                  <SoldStockList />
                </TabsContent>
              </Tabs>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default StockManagement;