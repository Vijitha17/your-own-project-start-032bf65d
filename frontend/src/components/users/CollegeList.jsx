import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
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
  getColleges,
  createCollege,
  updateCollege,
  deleteCollege,
} from "@/lib/api";

const collegeSchema = z.object({
  college_name: z.string().min(1, "College name is required"),
});

const CollegeList = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState(null);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(collegeSchema),
    defaultValues: {
      college_name: "",
    },
  });

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const data = await getColleges();
      console.log('Colleges data:', data); // Debug colleges array
      setColleges(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch colleges",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const handleSubmit = async (data) => {
    try {
      if (editingCollege) {
        await updateCollege(editingCollege.college_id, data);
        toast({
          title: "Success",
          description: "College updated successfully",
        });
      } else {
        await createCollege(data);
        toast({
          title: "Success",
          description: "College created successfully",
        });
      }
      setIsDialogOpen(false);
      setEditingCollege(null);
      form.reset();
      fetchColleges();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save college",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (college) => {
    setEditingCollege(college);
    form.reset({ college_name: college.college_name });
    setIsDialogOpen(true);
  };

  const handleDelete = async (collegeId) => {
    try {
      await deleteCollege(collegeId);
      toast({
        title: "Success",
        description: "College deleted successfully",
      });
      fetchColleges();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete college",
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

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add College
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCollege ? "Edit College" : "Add New College"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="college_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>College Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
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
                      setEditingCollege(null);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingCollege ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {colleges.map((college, index) => (
              <TableRow key={college.college_id || `college-${index}`}>
                <TableCell>{college.college_id}</TableCell>
                <TableCell>{college.college_name}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(college)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(college.college_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {colleges.length === 0 && (
              <TableRow key="no-colleges">
                <TableCell colSpan={3} className="text-center py-4">
                  No colleges found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CollegeList;