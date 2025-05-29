import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { XCircle, CheckCircle, X } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

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

const ViewPurchaseRequestDetails = ({ request, isOpen, onClose }) => {
  if (!request || !isOpen) return null;

  const handleItemStatusUpdate = async (itemId, newStatus) => {
    try {
      // TODO: Implement item status update API call
      console.log(`Updating item ${itemId} status to ${newStatus}`);
    } catch (error) {
      console.error('Error updating item status:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold">Purchase Request Details</h2>
              <p className="text-sm text-gray-500 mt-1">
                PR-{request.purchase_request_id} • Created: {formatDate(request.request_date)}
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Basic Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Request Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Request ID</p>
                    <p className="mt-1">PR-{request.purchase_request_id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <div className="mt-1">{getApprovalStatusBadge(request.approval_status)}</div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Requested By</p>
                    <p className="mt-1">{request.requester_name || request.requested_by}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Request Date</p>
                    <p className="mt-1">{formatDate(request.request_date)}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Approval Information</h3>
                <div>
                  <p className="text-sm font-medium text-gray-500">Approved By</p>
                  <p className="mt-1">{request.approver_name || request.approve_by}</p>
                </div>
                {request.approval_status !== 'Pending' && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Approval Date</p>
                    <p className="mt-1">{formatDate(request.approved_date)}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Items Table Section */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-700">Item Details</h3>
              {request.items && request.items.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item ID</TableHead>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Cost</TableHead>
                        <TableHead>Total Cost</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {request.items.map((item) => (
                        <TableRow key={item.purchaserequest_item_id}>
                          <TableCell>{item.purchaserequest_item_id}</TableCell>
                          <TableCell>{item.item_name}</TableCell>
                          <TableCell>{item.category_name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>₹{item.estimated_unit_cost?.toLocaleString()}</TableCell>
                          <TableCell>₹{(item.quantity * item.estimated_unit_cost)?.toLocaleString()}</TableCell>
                          <TableCell>{item.vendor_name}</TableCell>
                          <TableCell>{getApprovalStatusBadge(item.item_status || 'Pending')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p>No items found.</p>
              )}
            </div>
            
            {/* Timestamps Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Created At</p>
                <p>{formatDate(request.created_at)}</p>
              </div>
              <div>
                <p className="text-gray-500">Last Updated</p>
                <p>{formatDate(request.updated_at)}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPurchaseRequestDetails;
