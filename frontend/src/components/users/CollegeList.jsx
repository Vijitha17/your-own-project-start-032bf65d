import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { getColleges, updateCollege, deleteCollege } from "@/lib/api";
import { useNavigate } from "react-router-dom";

const CollegeList = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCollege, setCurrentCollege] = useState(null);
  const [editData, setEditData] = useState({ college_name: "" });
  const { toast } = useToast();

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const data = await getColleges();
      setColleges(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to load colleges",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const handleEdit = (college) => {
    setCurrentCollege(college);
    setEditData({ college_name: college.college_name });
    setIsDialogOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await updateCollege(currentCollege.college_id, editData);
      toast({
        title: "Success",
        description: "College updated successfully",
      });
      setIsDialogOpen(false);
      fetchColleges();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update college",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCollege(currentCollege.college_id);
      toast({
        title: "Success",
        description: "College deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      fetchColleges();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete college",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Colleges</h2>
        <Button onClick={() => navigate("/users/colleges/add")}>
          <Plus className="mr-2 h-4 w-4" />
          Add College
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>College ID</TableHead>
                <TableHead>College Name</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {colleges.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No colleges found
                  </TableCell>
                </TableRow>
              ) : (
                colleges.map((college) => (
                  <TableRow key={college.college_id}>
                    <TableCell className="font-medium">{college.college_id}</TableCell>
                    <TableCell>{college.college_name}</TableCell>
                    <TableCell>
                      {new Date(college.created_at).toLocaleDateString()}
                    </TableCell>
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
                          onClick={() => {
                            setCurrentCollege(college);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit College</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>College ID</Label>
              <Input
                value={currentCollege?.college_id || ""}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label>College Name</Label>
              <Input
                value={editData.college_name}
                onChange={(e) => setEditData({ college_name: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {currentCollege?.college_name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
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

export default CollegeList;