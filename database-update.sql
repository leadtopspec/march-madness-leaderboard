-- Database update for 36 participants tournament
-- Run this in Supabase SQL Editor after the initial setup

-- First, update JAYLEN BISCHOFF to TIVON BURNS (ID 20)
UPDATE sales_reps 
SET name = 'TIVON BURNS' 
WHERE id = '20' AND name = 'JAYLEN BISCHOFF';

-- Add the two new participants for 18th game
INSERT INTO sales_reps (id, name, total_sales, total_premium, rank, last_sale, team, bracket_position) VALUES
  ('35', 'KADEN BAKER', 0, 0, 35, '2024-03-01T00:00:00.000Z', 'All In Agencies', 35),
  ('36', 'LYNDSEY NOOMAN', 0, 0, 36, '2024-03-01T00:00:00.000Z', 'All In Agencies', 36)
ON CONFLICT (id) DO NOTHING;

-- Verify the updates
SELECT id, name FROM sales_reps WHERE id IN ('20', '35', '36') ORDER BY id;