import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { getColleges, createDepartment } from "@/lib/api";

const AddDepartmentForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    college_id: "",
    department_name: ""
  });
  
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setLoading(true);
        const collegesData = await getColleges();
        setColleges(collegesData);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch colleges",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchColleges();
  }, [toast]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, college_id: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.college_id || !formData.department_name) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      await createDepartment(formData);
      toast({
        title: "Success",
        description: `${formData.department_name} has been added to the system.`
      });
      navigate("/users?tab=departments");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create department",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} />
        
        <main className={`flex-1 p-6 md:p-8 transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={() => navigate("/users?tab=departments")} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Departments
            </Button>
            <h1 className="text-2xl font-bold">Add New Department</h1>
          </div>
          
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Department Information</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">                
                <div className="space-y-2">
                  <label htmlFor="college_id" className="text-sm font-medium">College *</label>
                  <Select 
                    value={formData.college_id} 
                    onValueChange={handleSelectChange}
                    disabled={loading}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a college" />
                    </SelectTrigger>
                    <SelectContent>
                      {colleges.map((college) => (
                        <SelectItem key={college.college_id} value={college.college_id}>
                          {college.college_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="department_name" className="text-sm font-medium">Department Name *</label>
                  <input
                    id="department_name"
                    type="text"
                    name="department_name"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.department_name}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => navigate("/users?tab=departments")}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add Department"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AddDepartmentForm;