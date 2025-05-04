import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Search, Plus, RefreshCw, X } from "lucide-react";
import VendorList from "@/components/vendors/VendorList";
import VendorForm from "@/components/vendors/VendorForm";
import { toast } from "@/components/ui/use-toast";
import api from "@/lib/api";

const VendorManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch vendors from backend
  const fetchVendors = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/vendors');
      setVendors(response.data?.data || response.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch vendors",
        variant: "destructive"
      });
      console.error("Error fetching vendors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Filter vendors based on search term
  const filteredVendors = vendors.filter(vendor => 
    vendor.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.vendor_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.phone.includes(searchTerm) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.contact_person.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVendor = async (newVendor) => {
    try {
      const response = await api.post('/vendors', newVendor);
      setVendors(prev => [...prev, response.data.data]);
      
      toast({
        title: "Vendor Added",
        description: `${newVendor.vendor_name} has been added successfully.`,
      });
      setIsCreating(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add vendor",
        variant: "destructive"
      });
    }
  };

  const handleUpdateVendor = async (updatedVendor) => {
    try {
      const response = await api.put(`/vendors/${updatedVendor.vendor_id}`, updatedVendor);
      setVendors(prev => prev.map(v => 
        v.vendor_id === updatedVendor.vendor_id ? response.data.data : v
      ));
      
      toast({
        title: "Vendor Updated",
        description: `${updatedVendor.vendor_name} has been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update vendor",
        variant: "destructive"
      });
    }
  };

  const handleDeleteVendor = async (vendorId) => {
    try {
      await api.delete(`/vendors/${vendorId}`);
      setVendors(prev => prev.filter(v => v.vendor_id !== vendorId));
      
      toast({
        title: "Vendor Deleted",
        description: "Vendor has been removed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete vendor",
        variant: "destructive"
      });
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} />
        
        <main className={`flex-1 p-6 md:p-8 transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <h1 className="text-2xl font-bold mb-4 md:mb-0">Vendor Management</h1>
            
            <div className="flex flex-col md:flex-row w-full md:w-auto space-y-2 md:space-y-0 md:space-x-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search vendors..." 
                  className="pl-8 pr-4 py-2 w-full rounded-md border border-input bg-background"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-2.5 top-2.5 h-4 w-4"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              {searchTerm && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={resetFilters}
                  className="flex items-center"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Reset
                </Button>
              )}
              
              {!isCreating && (
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vendor
                </Button>
              )}
              
              {isCreating && (
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
          
          {isCreating ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Add New Vendor</h2>
              <VendorForm 
                onCancel={() => setIsCreating(false)}
                onSave={handleAddVendor}
              />
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              <VendorList 
                vendors={filteredVendors} 
                onDelete={handleDeleteVendor}
                onUpdate={handleUpdateVendor}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default VendorManagement;