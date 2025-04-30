import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getColleges,
} from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const departmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  code: z.string().min(1, "Department code is required"),
  college_id: z.string().min(1, "College is required"),
});

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    college_id: "",
  });
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      code: "",
      college_id: "",
    },
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [departmentsData, collegesData] = await Promise.all([
        getDepartments(),
        getColleges(),
      ]);
      console.log('Departments:', departmentsData);
      console.log('Colleges:', collegesData);
      setDepartments(departmentsData);
      setColleges(collegesData);
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (data) => {
    try {
      if (editingDepartment) {
        await updateDepartment(editingDepartment.department_id, data);
        toast({
          title: "Success",
          description: "Department updated successfully",
        });
      } else {
        await createDepartment(data);
        toast({
          title: "Success",
          description: "Department created successfully",
        });
      }
      setIsDialogOpen(false);
      setEditingDepartment(null);
      form.reset();
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save department",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    form.reset({
      name: department.department_name,
      code: department.department_code,
      college_id: department.college_id,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDepartment(id);
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

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (departments.length === 0 && !loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No departments found or failed to load data.</p>
        <Button onClick={() => setIsDialogOpen(true)}>Add Department</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Departments</h2>
        <Button onClick={() => setIsDialogOpen(true)}>Add Department</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Department
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingDepartment ? "Edit Department" : "Add New Department"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="college_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select college" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {colleges.map((college) => (
                          <SelectItem
                            key={college.college_id}
                            value={college.college_id}
                          >
                            {college.college_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingDepartment(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingDepartment ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>College</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((department) => (
              <TableRow key={department.department_id}>
                <TableCell>{department.department_id}</TableCell>
                <TableCell>{department.department_name}</TableCell>
                <TableCell>{department.department_code}</TableCell>
                <TableCell>
                  {colleges.find(c => c.college_id === department.college_id)?.college_name || department.college_id}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(department)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(department.department_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DepartmentList;