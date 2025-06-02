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

const CreateRequestForm = ({ onCancel }) => {
  const [approvers, setApprovers] = useState({
    HOD: [],
    Principal: [],
    Management_Admin: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    approver1_id: "", // HOD
    approver2_id: "", // Principal
    approver3_id: "", // Management Admin
    items: [
      {
        item_name: "",
        quantity: 1
      }
    ]
  });

  useEffect(() => {
    // Fetch approvers from API
    const fetchApprovers = async () => {
      try {
        console.log('Fetching approvers...');
        
        // Get the auth token
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Set up headers with auth token
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Adjust role names to match backend expected case
        const [hodResponse, principalResponse, adminResponse] = await Promise.all([
          api.get('/users/role/hod', { headers }),
          api.get('/users/role/principal', { headers }),
          api.get('/users/role/management_admin', { headers })
        ]);

        console.log('HOD Response:', hodResponse.data);
        console.log('Principal Response:', principalResponse.data);
        console.log('Management Admin Response:', adminResponse.data);

        setApprovers({
          HOD: hodResponse.data || [],
          Principal: principalResponse.data || [],
          Management_Admin: adminResponse.data || []
        });
      } catch (error) {
        console.error('Error fetching approvers:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        
        // Show more specific error message
        let errorMessage = "Failed to fetch approvers. ";
        if (error.response?.status === 401) {
          errorMessage += "Please log in again.";
        } else if (error.response?.status === 404) {
          errorMessage += "API endpoint not found. Please check the server configuration.";
        } else {
          errorMessage += error.response?.data?.message || "Please try again.";
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchApprovers();
  }, []);

  const handleApproverChange = (level, value) => {
    setFormData(prev => ({ ...prev, [`approver${level}_id`]: value }));
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { item_name: "", quantity: 1 }]
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
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  const validateForm = () => {
    if (!formData.approver1_id || !formData.approver2_id || !formData.approver3_id) {
      toast({
        title: "Error",
        description: "Please select all three approvers",
        variant: "destructive"
      });
      return false;
    }

    if (formData.items.some(item => !item.item_name || item.quantity <= 0)) {
      toast({
        title: "Error",
        description: "Please fill in all required fields for each item",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/requests', formData);
      
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Request created successfully. Waiting for approval.",
        });
        onCancel();
      } else {
        throw new Error(response.data.message || "Failed to create request");
      }
    } catch (error) {
      console.error('Error creating request:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to create request",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <Label htmlFor="approver3">Management Admin (Third Approver)</Label>
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
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Item Details</h3>
            <Button type="button" onClick={handleAddItem} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor={`item-name-${index}`}>Item Name</Label>
                <Input
                  id={`item-name-${index}`}
                  value={item.item_name}
                  onChange={(e) => handleItemChange(index, 'item_name', e.target.value)}
                  placeholder="Enter item name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`item-quantity-${index}`}>Quantity</Label>
                <Input
                  id={`item-quantity-${index}`}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                  required
                />
              </div>
              {formData.items.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(index)}
                  className="md:col-span-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </Button>
      </div>
    </form>
  );
};

export default CreateRequestForm; 