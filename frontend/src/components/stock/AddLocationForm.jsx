import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createLocation, getColleges, getDepartments } from "@/lib/api";

const LOCATION_TYPES = [
  'Classroom',
  'Staffroom',
  'Hod Room',
  'Lab',
  'Library',
  'Office',
  'Exam Cell'
];

// Types that require department selection
const DEPARTMENT_REQUIRED_TYPES = ['Classroom', 'Staffroom', 'Hod Room', 'Lab'];

const AddLocationForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ 
    location_id: "",
    location_name: "",
    college_id: "",
    department_id: "",
    location_type: "",
    description: ""
  });
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Determine if department is required based on location type
  const isDepartmentRequired = DEPARTMENT_REQUIRED_TYPES.includes(formData.location_type);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [collegesData, departmentsData] = await Promise.all([
          getColleges(),
          getDepartments()
        ]);
        setColleges(collegesData);
        setDepartments(departmentsData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load colleges and departments",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  // Reset department_id when location type changes and department is not required
  useEffect(() => {
    if (!isDepartmentRequired) {
      setFormData(prev => ({
        ...prev,
        department_id: ""
      }));
    }
  }, [formData.location_type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create a modified form data object to send
      const dataToSubmit = {
        ...formData,
        // Only include department_id if it's required for this location type
        department_id: isDepartmentRequired ? formData.department_id : null
      };
      
      await createLocation(dataToSubmit);
      toast({
        title: "Success",
        description: "Location created successfully",
      });
      navigate("/stock/locations");
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create location",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  // Check if form is valid for submission
  const isFormValid = () => {
    const baseValidation = (
      !!formData.location_id && 
      !!formData.location_name && 
      !!formData.college_id && 
      !!formData.location_type
    );
    
    // If department is required for this type, check that field too
    if (isDepartmentRequired) {
      return baseValidation && !!formData.department_id;
    }
    
    return baseValidation;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 p-6 md:p-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/stock/locations")}
            disabled={isSubmitting}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> 
            Back to Locations
          </Button>
          <h1 className="text-2xl font-bold ml-2">Add New Location</h1>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Location Information</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location_id">Location ID</Label>
                <Input
                  id="location_id"
                  placeholder="Enter location ID (e.g., LOC-001)"
                  value={formData.location_id}
                  onChange={(e) => setFormData({
                    ...formData, 
                    location_id: e.target.value
                  })}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location_name">Location Name</Label>
                <Input
                  id="location_name"
                  placeholder="Enter location name"
                  value={formData.location_name}
                  onChange={(e) => setFormData({
                    ...formData, 
                    location_name: e.target.value
                  })}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Location Type - Now first in the selection flow */}
              <div className="space-y-2">
                <Label htmlFor="location_type">Location Type</Label>
                <select
                  id="location_type"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.location_type}
                  onChange={(e) => setFormData({
                    ...formData,
                    location_type: e.target.value
                  })}
                  required
                  disabled={isSubmitting}
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
                <Label htmlFor="college_id">College</Label>
                <select
                  id="college_id"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.college_id}
                  onChange={(e) => setFormData({
                    ...formData,
                    college_id: e.target.value,
                    department_id: "" // Reset department when college changes
                  })}
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select College</option>
                  {colleges.map((college) => (
                    <option key={college.college_id} value={college.college_id}>
                      {college.college_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Only show department if location type requires it */}
              {isDepartmentRequired && (
                <div className="space-y-2">
                  <Label htmlFor="department_id">Department</Label>
                  <select
                    id="department_id"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.department_id}
                    onChange={(e) => setFormData({
                      ...formData,
                      department_id: e.target.value
                    })}
                    required={isDepartmentRequired}
                    disabled={isSubmitting || !formData.college_id}
                  >
                    <option value="">Select Department</option>
                    {departments
                      .filter(dept => dept.college_id === formData.college_id)
                      .map((department) => (
                        <option key={department.department_id} value={department.department_id}>
                          {department.department_name}
                        </option>
                      ))}
                  </select>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Enter location description"
                  value={formData.description}
                  onChange={(e) => setFormData({
                    ...formData, 
                    description: e.target.value
                  })}
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => navigate("/stock/locations")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting || !isFormValid()}
              >
                {isSubmitting ? "Creating..." : "Create Location"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddLocationForm;