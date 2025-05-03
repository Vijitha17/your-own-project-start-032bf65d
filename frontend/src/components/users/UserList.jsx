import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

const UserList = ({ users, loading, onUpdate, onDelete, showActions }) => {
  if (loading) {
    return <div>Loading users...</div>;
  }

  if (users.length === 0) {
    return <div>No users found</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>College</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            {showActions && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.user_id}>
              <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.college_name || "-"}</TableCell>
              <TableCell>{user.department_name || "-"}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  user.is_active 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {user.is_active ? "Active" : "Inactive"}
                </span>
              </TableCell>
              {showActions && (
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onUpdate(user.user_id, user)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(user.user_id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserList;