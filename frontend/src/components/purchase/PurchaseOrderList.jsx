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
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  FileText,
  Truck,
  AlertCircle,
  X
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
import api from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";

// Helper functions for status badges
const getStatusBadge = (status) => {
  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Placed: "bg-blue-100 text-blue-800",
    Received: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800"
  };

  return (
    <Badge variant="outline" className={`${statusColors[status] || 'bg-gray-100 text-gray-800'} border-none`}>
      {status}
    </Badge>
  );
};

const getPaymentStatusBadge = (status) => {
  const statusColors = {
    Unpaid: "bg-yellow-100 text-yellow-800",
    Paid: "bg-green-100 text-green-800",
    Partial: "bg-orange-100 text-orange-800"
  };

  return (
    <Badge variant="outline" className={`${statusColors[status] || 'bg-gray-100 text-gray-800'} border-none`}>
      {status}
    </Badge>
  );
};

const PurchaseOrderList = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [showItems, setShowItems] = useState(false);

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const fetchPurchaseOrders = async () => {
    try {
      const response = await api.get('/purchase-orders');
      if (response.data.success) {
        setPurchaseOrders(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch purchase orders");
      }
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to fetch purchase orders",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOrder = (order) => {
    setOrderToDelete(order);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteOrder = async () => {
    try {
      const response = await api.delete(`/purchase-orders/${orderToDelete.purchase_order_id}`);
      if (response.data.success) {
        setPurchaseOrders(prev => prev.filter(o => o.purchase_order_id !== orderToDelete.purchase_order_id));
        toast({
          title: "Success",
          description: "Purchase order deleted successfully.",
        });
      } else {
        throw new Error(response.data.message || "Failed to delete purchase order");
      }
    } catch (error) {
      console.error('Error deleting purchase order:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to delete purchase order",
        variant: "destructive"
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleViewDetails = async (order) => {
    try {
      const response = await api.get(`/purchase-orders/${order.purchase_order_id}`);
      if (response.data.success) {
        setSelectedOrder(response.data.data);
        setIsViewDialogOpen(true);
        setShowItems(false);
      } else {
        throw new Error(response.data.message || "Failed to fetch order details");
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to fetch order details",
        variant: "destructive"
      });
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      console.log('Updating order status:', { orderId, newStatus });
      const response = await api.put(`/purchase-orders/${orderId}`, {
        order_status: newStatus
      });
      
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Order status updated successfully.",
        });
        // Refresh the orders list
        fetchPurchaseOrders();
      } else {
        throw new Error(response.data.message || "Failed to update order status");
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Purchase Orders</h2>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseOrders.map((order) => (
              <TableRow key={order.purchase_order_id}>
                <TableCell className="font-medium">{order.purchase_order_id}</TableCell>
                <TableCell>{order.vendor_name}</TableCell>
                <TableCell>₹{order.total_amount?.toLocaleString()}</TableCell>
                <TableCell>{getPaymentStatusBadge(order.payment_status)}</TableCell>
                <TableCell>{getStatusBadge(order.order_status)}</TableCell>
                <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(order)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Items ({order.total_items || 0})
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
                      <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {order.order_status === "Pending" && (
                        <>
                          <DropdownMenuItem onClick={() => handleStatusChange(order.purchase_order_id, "Placed")}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Placed
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      {order.order_status === "Placed" && (
                        <>
                          <DropdownMenuItem onClick={() => handleStatusChange(order.purchase_order_id, "Received")}>
                            <Truck className="mr-2 h-4 w-4" />
                            Mark as Received
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteOrder(order)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Purchase Order Details</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedOrder.purchase_order_id} • Created: {new Date(selectedOrder.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    setSelectedOrder(null);
                    setShowItems(false);
                  }} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-700">Order Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Order ID</p>
                        <p className="mt-1">{selectedOrder.purchase_order_id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <div className="mt-1">{getStatusBadge(selectedOrder.order_status)}</div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Purchase Request</p>
                        <p className="mt-1">{selectedOrder.purchase_request_id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Order Date</p>
                        <p className="mt-1">{new Date(selectedOrder.order_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-700">Vendor Information</h3>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Vendor Name</p>
                      <p className="mt-1">{selectedOrder.vendor_name}</p>
                    </div>
                  </div>
                </div>
                
                {/* Financial Information */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700">Financial Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Amount</p>
                      <p className="mt-1">₹{selectedOrder.total_amount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Payment Status</p>
                      <div className="mt-1">{getPaymentStatusBadge(selectedOrder.payment_status)}</div>
                    </div>
                  </div>
                </div>

                {/* Items Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-700">Order Items</h3>
                    <Button
                      variant="outline"
                      onClick={() => setShowItems(!showItems)}
                    >
                      {showItems ? 'Hide Items' : 'View Items'}
                    </Button>
                  </div>
                  
                  {showItems && selectedOrder.items && (
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item Name</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Unit Price</TableHead>
                            <TableHead>Total Price</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedOrder.items.map((item, index) => (
                            <TableRow key={item.purchaseorder_item_id || index}>
                              <TableCell>{item.item_name}</TableCell>
                              <TableCell>{item.item_details || '-'}</TableCell>
                              <TableCell>{item.category_name}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>₹{item.unit_price?.toLocaleString()}</TableCell>
                              <TableCell>₹{item.total_price?.toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-700">Notes</h3>
                    <p className="text-sm text-gray-600">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button onClick={() => {
                  setIsViewDialogOpen(false);
                  setSelectedOrder(null);
                  setShowItems(false);
                }}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete purchase order {orderToDelete?.purchase_order_id} 
              and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteOrder}
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

export default PurchaseOrderList;