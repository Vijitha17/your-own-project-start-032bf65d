-- Check if tables exist with wrong case and rename them if needed
RENAME TABLE IF EXISTS `purchaseorders` TO `PurchaseOrders`;
RENAME TABLE IF EXISTS `purchase_order_items` TO `PurchaseOrderItems`;
RENAME TABLE IF EXISTS `purchaserequests` TO `PurchaseRequests`;
RENAME TABLE IF EXISTS `purchaserequestitems` TO `PurchaseRequestItems`;

-- Verify table structure
SHOW TABLES; 