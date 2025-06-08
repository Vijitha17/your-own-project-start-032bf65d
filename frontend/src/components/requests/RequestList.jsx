import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getRequests } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const RequestList = ({ onView }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await getRequests();
      setRequests(response.data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch requests. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800"
    };

    return (
      <Badge variant="outline" className={`${statusColors[status.toLowerCase()] || "bg-gray-100 text-gray-800"} border-none`}>
        {status}
      </Badge>
    );
  };

  if (loading) {
    return <div className="text-center py-4">Loading requests...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">id</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Requested By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>HOD Status</TableHead>
            <TableHead>Principal Status</TableHead>
            <TableHead>Admin Status</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length > 0 ? (
            requests.map((request) => (
              <TableRow key={request.request_id}>
                <TableCell className="font-medium">REQ-{request.request_id}</TableCell>
                <TableCell>{request.department_name}</TableCell>
                <TableCell>{request.requester_name}</TableCell>
                <TableCell>{new Date(request.request_date).toLocaleDateString()}</TableCell>
                <TableCell>{getStatusBadge(request.hod_status || 'pending')}</TableCell>
                <TableCell>{getStatusBadge(request.principal_status || 'pending')}</TableCell>
                <TableCell>{getStatusBadge(request.admin_status || 'pending')}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                      >
                        View Items
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Request Items</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Requested Items</p>
                          <div className="border rounded-lg">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Item Name</TableHead>
                                  <TableHead>Quantity</TableHead>
                                  <TableHead>Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {request.items.map((item, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{item.item_name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Request Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Request ID</p>
                            <p className="font-medium">REQ-{request.request_id}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Department</p>
                            <p className="font-medium">{request.department_name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Requested By</p>
                            <p className="font-medium">{request.requester_name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium">{new Date(request.request_date).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-4">Approval Details</h3>
                          <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                              <div className="border rounded-lg p-4">
                                <p className="text-sm text-gray-500">HOD Approval</p>
                                <p className="font-medium">{request.hod_name || 'Not Assigned'}</p>
                                <div className="mt-2">
                                  {getStatusBadge(request.hod_status || 'pending')}
                                </div>
                                {request.hod_comment && (
                                  <p className="text-sm text-gray-600 mt-2">{request.hod_comment}</p>
                                )}
                              </div>
                              <div className="border rounded-lg p-4">
                                <p className="text-sm text-gray-500">Principal Approval</p>
                                <p className="font-medium">{request.principal_name || 'Not Assigned'}</p>
                                <div className="mt-2">
                                  {getStatusBadge(request.principal_status || 'pending')}
                                </div>
                                {request.principal_comment && (
                                  <p className="text-sm text-gray-600 mt-2">{request.principal_comment}</p>
                                )}
                              </div>
                              <div className="border rounded-lg p-4">
                                <p className="text-sm text-gray-500">Admin Approval</p>
                                <p className="font-medium">{request.admin_name || 'Not Assigned'}</p>
                                <div className="mt-2">
                                  {getStatusBadge(request.admin_status || 'pending')}
                                </div>
                                {request.admin_comment && (
                                  <p className="text-sm text-gray-600 mt-2">{request.admin_comment}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-4">Requested Items</h3>
                          <div className="border rounded-lg">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Item Name</TableHead>
                                  <TableHead>Quantity</TableHead>
                                  <TableHead>Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {request.items.map((item, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{item.item_name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">
                No requests found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RequestList;
