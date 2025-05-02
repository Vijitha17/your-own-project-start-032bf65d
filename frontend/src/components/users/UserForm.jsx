import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createUser } from "@/lib/api";
import { getColleges, getDepartmentsByCollege } from "@/lib/api";

const formSchema = z.object({
  user_id: z.string().min(1, "User ID is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().min(1, "Role is required"),
  college_id: z.string().min(1, "College ID is required"),
  department_id: z.string().optional(),
});

const UserForm = ({ onSubmit, onCancel }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collegeLoading, setCollegeLoading] = useState(false);
  const [departmentLoading, setDepartmentLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      role: "",
      college_id: "",
      department_id: "",
    },
  });

  const selectedCollegeId = form.watch("college_id");

  // Fetch colleges on mount
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setCollegeLoading(true);
        const data = await getColleges();
        console.log("Fetched colleges:", data); // Debug log
        setColleges(data || []);
      } catch (error) {
        console.error("Error fetching colleges:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to fetch colleges",
          variant: "destructive",
        });
      } finally {
        setCollegeLoading(false);
      }
    };

    fetchColleges();
  }, []);

  // Fetch departments when college changes
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!selectedCollegeId) {
        setDepartments([]);
        form.setValue("department_id", "");
        return;
      }

      try {
        setDepartmentLoading(true);
        console.log("Fetching departments for college:", selectedCollegeId); // Debug log
        const data = await getDepartmentsByCollege(selectedCollegeId);
        console.log("Fetched departments:", data); // Debug log
        if (Array.isArray(data)) {
          setDepartments(data);
          if (data.length === 0) {
            form.setValue("department_id", "");
          }
        } else if (data && Array.isArray(data.data)) {
          setDepartments(data.data);
          if (data.data.length === 0) {
            form.setValue("department_id", "");
          }
        } else {
          setDepartments([]);
          form.setValue("department_id", "");
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        toast({
          title: "Error",
          description: "Failed to load departments. Please try again.",
          variant: "destructive",
        });
        setDepartments([]);
        form.setValue("department_id", "");
      } finally {
        setDepartmentLoading(false);
      }
    };

    fetchDepartments();
  }, [selectedCollegeId]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await createUser(values);
      toast({
        title: "Success",
        description: "User created successfully",
      });
      navigate("/users");
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User ID */}
          <FormField
            control={form.control}
            name="user_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter user ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* First Name */}
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Enter password" type="password" {...field} />
                </FormControl>
                <FormDescription>
                  Password must be at least 6 characters
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Role */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Management">Management</SelectItem>
                    <SelectItem value="Management_Admin">Management Admin</SelectItem>
                    <SelectItem value="Principal">Principal</SelectItem>
                    <SelectItem value="HOD">Head of Department</SelectItem>
                    <SelectItem value="Department_Incharge">Department Incharge</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* College */}
          <FormField
            control={form.control}
            name="college_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>College ID</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={collegeLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={collegeLoading ? "Loading..." : "Select a college ID"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {colleges.map((college) => (
                      <SelectItem key={college.college_id} value={college.college_id}>
                        {college.college_id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Department */}
          <FormField
            control={form.control}
            name="department_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!selectedCollegeId || departmentLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={departmentLoading ? "Loading..." : "Select a department"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.length > 0 ? (
                      departments.map((dept) => (
                        <SelectItem key={dept.department_id} value={dept.department_id}>
                          {dept.department_name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        {selectedCollegeId ? "No departments available" : "Select a college first"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create User"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserForm;