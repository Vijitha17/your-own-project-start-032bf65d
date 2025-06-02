import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import LoadingSpinner from "@/components/LoadingSpinner";

const PurchaseOrderForm = ({ isEditing = false, onCancel }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    purchase_request_id: "",
    vendor_id: "",
    order_date: new Date().toISOString().split('T')[0],
    total_amount: 0,
    paid_amount: 0,
    payment_status: "Unpaid",
    order_status: "Placed",
    payment_id: "",
    payment_date: "",
    notes: "",
    items: []
  });

  const [newItem, setNewItem] = useState({
    item_name: "",
    item_details: "",
    category_id: "",
    quantity: 1,
    unit_price: 0,
    total_price: 0,
    item_status: "Ordered"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch approved purchase requests
        const requestsResponse = await api.get('/purchase-requests');
        if (requestsResponse.data.success) {
          const approvedRequests = requestsResponse.data.data.filter(
            request => request.approval_status === 'Approved'
          );
          setPurchaseRequests(approvedRequests);
        }

        // Fetch available vendors
        const vendorsResponse = await api.get('/vendors');
        if (vendorsResponse.data.success) {
          setVendors(vendorsResponse.data.data);
        }

        // Fetch categories
        try {
          const categoriesResponse = await api.get('/categories');
          console.log('Categories API Response:', categoriesResponse.data);
          
          if (categoriesResponse.data.status === 'success') {
            const categoriesData = categoriesResponse.data.data;
            console.log('Categories Data:', categoriesData);
            setCategories(categoriesData);
          } else {
            console.error('Categories API Error:', categoriesResponse.data);
            toast({
              title: "Error",
              description: "Failed to fetch categories. Please try again.",
              variant: "destructive"
            });
          }
        } catch (categoryError) {
          console.error('Categories Fetch Error:', categoryError);
          toast({
            title: "Error",
            description: "Failed to fetch categories. Please try again.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to fetch required data. Please try again.",
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'purchase_request_id' && value) {
        const selectedRequest = purchaseRequests.find(req => req.purchase_request_id === value);
        if (selectedRequest) {
          // Update all form fields with the selected request data
          newData.vendor_id = selectedRequest.vendor_id;
          newData.ordered_by = selectedRequest.requested_by;
          newData.approved_by = selectedRequest.approved_by;
          
          // Update items array with the selected request items
          if (selectedRequest.items && Array.isArray(selectedRequest.items)) {
            newData.items = selectedRequest.items.map(item => ({
              purchaseorder_item_id: `POI-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              item_name: item.item_name,
              category_id: item.category_id,
              quantity: item.quantity,
              unit_price: item.estimated_unit_cost,
              total_price: item.quantity * item.estimated_unit_cost,
              specifications: item.specifications || '',
              notes: item.notes || '',
              item_status: item.item_status || "Ordered"
            }));

            // Calculate total amount from items
            newData.total_amount = newData.items.reduce((sum, item) => {
              return sum + (Number(item.quantity) * Number(item.unit_price));
            }, 0);
          }
        }
      }
      return newData;
    });
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => {
      const updatedItem = { ...prev, [name]: value };
      if (name === 'quantity' || name === 'unit_price') {
        // Convert to whole numbers and calculate total
        const quantity = Math.floor(Number(updatedItem.quantity));
        const unitPrice = Math.floor(Number(updatedItem.unit_price));
        updatedItem.total_price = quantity * unitPrice;
      }
      return updatedItem;
    });
  };

  const addItem = () => {
    if (!newItem.item_name || !newItem.category_id || !newItem.quantity || !newItem.unit_price) {
      toast({
        title: "Error",
        description: "Please fill in all required item fields",
        variant: "destructive"
      });
      return;
    }

    // Add item number to the item
    const itemNumber = formData.items.length + 1;
    const itemWithNumber = {
      ...newItem,
      item_number: itemNumber
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, itemWithNumber]
    }));

    setNewItem({
      item_name: "",
      item_details: "",
      category_id: "",
      quantity: 1,
      unit_price: 0,
      total_price: 0,
      item_status: "Ordered"
    });
  };

  const removeItem = (index) => {
    setFormData(prev => {
      const updatedItems = prev.items.filter((_, i) => i !== index);
      // Reassign item numbers after removal
      return {
        ...prev,
        items: updatedItems.map((item, idx) => ({
          ...item,
          item_number: idx + 1
        }))
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Ensure all numeric values are properly converted
      const submitData = {
        ...formData,
        paid_amount: Number(formData.paid_amount) || 0,
        total_amount: formData.items.reduce((sum, item) => {
          return sum + (Number(item.quantity) * Number(item.unit_price));
        }, 0),
        items: formData.items.map(item => ({
          ...item,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
          total_price: Number(item.quantity) * Number(item.unit_price)
        }))
      };

      // Log the data being sent
      console.log('Submitting purchase order data:', {
        ...submitData,
        paid_amount: submitData.paid_amount,
        total_amount: submitData.total_amount,
        payment_status: submitData.paid_amount >= submitData.total_amount ? 'Paid' : 
                       (submitData.paid_amount > 0 ? 'Partially Paid' : 'Unpaid')
      });

      // Make sure paid_amount is included in the request
      const response = await api.post('/purchase-orders', {
        ...submitData,
        paid_amount: submitData.paid_amount,
        payment_status: submitData.paid_amount >= submitData.total_amount ? 'Paid' : 
                       (submitData.paid_amount > 0 ? 'Partially Paid' : 'Unpaid')
      });
      
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Purchase order created successfully.",
        });
        navigate("/purchase");
      } else {
        throw new Error(response.data.message || "Failed to create purchase order");
      }
    } catch (error) {
      console.error('Error creating purchase order:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to create purchase order",
        variant: "destructive"
      });
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
            <label htmlFor="purchase_request_id" className="text-sm font-medium">
              Purchase Request
            </label>
            <Select
              onValueChange={(value) => handleSelectChange("purchase_request_id", value)}
              value={formData.purchase_request_id}
              required
            >
              <SelectTrigger id="purchase_request_id" className="w-full">
                <SelectValue placeholder="Select purchase request">
                  {formData.purchase_request_id ? 
                    `PR-${formData.purchase_request_id}` : 
                    "Select purchase request"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {purchaseRequests && purchaseRequests.length > 0 ? (
                  purchaseRequests.map(request => (
                    <SelectItem key={request.purchase_request_id} value={request.purchase_request_id}>
                      PR-{request.purchase_request_id} - {new Date(request.request_date).toLocaleDateString()} {request.total_amount}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-requests" disabled>
                    No approved purchase requests available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="vendor_id" className="text-sm font-medium">
              Vendor
            </label>
            <Select
              onValueChange={(value) => handleSelectChange("vendor_id", value)}
              value={formData.vendor_id || undefined}
              required
            >
              <SelectTrigger id="vendor_id" className="w-full">
                <SelectValue placeholder="Select vendor">
                  {formData.vendor_id ? 
                    vendors.find(v => v.vendor_id === formData.vendor_id)?.vendor_name : 
                    "Select vendor"}
                </SelectValue>
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

          <div className="space-y-2">
            <label htmlFor="order_date" className="text-sm font-medium">
              Order Date
            </label>
            <input
              type="date"
              id="order_date"
              name="order_date"
              value={formData.order_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="payment_id" className="text-sm font-medium">
              Payment ID
            </label>
            <input
              type="text"
              id="payment_id"
              name="payment_id"
              value={formData.payment_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter payment ID"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="payment_date" className="text-sm font-medium">
              Payment Date
            </label>
            <input
              type="date"
              id="payment_date"
              name="payment_date"
              value={formData.payment_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="paid_amount" className="text-sm font-medium">
              Paid Amount
            </label>
            <input
              type="number"
              id="paid_amount"
              name="paid_amount"
              value={formData.paid_amount}
              onChange={(e) => {
                const value = Math.floor(Number(e.target.value));
                console.log('Paid amount changed:', value); // Debug log
                setFormData(prev => {
                  const newData = { ...prev, paid_amount: value };
                  console.log('Updated form data:', newData); // Debug log
                  return newData;
                });
              }}
              className="w-full px-3 py-2 border rounded-md"
              min="0"
              step="1"
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              rows="3"
              placeholder="Add any additional notes here..."
            />
          </div>
        </div>

        {/* Add Item Section */}
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Items</h3>
            <Button
              type="button"
              onClick={addItem}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="item_name" className="text-sm font-medium">
                Item Name
              </label>
              <input
                type="text"
                id="item_name"
                name="item_name"
                value={newItem.item_name}
                onChange={handleItemChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter item name"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="item_details" className="text-sm font-medium">
                Item Details
              </label>
              <input
                type="text"
                id="item_details"
                name="item_details"
                value={newItem.item_details}
                onChange={handleItemChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter item details"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category_id" className="text-sm font-medium">
                Category
              </label>
              <Select
                onValueChange={(value) => {
                  setNewItem(prev => ({ ...prev, category_id: value }));
                }}
                value={newItem.category_id}
                required
              >
                <SelectTrigger id="category_id" className="w-full">
                  <SelectValue placeholder="Select category">
                    {newItem.category_id ? 
                      categories.find(c => c.category_id === newItem.category_id)?.category_name : 
                      "Select category"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categories && categories.length > 0 ? (
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
              <label htmlFor="quantity" className="text-sm font-medium">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={newItem.quantity}
                onChange={handleItemChange}
                className="w-full px-3 py-2 border rounded-md"
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="unit_price" className="text-sm font-medium">
                Unit Price
              </label>
              <input
                type="number"
                id="unit_price"
                name="unit_price"
                value={newItem.unit_price}
                onChange={handleItemChange}
                className="w-full px-3 py-2 border rounded-md"
                min="0"
                step="1"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="item_status" className="text-sm font-medium">
                Item Status
              </label>
              <Select
                onValueChange={(value) => {
                  setNewItem(prev => ({ ...prev, item_status: value }));
                }}
                value={newItem.item_status}
                required
              >
                <SelectTrigger id="item_status" className="w-full">
                  <SelectValue placeholder="Select status">
                    {newItem.item_status}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ordered">Ordered</SelectItem>
                  <SelectItem value="Received">Received</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="Returned">Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="total_price" className="text-sm font-medium">
                Total Price
              </label>
              <input
                type="number"
                id="total_price"
                name="total_price"
                value={newItem.total_price}
                className="w-full px-3 py-2 border rounded-md bg-gray-50"
                readOnly
                step="1"
              />
            </div>
          </div>
        </div>

        {/* Items List */}
        {formData.items.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Items List</h3>
            <div className="grid gap-4">
              {formData.items.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="grid grid-cols-2 gap-4 flex-grow">
                      <div>
                        <h4 className="font-medium text-gray-900">Item {item.item_number}: {item.item_name}</h4>
                        {item.item_details && (
                          <p className="text-sm text-gray-500">
                            Details: {item.item_details}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          Category: {categories.find(c => c.category_id === item.category_id)?.category_name || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Status: {item.item_status}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Quantity</p>
                          <p className="font-medium">{item.quantity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Unit Price</p>
                          <p className="font-medium">${Math.floor(item.unit_price)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Price</p>
                          <p className="font-medium">${Math.floor(item.total_price)}</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  {item.notes && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Notes:</span> {item.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Create Purchase Order
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PurchaseOrderForm;