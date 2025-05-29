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
import {
  MoreHorizontal,
  Eye,
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
import { getPurchaseRequests, updatePurchaseRequestStatus } from "@/lib/api";
import ViewPurchaseRequestDetails from "./PurchaseRequestList_Part1";

const PurchaseRequestList = () => {
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestToDelete, setRequestToDelete] = useState(null);

  useEffect(() => {
    const fetchPurchaseRequests = async () => {
      setLoading(true);
      try {
        const data = await getPurchaseRequests();
        setPurchaseRequests(data);
      } catch (error) {
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

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setIsViewDialogOpen(true);
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

  return (
    <div className="space-y-4">
      {loading ? (
        <p>Loading purchase requests...</p>
      ) : (
        <>
          <h2 className="text-lg font-medium">Purchase Requests</h2>

          <div className="bg-white rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Approved By</TableHead>
                  <TableHead>Total Estimated Cost</TableHead>
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
                    <TableCell>{request.notes || "-"}</TableCell>
                    <TableCell>{request.requester_name || request.requested_by}</TableCell>
                    <TableCell>{request.approver_name || request.approve_by}</TableCell>
                    <TableCell>₹{request.total_estimated_cost?.toLocaleString() || "0"}</TableCell>
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
                        View Items ({request.items ? request.items.length : 0})
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
                          {request.approval_status === "Pending" && (
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
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteRequest(request)}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Delete Request
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
