'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Vendor {
  vendor_id: string;
  name: string;
}

interface Category {
  category_id: string;
  name: string;
}

interface PurchaseRequest {
  purchase_request_id: string;
  vendor_id: string;
  requested_by: string;
  approved_by: string;
  total_amount: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  grand_total: number;
  paid_amount: number;
  balance_amount: number;
  items: any[];
}

export default function CreatePurchaseOrder() {
  const router = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [formData, setFormData] = useState({
    purchase_request_id: '',
    vendor_id: '',
    order_date: '',
    expected_delivery_date: '',
    tracking_number: '',
    status: 'pending',
    notes: '',
    ordered_by: '',
    approved_by: '',
    total_amount: 0,
    tax_amount: 0,
    shipping_amount: 0,
    discount_amount: 0,
    grand_total: 0,
    paid_amount: 0,
    balance_amount: 0,
    payment_status: 'Unpaid',
    payment_reference: '',
    bill_copy_path: '',
    order_status: 'Placed',
    return_reason: '',
    return_date: '',
    expected_receive_after_return: '',
    actual_delivery_date: '',
    payment_terms: '',
    payment_date: '',
    shipping_method: '',
    items: [] as any[]
  });

  useEffect(() => {
    // Fetch vendors
    fetch('/api/vendors')
      .then(res => res.json())
      .then(data => setVendors(data));

    // Fetch categories
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data));

    // Fetch purchase requests
    fetch('/api/purchase-requests')
      .then(res => res.json())
      .then(data => setPurchaseRequests(data));
  }, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'purchase_request_id' && value) {
      const selectedRequest = purchaseRequests.find(req => req.purchase_request_id === value);
      if (selectedRequest) {
        setFormData(prev => ({
          ...prev,
          vendor_id: selectedRequest.vendor_id,
          ordered_by: selectedRequest.requested_by,
          approved_by: selectedRequest.approved_by,
          total_amount: selectedRequest.total_amount,
          tax_amount: selectedRequest.tax_amount,
          shipping_amount: selectedRequest.shipping_amount,
          discount_amount: selectedRequest.discount_amount,
          grand_total: selectedRequest.grand_total,
          paid_amount: selectedRequest.paid_amount,
          balance_amount: selectedRequest.balance_amount,
          items: selectedRequest.items.map((item: any) => ({
            purchaserequest_item_id: item.purchaserequest_item_id,
            item_name: item.item_name,
            category_id: item.category_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            specifications: item.specifications,
            notes: item.notes
          }))
        }));
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/purchase-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/purchase-orders');
      } else {
        console.error('Failed to create purchase order');
      }
    } catch (error) {
      console.error('Error creating purchase order:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Purchase Order</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Request</label>
            <select
              name="purchase_request_id"
              value={formData.purchase_request_id}
              onChange={handleSelectChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Purchase Request</option>
              {purchaseRequests.map((request) => (
                <option key={request.purchase_request_id} value={request.purchase_request_id}>
                  {request.purchase_request_id}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Vendor</label>
            <select
              name="vendor_id"
              value={formData.vendor_id}
              onChange={handleSelectChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.vendor_id} value={vendor.vendor_id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Order Date</label>
            <input
              type="date"
              name="order_date"
              value={formData.order_date}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Expected Delivery Date</label>
            <input
              type="date"
              name="expected_delivery_date"
              value={formData.expected_delivery_date}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tracking Number</label>
            <input
              type="text"
              name="tracking_number"
              value={formData.tracking_number}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleSelectChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Ordered By</label>
            <input
              type="text"
              name="ordered_by"
              value={formData.ordered_by}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Approved By</label>
            <input
              type="text"
              name="approved_by"
              value={formData.approved_by}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Total Amount</label>
            <input
              type="number"
              name="total_amount"
              value={formData.total_amount}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tax Amount</label>
            <input
              type="number"
              name="tax_amount"
              value={formData.tax_amount}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Shipping Amount</label>
            <input
              type="number"
              name="shipping_amount"
              value={formData.shipping_amount}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Discount Amount</label>
            <input
              type="number"
              name="discount_amount"
              value={formData.discount_amount}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Grand Total</label>
            <input
              type="number"
              name="grand_total"
              value={formData.grand_total}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Paid Amount</label>
            <input
              type="number"
              name="paid_amount"
              value={formData.paid_amount}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Balance Amount</label>
            <input
              type="number"
              name="balance_amount"
              value={formData.balance_amount}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Status</label>
            <select
              name="payment_status"
              value={formData.payment_status}
              onChange={handleSelectChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="Unpaid">Unpaid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Paid">Paid</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Reference</label>
            <input
              type="text"
              name="payment_reference"
              value={formData.payment_reference}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Bill number/Transaction ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bill Copy</label>
            <input
              type="file"
              name="bill_copy"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // Handle file upload here
                  setFormData(prev => ({ ...prev, bill_copy_path: file.name }));
                }
              }}
              className="mt-1 block w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Order Status</label>
            <select
              name="order_status"
              value={formData.order_status}
              onChange={handleSelectChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="Placed">Placed</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Received">Received</option>
              <option value="Returned">Returned</option>
            </select>
          </div>

          {formData.order_status === 'Returned' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Return Reason</label>
                <textarea
                  name="return_reason"
                  value={formData.return_reason}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Return Date</label>
                <input
                  type="date"
                  name="return_date"
                  value={formData.return_date}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Expected Receive After Return</label>
                <input
                  type="date"
                  name="expected_receive_after_return"
                  value={formData.expected_receive_after_return}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Actual Delivery Date</label>
            <input
              type="date"
              name="actual_delivery_date"
              value={formData.actual_delivery_date}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Terms</label>
            <input
              type="text"
              name="payment_terms"
              value={formData.payment_terms}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Net 30, COD"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Date</label>
            <input
              type="date"
              name="payment_date"
              value={formData.payment_date}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Shipping Method</label>
            <input
              type="text"
              name="shipping_method"
              value={formData.shipping_method}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Express, Standard"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="mt-6">
          <h2 className="text-lg font-medium mb-4">Items</h2>
          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow border">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">{item.item_name}</h3>
                    <p className="text-sm text-gray-600">
                      Category: {categories.find(c => c.category_id === item.category_id)?.name}
                    </p>
                    {item.specifications && (
                      <p className="text-sm text-gray-600 mt-1">{item.specifications}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Quantity: {item.quantity}</p>
                    <p className="text-sm">Unit Price: ${item.unit_price}</p>
                    <p className="font-medium">Total: ${item.quantity * item.unit_price}</p>
                  </div>
                </div>
                {item.notes && (
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-sm text-gray-600">{item.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Purchase Order
          </button>
        </div>
      </form>
    </div>
  );
} 