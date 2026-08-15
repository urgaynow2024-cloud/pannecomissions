-- Add deleted_at column to portfolio_items for trash system
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

-- Create index for faster queries on non-deleted items
CREATE INDEX IF NOT EXISTS idx_portfolio_items_deleted_at ON portfolio_items(deleted_at);
