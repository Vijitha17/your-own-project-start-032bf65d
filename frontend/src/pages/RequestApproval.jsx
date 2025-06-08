import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  ClipboardList,
  History,
  Plus
} from "lucide-react";
import RequestList from "@/components/requests/RequestList";
import CreateRequestForm from "@/components/request/CreateRequestForm";

const RequestApproval = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCreatingRequest, setIsCreatingRequest] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCreateRequest = () => {
    setIsCreatingRequest(true);
  };

  const handleCancelRequest = () => {
    setIsCreatingRequest(false);
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
  };

  const handleCloseView = () => {
    setSelectedRequest(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} />
        
        <main className={`flex-1 p-6 md:p-8 transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <h1 className="text-2xl font-bold mb-4 md:mb-0">Requests & Approvals</h1>
            
            <div className="flex items-center space-x-4">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search requests..." 
                  className="pl-8 pr-4 py-2 w-full rounded-md border border-input bg-background"
                />
              </div>
              
              <Button 
                onClick={handleCreateRequest}
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </div>
          </div>
          
          {isCreatingRequest ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Create New Request</h2>
              <CreateRequestForm onCancel={handleCancelRequest} />
            </div>
          ) : (
            <div className="space-y-6">
              <Tabs defaultValue="pending" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="pending" className="flex items-center">
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Requests
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center">
                    <History className="h-4 w-4 mr-2" />
                    Request History
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="pending">
                  <RequestList onView={handleViewRequest} />
                </TabsContent>
                
                <TabsContent value="history">
                  <RequestList onView={handleViewRequest} />
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          {selectedRequest && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">Request Details</h2>
                  <Button variant="ghost" size="sm" onClick={handleCloseView}>
                    Close
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Request ID</p>
                      <p className="font-medium">REQ-{selectedRequest.request_id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium">{selectedRequest.request_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="font-medium">{selectedRequest.department_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Requested By</p>
                      <p className="font-medium">{selectedRequest.requester_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{new Date(selectedRequest.request_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium">{selectedRequest.approval_status}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="mt-1">{selectedRequest.description}</p>
                  </div>
                  {selectedRequest.items && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Requested Items</p>
                      <div className="border rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specifications</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {selectedRequest.items.map((item, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">{item.item_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                                <td className="px-6 py-4">{item.specifications}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RequestApproval;
