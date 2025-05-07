import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  DollarSign,
  Boxes,
  ClipboardList,
  Archive,
  ShoppingCart,
  Tag,
  MapPin
} from "lucide-react";
import AddStockForm from "@/components/stock/AddStockForm";
import CurrentStock from "@/components/stock/CurrentStock";
import CategoryList from "@/components/stock/CategoryList";
import LocationList from "@/components/stock/LocationList";

const StockManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the current tab from the URL path
  const path = location.pathname.split('/');
  const currentTab = path.length > 2 ? path[2] : 'current';

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
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main className={`flex-1 p-6 md:p-8 transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <h1 className="text-2xl font-bold mb-4 md:mb-0">
              {activeForm === 'add' ? 'Add New Stock' : 'Stock Management'}
            </h1>
            
            <div className="flex flex-col md:flex-row w-full md:w-auto space-y-2 md:space-y-0 md:space-x-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search stock..." 
                  className="pl-8 pr-4 py-2 w-full rounded-md border border-input bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {!activeForm && (
                <>
                  <Button onClick={handleAddStock}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Stock
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setFilterOpen(!filterOpen)}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </>
              )}
              
              {activeForm && (
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </div>

          {filterOpen && (
            <div className="mb-6 bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium mb-3">Filter Options</h3>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select className="w-full px-3 py-2 border rounded-md">
                    <option value="">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="furniture">Furniture</option>
                    <option value="stationery">Stationery</option>
                    <option value="equipment">Equipment</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location/Department</label>
                  <select className="w-full px-3 py-2 border rounded-md">
                    <option value="">All Locations</option>
                    <option value="cs">Computer Science</option>
                    <option value="it">Information Technology</option>
                    <option value="eee">Electrical Engineering</option>
                    <option value="admin">Administrative Office</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <Button className="w-full">Apply Filters</Button>
                </div>
              </div>
            </div>
          )}

          {activeForm === 'add' ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Add New Stock</h2>
              <AddStockForm onCancel={handleCancel} />
            </div>
          ) : (
            <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-4">
              <TabsList>
                <TabsTrigger value="current" className="flex items-center">
                  <Boxes className="h-4 w-4 mr-2" />
                  Current Stock
                </TabsTrigger>
                <TabsTrigger value="allocated" className="flex items-center">
                  <Share2 className="h-4 w-4 mr-2" />
                  Allocated
                </TabsTrigger>
                <TabsTrigger value="service" className="flex items-center">
                  <Wrench className="h-4 w-4 mr-2" />
                  Service
                </TabsTrigger>
                <TabsTrigger value="trashed" className="flex items-center">
                  <Archive className="h-4 w-4 mr-2" />
                  Trashed
                </TabsTrigger>
                <TabsTrigger value="sold" className="flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Sold
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  Categories
                </TabsTrigger>
                <TabsTrigger value="locations" className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Locations
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="current" className="space-y-4">
                <CurrentStock />
              </TabsContent>
              <TabsContent value="allocated" className="space-y-4">
                <div>Allocated Stock Content</div>
              </TabsContent>
              <TabsContent value="service" className="space-y-4">
                <div>Service Stock Content</div>
              </TabsContent>
              <TabsContent value="trashed" className="space-y-4">
                <div>Trashed Stock Content</div>
              </TabsContent>
              <TabsContent value="sold" className="space-y-4">
                <div>Sold Stock Content</div>
              </TabsContent>
              <TabsContent value="categories" className="space-y-4">
                <CategoryList />
              </TabsContent>
              <TabsContent value="locations" className="space-y-4">
                <LocationList />
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </div>
  );
};

export default StockManagement;