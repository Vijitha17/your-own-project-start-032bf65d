import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
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
import { getLocations, updateLocation, deleteLocation, getColleges, getDepartments } from "@/lib/api";
import { ROLES } from "@/lib/constants";

const LOCATION_TYPES = [
  'Classroom',
  'Staffroom',
  'Hod Room',
  'Lab',
  'Library',
  'Office',
  'Exam Cell'
];

const LocationList = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [editData, setEditData] = useState({ 
    location_name: "",
    location_type: "",
    description: ""
  });
  const { toast } = useToast();

  // Get user role and details from localStorage
  const userRole = localStorage.getItem('userRole');
  const userCollege = localStorage.getItem('userCollege');
  const userDepartment = localStorage.getItem('userDepartment');

  // Check if user is management admin
  const isManagementAdmin = userRole === ROLES.MANAGEMENT_ADMIN;

  // Get role-specific title
  const getRoleSpecificTitle = () => {
    switch (userRole) {
      case ROLES.PRINCIPAL:
        return `Locations - ${userCollege}`;
      case ROLES.HOD:
      case ROLES.DEPARTMENT_INCHARGE:
        return `Locations - ${userDepartment}`;
      default:
        return 'Locations';
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [locationsData, collegesData, departmentsData] = await Promise.all([
        getLocations().catch(() => []),
        getColleges().catch(() => []),
        getDepartments().catch(() => [])
      ]);
      
      setLocations(locationsData || []);
      setColleges(collegesData || []);
      setDepartments(departmentsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message || 'Failed to load data');
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (location) => {
    setCurrentLocation(location);
    setEditData({ 
      location_name: location.location_name,
      location_type: location.location_type,
      description: location.description || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (location) => {
    setCurrentLocation(location);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await updateLocation(currentLocation.location_id, editData);
      toast({
        title: "Success",
        description: "Location updated successfully",
      });
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update location",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteLocation(currentLocation.location_id);
      toast({
        title: "Success",
        description: "Location deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete location",
        variant: "destructive",
      });
    }
  };

  const getCollegeName = (collegeId) => {
    if (!collegeId) return "-";
    const college = colleges.find(c => c.college_id === collegeId);
    return college ? college.college_name : "-";
  };

  const getDepartmentName = (departmentId) => {
    if (!departmentId) return "-";
    const department = departments.find(d => d.department_id === departmentId);
    return department ? department.department_name : "-";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{getRoleSpecificTitle()}</h2>
        {isManagementAdmin && (
          <Button onClick={() => navigate("/stock/locations/add")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Location
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

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
                <TableHead>Location ID</TableHead>
                <TableHead>Location Name</TableHead>
                {isManagementAdmin && <TableHead>College</TableHead>}
                {isManagementAdmin && <TableHead>Department</TableHead>}
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                {isManagementAdmin && <TableHead className="w-[120px]">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isManagementAdmin ? 7 : 4} className="text-center py-4">
                    No locations found
                  </TableCell>
                </TableRow>
              ) : (
                locations.map((location) => (
                  <TableRow key={location.location_id}>
                    <TableCell>{location.location_id}</TableCell>
                    <TableCell>{location.location_name}</TableCell>
                    {isManagementAdmin && <TableCell>{getCollegeName(location.college_id)}</TableCell>}
                    {isManagementAdmin && <TableCell>{getDepartmentName(location.department_id)}</TableCell>}
                    <TableCell>{location.location_type}</TableCell>
                    <TableCell>{location.description || "-"}</TableCell>
                    {isManagementAdmin && (
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(location)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(location)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Dialog - Only shown for Management Admin */}
      {isManagementAdmin && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Location</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Location ID</Label>
                <Input
                  value={currentLocation?.location_id || ""}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label>Location Name</Label>
                <Input
                  value={editData.location_name}
                  onChange={(e) => setEditData({ ...editData, location_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>College</Label>
                <Input
                  value={getCollegeName(currentLocation?.college_id)}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input
                  value={getDepartmentName(currentLocation?.department_id)}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label>Location Type</Label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={editData.location_type}
                  onChange={(e) => setEditData({ ...editData, location_type: e.target.value })}
                  required
                >
                  <option value="">Select Type</option>
                  {LOCATION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdate}
                disabled={!editData.location_name || !editData.location_type}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog - Only shown for Management Admin */}
      {isManagementAdmin && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the location
                "{currentLocation?.location_name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default LocationList;