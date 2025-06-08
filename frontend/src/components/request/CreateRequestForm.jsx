import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import api from "@/lib/api";
import axios from "axios";

const CreateRequestForm = ({ onCancel }) => {
  const [approvers, setApprovers] = useState({
    HOD: [],
    Principal: [],
    Management_Admin: []
  });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [formData, setFormData] = useState({
    approver1_id: "", // HOD
    approver2_id: "", // Principal
    approver3_id: "", // Management Admin
    items: [
      {
        item_name: "",
        quantity: 1,
        category_id: ""
      }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch both approvers and categories
        const [hodResponse, principalResponse, adminResponse, categoriesResponse] = await Promise.all([
          api.get('/users/role/hod'),
          api.get('/users/role/principal'),
          api.get('/users/role/management_admin'),
          api.get('/categories')
        ]);

        setApprovers({
          HOD: hodResponse.data || [],
          Principal: principalResponse.data || [],
          Management_Admin: adminResponse.data || []
        });

        // Handle categories data based on the API response format
        if (categoriesResponse.data?.status === 'success' && Array.isArray(categoriesResponse.data.data)) {
          setCategories(categoriesResponse.data.data);
        } else if (Array.isArray(categoriesResponse.data)) {
          setCategories(categoriesResponse.data);
        } else {
          console.error('Categories data is not in expected format:', categoriesResponse.data);
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load form data. Please try again.');
        toast({
          title: "Error",
          description: "Failed to load form data. Please try again.",
          variant: "destructive"
        });
        // Set empty arrays to prevent mapping errors
        setCategories([]);
        setApprovers({
          HOD: [],
          Principal: [],
          Management_Admin: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApproverChange = (level, value) => {
    setFormData(prev => ({ ...prev, [`approver${level}_id`]: value }));
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { item_name: "", quantity: 1, category_id: "" }]
    }));
  };

  const handleRemoveItem = (index) => {
    if (formData.items.length === 1) return;
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { 
        ...newItems[index], 
        [field]: field === 'quantity' ? parseInt(value) || 1 : value 
      };
      return { ...prev, items: newItems };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Validate form data
      if (!formData.approver1_id || !formData.approver2_id || !formData.approver3_id) {
        setError('Please select all required approvers');
        return;
      }

      if (!formData.items.length) {
        setError('Please add at least one item');
        return;
      }

      // Validate each item
      for (const item of formData.items) {
        if (!item.item_name || !item.category_id || !item.quantity) {
          setError('Please fill in all required fields for each item');
          return;
        }
        if (item.quantity <= 0) {
          setError('Quantity must be greater than 0');
          return;
        }
      }

      // Get the current user's ID from localStorage or your auth context
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (!currentUser || !currentUser.user_id) {
        setError('User information not found. Please log in again.');
        return;
      }

      const requestData = {
        approver1_id: formData.approver1_id,
        approver2_id: formData.approver2_id,
        approver3_id: formData.approver3_id,
        requested_by: currentUser.user_id,
        items: formData.items.map(item => ({
          item_name: item.item_name.trim(),
          category_id: item.category_id,
          quantity: parseInt(item.quantity),
          specifications: item.specifications || ''
        }))
      };

      console.log('Submitting request data:', requestData);

      const response = await api.post('/requests', requestData);

      if (response.data.success) {
        // Show success message
        toast({
          title: "Success",
          description: "Request submitted successfully!",
          variant: "success",
        });

        // Reset form
        setFormData({
          approver1_id: '',
          approver2_id: '',
          approver3_id: '',
          items: [{
            item_name: '',
            category_id: '',
            quantity: 1,
            specifications: ''
          }]
        });

        // Close the form if onCancel is provided
        if (onCancel) {
          onCancel();
        }
      }
    } catch (error) {
      console.error('Error creating request:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || 'Error creating request. Please try again.',
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4 space-y-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="approver1">HOD (First Approver)</Label>
            <Select
              value={formData.approver1_id}
              onValueChange={(value) => handleApproverChange(1, value)}
              required
            >
              <SelectTrigger id="approver1">
                <SelectValue placeholder="Select HOD" />
              </SelectTrigger>
              <SelectContent>
                {approvers.HOD?.length > 0 ? (
                  approvers.HOD.map(approver => (
                    <SelectItem key={approver.user_id} value={approver.user_id}>
                      {approver.first_name} {approver.last_name} - {approver.department_name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-approvers" disabled>
                    No HODs available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="approver2">Principal (Second Approver)</Label>
            <Select
              value={formData.approver2_id}
              onValueChange={(value) => handleApproverChange(2, value)}
              required
            >
              <SelectTrigger id="approver2">
                <SelectValue placeholder="Select Principal" />
              </SelectTrigger>
              <SelectContent>
                {approvers.Principal?.length > 0 ? (
                  approvers.Principal.map(approver => (
                    <SelectItem key={approver.user_id} value={approver.user_id}>
                      {approver.first_name} {approver.last_name} - {approver.college_name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-approvers" disabled>
                    No Principals available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="approver3">Management Admin (Final Approver)</Label>
            <Select
              value={formData.approver3_id}
              onValueChange={(value) => handleApproverChange(3, value)}
              required
            >
              <SelectTrigger id="approver3">
                <SelectValue placeholder="Select Management Admin" />
              </SelectTrigger>
              <SelectContent>
                {approvers.Management_Admin?.length > 0 ? (
                  approvers.Management_Admin.map(approver => (
                    <SelectItem key={approver.user_id} value={approver.user_id}>
                      {approver.first_name} {approver.last_name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-approvers" disabled>
                    No Management Admins available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Items</h3>
            <Button type="button" onClick={handleAddItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          {formData.items.map((item, index) => (
            <div key={index} className="grid gap-4 md:grid-cols-3 border p-4 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor={`item_name_${index}`}>Item Name</Label>
                <Input
                  id={`item_name_${index}`}
                  value={item.item_name}
                  onChange={(e) => handleItemChange(index, 'item_name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`category_${index}`}>Category</Label>
                <Select
                  value={item.category_id}
                  onValueChange={(value) => handleItemChange(index, 'category_id', value)}
                  required
                >
                  <SelectTrigger id={`category_${index}`}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(categories) && categories.length > 0 ? (
                      categories.map(category => (
                        <SelectItem key={category.category_id} value={category.category_id}>
                          {category.category_name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-categories" disabled>
                        No categories available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`quantity_${index}`}>Quantity</Label>
                <Input
                  id={`quantity_${index}`}
                  type="number"
                  min="1"
                  value={item.quantity || 0}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  required
                />
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveItem(index)}
                disabled={formData.items.length === 1}
                className="md:col-span-3"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateRequestForm; 