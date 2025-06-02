import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  ClipboardList,
  History,
  Plus,
  CheckCircle,
  XCircle,
  Eye
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ApprovalDetail from "@/components/approval/ApprovalDetail";
import CreateRequestForm from "@/components/request/CreateRequestForm";

const RequestApproval = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCreatingRequest, setIsCreatingRequest] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [requests, setRequests] = useState([
    {
      id: "REQ001",
      type: "Purchase",
      department: "Computer Science",
      description: "New Computers for the lab to replace the old equipment. Urgent need for the next semester.",
      requestedBy: "John Doe",
      date: "2025-04-15",
      status: "pending",
      items: "10 x Desktop Computers",
      amount: 15000,
      vendor: "TechSupplies Ltd."
    },
    {
      id: "REQ002",
      type: "Service",
      department: "Physics",
      description: "Equipment Maintenance",
      requestedBy: "Jane Smith",
      date: "2025-04-16",
      status: "pending",
      items: "5 x Lab Equipment Service",
      amount: 3500,
      vendor: "Lab Services Co."
    },
    {
      id: "REQ003",
      type: "Purchase",
      department: "Chemistry",
      description: "Lab Supplies",
      requestedBy: "Alex Brown",
      date: "2025-04-18",
      status: "pending",
      items: "Various chemicals and equipment",
      amount: 7800,
      vendor: "Science Supplies Inc."
    }
  ]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} />
        
        <main className={`flex-1 p-6 md:p-8 transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <h1 className="text-2xl font-bold mb-4 md:mb-0">Requests & Approval</h1>
            
            <div className="flex flex-col md:flex-row w-full md:w-auto space-y-2 md:space-y-0 md:space-x-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search requests..." 
                  className="pl-8 pr-4 py-2 w-full rounded-md border border-input bg-background"
                />
              </div>
              
              {!isCreatingRequest && (
                <Button onClick={() => setIsCreatingRequest(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Request
                </Button>
              )}
            </div>
          </div>
          
          {isCreatingRequest ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Create New Request</h2>
              <CreateRequestForm onCancel={() => setIsCreatingRequest(false)} />
            </div>
          ) : (
            <div className="space-y-6">
              <Tabs defaultValue="pending" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="pending" className="flex items-center">
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Pending Requests
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center">
                    <History className="h-4 w-4 mr-2" />
                    Request History
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="pending">
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Request ID</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Requested By</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>{request.id}</TableCell>
                            <TableCell>{request.type}</TableCell>
                            <TableCell>{request.department}</TableCell>
                            <TableCell>{request.requestedBy}</TableCell>
                            <TableCell>{request.date}</TableCell>
                            <TableCell>{getStatusBadge(request.status)}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedApproval(request)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {request.status === 'pending' && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-green-600 hover:text-green-700"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="history">
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Request ID</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Requested By</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>{request.id}</TableCell>
                            <TableCell>{request.type}</TableCell>
                            <TableCell>{request.department}</TableCell>
                            <TableCell>{request.requestedBy}</TableCell>
                            <TableCell>{request.date}</TableCell>
                            <TableCell>{getStatusBadge(request.status)}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedApproval(request)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          {selectedApproval && (
            <ApprovalDetail
              request={selectedApproval}
              onClose={() => setSelectedApproval(null)}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default RequestApproval;
