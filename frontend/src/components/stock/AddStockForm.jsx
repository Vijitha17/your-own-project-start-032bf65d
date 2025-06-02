import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";

const AddStockForm = ({ onSuccess }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    purchase_order_id: "",
    item_name: "",
    brand: "",
    details: "",
    category_id: "",
    base_quantity: 1,
    sub_quantity: 0,
    status: "In Stock",
    allocated_to_type: null,
    allocated_to_id: "",
    location_id: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch purchase orders that are marked as received
        const ordersResponse = await api.get('/purchase-orders');
        if (ordersResponse.data.success) {
          // Filter only received orders
          const receivedOrders = ordersResponse.data.data.filter(
            order => order.order_status === "Received"
          );
          setPurchaseOrders(receivedOrders);
        }

        // Fetch categories
        const categoriesResponse = await api.get('/categories');
        console.log('Categories API Response:', categoriesResponse.data);
        if (categoriesResponse.data.status === 'success') {
          setCategories(categoriesResponse.data.data || []);
        } else {
          console.error('Categories API Error:', categoriesResponse.data);
          toast({
            title: "Error",
            description: "Failed to fetch categories. Please try again.",
            variant: "destructive"
          });
        }

        // Fetch vendors
        const vendorsResponse = await api.get('/vendors');
        if (vendorsResponse.data.success) {
          setVendors(vendorsResponse.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch required data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    if (name === "purchase_order_id") {
      // When purchase order is selected, find the corresponding item
      const selectedOrder = purchaseOrders.find(order => order.purchase_order_id === value);
      if (selectedOrder) {
        setSelectedOrder(selectedOrder);
        setFormData(prev => ({
          ...prev,
          purchase_order_id: value,
          item_name: selectedOrder.item_name || "",
          category_id: selectedOrder.category_id || "",
          brand: selectedOrder.brand || "",
          details: selectedOrder.details || ""
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.purchase_order_id || !formData.item_name || !formData.category_id) {
        throw new Error("Please fill in all required fields");
      }

      // Create an array of stock items based on base quantity
      const stockItems = Array.from({ length: parseInt(formData.base_quantity) }, (_, index) => ({
        ...formData,
        stock_item_id: `STK-${Date.now()}-${index + 1}`, // Generate unique ID for each item
        base_quantity: 1, // Each item has base quantity of 1
        sub_quantity: 0
      }));

      // Send all items to the backend
      const response = await api.post('/stock-items/bulk', { items: stockItems });
      
      if (response.data.success) {
        toast({
          title: "Success",
          description: `${formData.base_quantity} stock items added successfully`,
        });
        onSuccess();
      } else {
        throw new Error(response.data.message || "Failed to add stock items");
      }
    } catch (error) {
      console.error('Error adding stock items:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add stock items",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Purchase Order Selection */}
          <div className="space-y-2">
            <Label htmlFor="purchase_order_id">Purchase Order *</Label>
            <Select
              onValueChange={(value) => handleSelectChange("purchase_order_id", value)}
              value={formData.purchase_order_id}
              required
            >
              <SelectTrigger id="purchase_order_id">
                <SelectValue placeholder="Select purchase order" />
              </SelectTrigger>
              <SelectContent>
                {purchaseOrders.length > 0 ? (
                  purchaseOrders.map(order => (
                    <SelectItem key={order.purchase_order_id} value={order.purchase_order_id}>
                      {order.purchase_order_id} - {order.vendor_name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-orders" disabled>No received orders available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Item Name */}
          <div className="space-y-2">
            <Label htmlFor="item_name">Item Name *</Label>
            <Input
              id="item_name"
              name="item_name"
              value={formData.item_name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Brand */}
          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category_id">Category *</Label>
            <Select
              onValueChange={(value) => handleSelectChange("category_id", value)}
              value={formData.category_id}
              required
            >
              <SelectTrigger id="category_id">
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
                  <SelectItem value="no-categories" disabled>No categories available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Base Quantity */}
          <div className="space-y-2">
            <Label htmlFor="base_quantity">Number of Items *</Label>
            <Input
              id="base_quantity"
              name="base_quantity"
              type="number"
              min="1"
              value={formData.base_quantity}
              onChange={handleChange}
              required
            />
            <p className="text-sm text-gray-500">
              This will create {formData.base_quantity} separate stock items
            </p>
          </div>

          {/* Sub Quantity */}
          <div className="space-y-2">
            <Label htmlFor="sub_quantity">Sub Quantity</Label>
            <Input
              id="sub_quantity"
              name="sub_quantity"
              type="number"
              min="0"
              value={formData.sub_quantity}
              onChange={handleChange}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              onValueChange={(value) => handleSelectChange("status", value)}
              value={formData.status}
              required
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="In Stock">In Stock</SelectItem>
                <SelectItem value="Allocated">Allocated</SelectItem>
                <SelectItem value="In Service">In Service</SelectItem>
                <SelectItem value="Trash">Trash</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Details */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="details">Details</Label>
            <Textarea
              id="details"
              name="details"
              value={formData.details}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Stock Items"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddStockForm;