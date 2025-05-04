import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const VendorForm = ({ vendor, onCancel, onSave }) => {
  const [formData, setFormData] = useState(vendor || {
    vendor_name: "",
    vendor_type: "",
    contact_person: "",
    phone: "",
    email: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Tamil Nadu",
    status: "Active",
    notes: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {vendor && (
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="vendor_id" className="text-sm font-medium">
              Vendor ID
            </label>
            <input
              id="vendor_id"
              type="text"
              className="w-full px-3 py-2 border rounded-md bg-gray-100"
              value={vendor.vendor_id}
              disabled
            />
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="vendor_name" className="text-sm font-medium">
            Vendor Name *
          </label>
          <input
            id="vendor_name"
            name="vendor_name"
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            value={formData.vendor_name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="vendor_type" className="text-sm font-medium">
            Vendor Type *
          </label>
          <Select 
            name="vendor_type" 
            value={formData.vendor_type}
            onValueChange={(value) => setFormData(prev => ({ ...prev, vendor_type: value }))}
            required
          >
            <SelectTrigger id="vendor_type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Service">Service Vendor</SelectItem>
              <SelectItem value="Product">Product Vendor</SelectItem>
              <SelectItem value="Both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="contact_person" className="text-sm font-medium">
            Contact Person *
          </label>
          <input
            id="contact_person"
            name="contact_person"
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            value={formData.contact_person}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="w-full px-3 py-2 border rounded-md"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full px-3 py-2 border rounded-md"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">
            Status *
          </label>
          <Select 
            name="status" 
            value={formData.status}
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
            required
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Blacklisted">Blacklisted</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="address_line1" className="text-sm font-medium">
            Address Line 1 *
          </label>
          <input
            id="address_line1"
            name="address_line1"
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            value={formData.address_line1}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="address_line2" className="text-sm font-medium">
            Address Line 2
          </label>
          <input
            id="address_line2"
            name="address_line2"
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            value={formData.address_line2}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="city" className="text-sm font-medium">
            City *
          </label>
          <input
            id="city"
            name="city"
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="state" className="text-sm font-medium">
            State *
          </label>
          <input
            id="state"
            name="state"
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="postal_code" className="text-sm font-medium">
            Postal Code *
          </label>
          <input
            id="postal_code"
            name="postal_code"
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            value={formData.postal_code}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="country" className="text-sm font-medium">
            Country
          </label>
          <input
            id="country"
            name="country"
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            value={formData.country}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="notes" className="text-sm font-medium">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            className="w-full px-3 py-2 border rounded-md"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {vendor ? "Update Vendor" : "Save Vendor"}
        </Button>
      </div>
    </form>
  );
};

export default VendorForm;