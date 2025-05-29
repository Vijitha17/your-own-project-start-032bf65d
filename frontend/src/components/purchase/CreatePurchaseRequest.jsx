import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ROLES } from "@/lib/constants";
import api from "@/lib/api";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(amount);
};

const generatePurchaseRequestId = () => {
  // This will be replaced by the backend's auto-increment
  // For now, we'll use a simple number that will be updated by the backend
  return "1"; // The backend will handle the actual ID assignment
};

const CreatePurchaseRequest = ({ onCancel }) => {
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    request_date: new Date().toISOString().slice(0, 16),
    notes: "",
    requested_by: "",
    approver_id: "",
    approval_status: "Pending",
    items: [
      {
        item_name: "",
        category_id: "",
        quantity: 1,
        estimated_unit_cost: 0,
        specifications: "",
        vendor_id: ""
      }
    ]
  });

  // Calculate total estimated cost
  const totalEstimatedCost = formData.items.reduce((total, item) => {
    return total + (item.quantity * item.estimated_unit_cost);
  }, 0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get current user
        const userRes = await api.get('/auth/me');
        console.log('Current User Response:', userRes.data);
        setCurrentUser(userRes.data.user);
        setFormData(prev => ({ ...prev, requested_by: userRes.data.user.user_id }));

        // Get categories
        const categoriesRes = await api.get('/categories');
        console.log('Categories Response:', categoriesRes.data);
        const categoriesData = categoriesRes.data?.data || categoriesRes.data || [];
        setCategories(categoriesData.sort((a, b) => a.category_name.localeCompare(b.category_name)));

        // Get vendors
        const vendorsRes = await api.get('/vendors');
        console.log('Vendors Response:', vendorsRes.data);
        const vendorsData = vendorsRes.data?.data || vendorsRes.data || [];
        setVendors(vendorsData.sort((a, b) => a.vendor_name.localeCompare(b.vendor_name)));

        // Get all users
        const usersRes = await api.get('/auth/users');
        console.log('Users Response:', usersRes.data);
        
        // Handle different response formats
        let usersData = [];
        if (Array.isArray(usersRes.data)) {
          usersData = usersRes.data;
        } else if (usersRes.data?.data) {
          usersData = usersRes.data.data;
        } else if (usersRes.data?.users) {
          usersData = usersRes.data.users;
        }
        
        console.log('Processed Users Data:', usersData);
        
        const allUsers = usersData
          .filter(user => user.role === ROLES.MANAGEMENT)
          .map(user => ({
            ...user,
            displayName: `${user.user_id} - ${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email
          }));

        console.log('All Users:', allUsers);
        setUsers(allUsers);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load required data. Please try again.",
          variant: "destructive"
        });
        setCategories([]);
        setVendors([]);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = {
        ...newItems[index],
        [field]: field === 'quantity' || field === 'estimated_unit_cost' 
          ? (value === '' ? 0 : Number(value))
          : value
      };
      return { ...prev, items: newItems };
    });
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          item_name: "",
          category_id: "",
          quantity: 1,
          estimated_unit_cost: 0,
          specifications: "",
          vendor_id: ""
        }
      ]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!formData.approver_id) {
      toast({
        title: "Error",
        description: "Please select an approver",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.requested_by) {
      toast({
        title: "Error",
        description: "Requested by field is required",
        variant: "destructive"
      });
      return false;
    }

    if (formData.items.some(item => !item.item_name || !item.category_id || !item.vendor_id)) {
      toast({
        title: "Error",
        description: "Please fill in all required fields for each item",
        variant: "destructive"
      });
      return false;
    }

    if (formData.items.some(item => item.quantity <= 0 || item.estimated_unit_cost <= 0)) {
      toast({
        title: "Error",
        description: "Quantity and estimated unit cost must be greater than 0",
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
      // Prepare the data according to the backend schema
      const requestData = {
        request_date: formData.request_date,
        notes: formData.notes || null,
        requested_by: formData.requested_by,
        approver_id: formData.approver_id,
        approval_status: "Pending",
        total_estimated_cost: totalEstimatedCost,
        items: formData.items.map(item => ({
          item_name: item.item_name.trim(),
          category_id: item.category_id,
          quantity: Number(item.quantity) || 0,
          estimated_unit_cost: Number(item.estimated_unit_cost) || 0,
          specifications: item.specifications?.trim() || null,
          vendor_id: item.vendor_id,
          item_status: "Pending"
        }))
      };

      console.log('Submitting purchase request:', requestData);
      const response = await api.post('/purchase-requests', requestData);
      
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Purchase request created successfully. Waiting for approval.",
        });
        onCancel();
      } else {
        throw new Error(response.data.message || "Failed to create purchase request");
      }
    } catch (error) {
      console.error('Error creating purchase request:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to create purchase request",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="request_date">Request Date</Label>
            <Input
              id="request_date"
              name="request_date"
              type="datetime-local"
              value={formData.request_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="approver_id">Approver</Label>
            <Select
              value={formData.approver_id}
              onValueChange={(value) => handleChange({ target: { name: 'approver_id', value } })}
              required
            >
              <SelectTrigger id="approver_id">
                <SelectValue placeholder="Select approver" />
              </SelectTrigger>
              <SelectContent>
                {users.length > 0 ? (
                  users.map(user => (
                    <SelectItem key={user.user_id} value={user.user_id}>
                      {user.displayName}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-users" disabled>
                    No management users available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes here..."
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Items</h3>
            <Button type="button" onClick={addItem} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          {formData.items.map((item, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Item {index + 1}</h4>
                {formData.items.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
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
                      {categories.length > 0 ? (
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

                <div className="space-y-2">
                  <Label htmlFor={`estimated_unit_cost_${index}`}>Estimated Unit Cost (₹)</Label>
                  <Input
                    id={`estimated_unit_cost_${index}`}
                    type="number"
                    min="0"
                    step="1"
                    value={item.estimated_unit_cost || 0}
                    onChange={(e) => handleItemChange(index, 'estimated_unit_cost', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`vendor_${index}`}>Vendor</Label>
                  <Select
                    value={item.vendor_id}
                    onValueChange={(value) => handleItemChange(index, 'vendor_id', value)}
                    required
                  >
                    <SelectTrigger id={`vendor_${index}`}>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.length > 0 ? (
                        vendors.map(vendor => (
                          <SelectItem key={vendor.vendor_id} value={vendor.vendor_id}>
                            {vendor.vendor_name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-vendors" disabled>
                          No vendors available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`specifications_${index}`}>Specifications</Label>
                  <Textarea
                    id={`specifications_${index}`}
                    value={item.specifications}
                    onChange={(e) => handleItemChange(index, 'specifications', e.target.value)}
                    placeholder="Enter item specifications..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <div className="text-lg font-medium">
              Total Estimated Cost: {formatCurrency(totalEstimatedCost)}
            </div>
            <div className="space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePurchaseRequest;
