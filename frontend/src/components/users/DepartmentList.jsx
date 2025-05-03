import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  getDepartments,
  deleteDepartment,
} from "@/lib/api";

const DepartmentList = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const userRole = localStorage.getItem("userRole") || "";
  const isPrincipal = userRole === "Principal";
  const isAdmin = userRole === "Management_Admin";

  const fetchData = async () => {
    try {
      setLoading(true);
      const departmentsData = await getDepartments();
      
      // Ensure we have an array even if API returns undefined
      const processedDepartments = Array.isArray(departmentsData) 
        ? departmentsData 
        : [];
      
      setDepartments(processedDepartments);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch departments",
        variant: "destructive",
      });
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (departmentId) => {
    try {
      await deleteDepartment(departmentId);
      toast({
        title: "Success",
        description: "Department deleted successfully",
      });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete department",
        variant: "destructive",
      });
    }
  };

  const filteredDepartments = departments.filter(dept => 
    dept.department_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.college_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-[150px]" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-[250px]" />
            {!isPrincipal && <Skeleton className="h-10 w-[150px]" />}
          </div>
        </div>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Departments</h2>
        <div className="flex space-x-2">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search departments..."
              className="pl-4 pr-4 py-2 w-full rounded-md border border-input bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {!isPrincipal && (
            <Button onClick={() => navigate("/users/departments/add")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department Name</TableHead>
              <TableHead>College</TableHead>
              <TableHead>Created At</TableHead>
              {!isPrincipal && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDepartments.length > 0 ? (
              filteredDepartments.map((department) => (
                <TableRow key={department.department_id}>
                  <TableCell>{department.department_name}</TableCell>
                  <TableCell>{department.college_name}</TableCell>
                  <TableCell>
                    {new Date(department.created_at).toLocaleDateString()}
                  </TableCell>
                  {!isPrincipal && (
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/users/departments/edit/${department.department_id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(department.department_id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={isPrincipal ? 3 : 4} className="text-center py-4">
                  {departments.length === 0 ? (
                    <div>
                      <p>No departments found in the database</p>
                      <p className="text-sm text-gray-500">
                        Check your API endpoint is returning data
                      </p>
                    </div>
                  ) : (
                    "No departments match your search"
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DepartmentList;