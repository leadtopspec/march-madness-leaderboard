-- Update database with current 36 tournament participants

-- First, update JAYLEN BISCHOFF to TIVON BURNS if it exists
UPDATE sales_reps 
SET name = 'TIVON BURNS' 
WHERE name = 'JAYLEN BISCHOFF';

-- Add the 2 new participants
INSERT INTO sales_reps (id, name, total_sales, total_premium, rank, last_sale, team, bracket_position) VALUES
  ('35', 'KADEN BAKER', 0, 0, 35, '2024-03-01T00:00:00.000Z', 'All In Agencies', 35),
  ('36', 'LYNDSEY NOOMAN', 0, 0, 36, '2024-03-01T00:00:00.000Z', 'All In Agencies', 36)
ON CONFLICT (id) DO NOTHING;

-- Update any existing sales records to point to correct names
UPDATE sales 
SET rep_name = 'TIVON BURNS' 
WHERE rep_name = 'JAYLEN BISCHOFF';

-- Recalculate ranks based on current totals
WITH ranked_reps AS (
  SELECT 
    id,
    RANK() OVER (ORDER BY total_sales DESC, total_premium DESC) as new_rank
  FROM sales_reps
)
UPDATE sales_reps 
SET rank = ranked_reps.new_rank
FROM ranked_reps
WHERE sales_reps.id = ranked_reps.id;