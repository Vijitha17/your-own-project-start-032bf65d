-- Migration to rename column approve_by to approver_id in PurchaseRequests table
ALTER TABLE PurchaseRequests
RENAME COLUMN approve_by TO approver_id;
