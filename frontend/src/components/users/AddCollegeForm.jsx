import React, { useState } from "react";
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
import { createCollege } from "@/lib/api";

const AddCollegeForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ 
    college_id: "",
    college_name: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await createCollege(formData);
      toast({
        title: "Success",
        description: "College created successfully",
      });
      navigate("/users/colleges");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create college",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 p-6 md:p-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/users/colleges")}
            disabled={isSubmitting}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> 
            Back to Colleges
          </Button>
          <h1 className="text-2xl font-bold ml-2">Add New College</h1>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>College Information</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="college_id">College ID</Label>
                <Input
                  id="college_id"
                  placeholder="Enter college ID (e.g., COL-001)"
                  value={formData.college_id}
                  onChange={(e) => setFormData({
                    ...formData, 
                    college_id: e.target.value
                  })}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="college_name">College Name</Label>
                <Input
                  id="college_name"
                  placeholder="Enter college name"
                  value={formData.college_name}
                  onChange={(e) => setFormData({
                    ...formData, 
                    college_name: e.target.value
                  })}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => navigate("/users/colleges")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting || !formData.college_id || !formData.college_name}
              >
                {isSubmitting ? "Creating..." : "Create College"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddCollegeForm;