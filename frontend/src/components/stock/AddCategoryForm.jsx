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
import { createCategory } from "@/lib/api";

const AddCategoryForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ 
    category_id: "",
    category_name: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await createCategory(formData);
      toast({
        title: "Success",
        description: "Category created successfully",
      });
      navigate("/stock");
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create category",
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
            onClick={() => navigate("/stock")}
            disabled={isSubmitting}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> 
            Back to Stock Management
          </Button>
          <h1 className="text-2xl font-bold ml-2">Add New Category</h1>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Category Information</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category_id">Category ID</Label>
                <Input
                  id="category_id"
                  placeholder="Enter category ID (e.g., CAT-001)"
                  value={formData.category_id}
                  onChange={(e) => setFormData({
                    ...formData, 
                    category_id: e.target.value
                  })}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category_name">Category Name</Label>
                <Input
                  id="category_name"
                  placeholder="Enter category name"
                  value={formData.category_name}
                  onChange={(e) => setFormData({
                    ...formData, 
                    category_name: e.target.value
                  })}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Enter category description"
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
                onClick={() => navigate("/stock")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting || !formData.category_id || !formData.category_name}
              >
                {isSubmitting ? "Creating..." : "Create Category"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddCategoryForm;