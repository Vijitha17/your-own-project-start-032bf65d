import React, { useState, useEffect } from "react";
import { 
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Eye,
  Trash2,
  CheckCircle,
  XCircle
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getPurchaseRequests, updatePurchaseRequestStatus, getPurchaseRequestById } from "@/lib/api";
import ViewPurchaseRequestDetails from "./PurchaseRequestList_Part1";
import { useAuth } from "@/lib/auth"; // Import useAuth hook

// Helper function for approval status badge
const getApprovalStatusBadge = (status) => {
  const statusColors = {
    Approved: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
    Pending: "bg-yellow-100 text-yellow-800",
    "Partially Approved": "bg-blue-100 text-blue-800"
  };

  return (
    <Badge variant="outline" className={`${statusColors[status] || "bg-gray-100 text-gray-800"} border-none`}>
      {status}
    </Badge>
  );
};

const PurchaseRequestList = () => {
  const { user } = useAuth(); // Get current user
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestToDelete, setRequestToDelete] = useState(null);

  // Get user role from localStorage
  const userRole = localStorage.getItem('userRole');
  
  // Debug log for user role
  useEffect(() => {
    console.log('Current user:', user);
    console.log('User role from localStorage:', userRole);
  }, [user, userRole]);

  useEffect(() => {
    const fetchPurchaseRequests = async () => {
      setLoading(true);
      try {
        const data = await getPurchaseRequests();
        console.log('Purchase Requests:', data); // Debug log
        setPurchaseRequests(data);
      } catch (error) {
        console.error('Error fetching purchase requests:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to fetch purchase requests.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseRequests();
  }, []);

  const handleViewDetails = async (request) => {
    try {
      const response = await getPurchaseRequestById(request.purchase_request_id);
      console.log('Detailed Request Response:', response); // Debug log
      setSelectedRequest(response.data);
      setIsViewDialogOpen(true);
    } catch (error) {
      console.error('Error fetching purchase request details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch purchase request details.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteRequest = (request) => {
    setRequestToDelete(request);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteRequest = () => {
    setPurchaseRequests(prev => prev.filter(r => r.purchase_request_id !== requestToDelete.purchase_request_id));
    toast({
      title: "Request Deleted",
      description: `Request #${requestToDelete.purchase_request_id} has been deleted.`,
    });
    setIsDeleteDialogOpen(false);
  };

  const handleStatusUpdate = async (request, newStatus) => {
    try {
      await updatePurchaseRequestStatus(request.purchase_request_id, newStatus);
      setPurchaseRequests(prev => prev.map(r => 
        r.purchase_request_id === request.purchase_request_id 
          ? { 
              ...r, 
              approval_status: newStatus,
              approved_date: newStatus !== 'Pending' ? new Date().toISOString() : null,
              updated_at: new Date().toISOString() 
            } 
          : r
      ));
      toast({
        title: "Status Updated",
        description: `Request #${request.purchase_request_id} is now marked as ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status.",
        variant: "destructive"
      });
    }
  };

  // Helper function to check if user can perform actions
  const canPerformAction = (request) => {
    console.log('Checking permissions for:', {
      userRole: userRole,
      requestStatus: request.approval_status,
      canPerform: userRole === 'Management' && request.approval_status === 'Pending'
    });
    return userRole === 'Management' && request.approval_status === 'Pending';
  };

  // Helper function to get available actions based on user role and request status
  const getAvailableActions = (request) => {
    const actions = [];

    // Management role can approve/reject pending requests
    if (userRole === 'Management' && request.approval_status === 'Pending') {
      actions.push(
        <DropdownMenuItem key="approve" onClick={() => handleStatusUpdate(request, "Approved")}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Approve
        </DropdownMenuItem>,
        <DropdownMenuItem 
          key="reject"
          className="text-red-600"
          onClick={() => handleStatusUpdate(request, "Rejected")}
        >
          <XCircle className="mr-2 h-4 w-4" />
          Reject
        </DropdownMenuItem>
      );
    }

    // Add view details action for all roles
    actions.push(
      <DropdownMenuItem key="view" onClick={() => handleViewDetails(request)}>
        <Eye className="mr-2 h-4 w-4" />
        View Details
      </DropdownMenuItem>
    );

    return actions;
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <p>Loading purchase requests...</p>
      ) : (
        <>
          <h2 className="text-lg font-medium">Purchase Requests</h2>

          {userRole === 'Management' && (
            <div className="space-y-6">
              {/* Pending Requests Section */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold text-yellow-600">Pending Requests</h3>
                  <p className="text-sm text-gray-500">Requests awaiting your approval</p>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Purchase Request ID</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead>Approver</TableHead>
                      <TableHead>No. of Items</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="text-right">
                        Actions
                        <div className="flex items-center justify-end gap-2 mt-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => {
                              purchaseRequests.filter(r => r.approval_status === 'Pending').forEach(r => {
                                handleStatusUpdate(r, 'Approved');
                              });
                            }}
                          >
                            Approve All
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => {
                              purchaseRequests.filter(r => r.approval_status === 'Pending').forEach(r => {
                                handleStatusUpdate(r, 'Rejected');
                              });
                            }}
                          >
                            Reject All
                          </Button>
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseRequests
                      .filter(request => request.approval_status === 'Pending')
                      .map((request) => (
                        <TableRow key={request.purchase_request_id}>
                          <TableCell className="font-medium">PR-{request.purchase_request_id}</TableCell>
                          <TableCell>{new Date(request.request_date).toLocaleDateString()}</TableCell>
                          <TableCell>{request.requester_name || request.requested_by}</TableCell>
                          <TableCell>{request.approver_name || request.approve_by}</TableCell>
                          <TableCell>{request.no_of_items || 0}</TableCell>
                          <TableCell>
                            <Button size="sm" onClick={() => handleViewDetails(request)}>
                              View Items
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleStatusUpdate(request, "Approved")}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleStatusUpdate(request, "Rejected")}
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleViewDetails(request)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Other Requests Section */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold">Other Requests</h3>
                  <p className="text-sm text-gray-500">Approved and rejected requests</p>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Purchase Request ID</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead>Approver</TableHead>
                      <TableHead>No. of Items</TableHead>
                      <TableHead>Approval Status</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseRequests
                      .filter(request => request.approval_status !== 'Pending')
                      .map((request) => (
                        <TableRow key={request.purchase_request_id}>
                          <TableCell className="font-medium">PR-{request.purchase_request_id}</TableCell>
                          <TableCell>{new Date(request.request_date).toLocaleDateString()}</TableCell>
                          <TableCell>{request.requester_name || request.requested_by}</TableCell>
                          <TableCell>{request.approver_name || request.approve_by}</TableCell>
                          <TableCell>{request.no_of_items || 0}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`${
                              request.approval_status === "Approved" ? "bg-green-100 text-green-800" :
                              request.approval_status === "Rejected" ? "bg-red-100 text-red-800" :
                              "bg-gray-100 text-gray-800"
                            } border-none`}>
                              {request.approval_status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" onClick={() => handleViewDetails(request)}>
                              View Items
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDetails(request)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Regular view for non-Management users */}
          {userRole !== 'Management' && (
            <div className="bg-white rounded-lg shadow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Purchase Request ID</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Approver</TableHead>
                    <TableHead>No. of Items</TableHead>
                    <TableHead>Approval Status</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseRequests.map((request) => (
                    <TableRow key={request.purchase_request_id}>
                      <TableCell className="font-medium">PR-{request.purchase_request_id}</TableCell>
                      <TableCell>{new Date(request.request_date).toLocaleDateString()}</TableCell>
                      <TableCell>{request.requester_name || request.requested_by}</TableCell>
                      <TableCell>{request.approver_name || request.approve_by}</TableCell>
                      <TableCell>{request.no_of_items || 0}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${
                          request.approval_status === "Approved" ? "bg-green-100 text-green-800" :
                          request.approval_status === "Rejected" ? "bg-red-100 text-red-800" :
                          request.approval_status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                          "bg-gray-100 text-gray-800"
                        } border-none`}>
                          {request.approval_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => handleViewDetails(request)}>
                          View Items
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {userRole === 'Management_Admin' && request.approval_status === 'Pending' && (
                              <>
                                <DropdownMenuItem onClick={() => handleStatusUpdate(request, "Approved")}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleStatusUpdate(request, "Rejected")}
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
                            <DropdownMenuItem onClick={() => handleViewDetails(request)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}

      {/* View Details Modal */}
      <ViewPurchaseRequestDetails 
        request={selectedRequest} 
        isOpen={isViewDialogOpen} 
        onClose={() => setIsViewDialogOpen(false)} 
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete purchase request #{requestToDelete?.purchase_request_id} 
              and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteRequest}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PurchaseRequestList;
