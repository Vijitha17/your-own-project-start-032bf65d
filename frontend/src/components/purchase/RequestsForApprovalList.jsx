import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getPurchaseRequests, getCurrentUser } from "@/lib/api";

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

const RequestsForApprovalList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requests = await getPurchaseRequests();
        setRequests(requests);
      } catch (error) {
        console.error("Error fetching requests for approval:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) {
    return <p>Loading requests for approval...</p>;
  }

  if (requests.length === 0) {
    return <p>No requests pending approval.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Request ID</TableHead>
          <TableHead>Requested By</TableHead>
          <TableHead>Request Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.purchase_request_id}>
            <TableCell>PR-{request.purchase_request_id}</TableCell>
            <TableCell>{request.requester_name || request.requested_by}</TableCell>
            <TableCell>{new Date(request.request_date).toLocaleDateString()}</TableCell>
            <TableCell>{getApprovalStatusBadge(request.approval_status)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RequestsForApprovalList;
