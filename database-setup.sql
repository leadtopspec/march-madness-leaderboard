-- Run this SQL in your Supabase dashboard SQL Editor to set up the tables

-- Create sales_reps table
CREATE TABLE IF NOT EXISTS sales_reps (
  id text PRIMARY KEY,
  name text NOT NULL,
  total_sales integer DEFAULT 0,
  total_premium numeric DEFAULT 0,
  rank integer DEFAULT 1,
  last_sale timestamptz DEFAULT '2024-03-01T00:00:00.000Z',
  team text DEFAULT 'All In Agencies',
  bracket_position integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rep_name text NOT NULL,
  client_name text NOT NULL,
  policy_type text NOT NULL,
  premium numeric NOT NULL,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE sales_reps ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (tournament needs)
CREATE POLICY "Allow all access" ON sales_reps FOR ALL USING (true);
CREATE POLICY "Allow all access" ON sales FOR ALL USING (true);

-- Enable realtime
ALTER publication supabase_realtime ADD TABLE sales_reps;
ALTER publication supabase_realtime ADD TABLE sales;

-- Create function to update agent stats
CREATE OR REPLACE FUNCTION update_agent_stats(agent_name text, sale_amount numeric)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE sales_reps 
  SET 
    total_sales = total_sales + 1,
    total_premium = total_premium + sale_amount,
    last_sale = now()
  WHERE name ILIKE '%' || agent_name || '%'
    OR agent_name ILIKE '%' || name || '%';
END;
$$;

-- Insert the 34 tournament agents
INSERT INTO sales_reps (id, name, total_sales, total_premium, rank, last_sale, team, bracket_position) VALUES
  ('1', 'MAX KONOPKA', 0, 0, 1, '2024-03-01T00:00:00.000Z', 'All In Agencies', 1),
  ('2', 'ROBERT BRADY', 0, 0, 2, '2024-03-01T00:00:00.000Z', 'All In Agencies', 2),
  ('3', 'ZION RUSSELL', 0, 0, 3, '2024-03-01T00:00:00.000Z', 'All In Agencies', 3),
  ('4', 'BYRON ACHA', 0, 0, 4, '2024-03-01T00:00:00.000Z', 'All In Agencies', 4),
  ('5', 'JOSE VALDEZ', 0, 0, 5, '2024-03-01T00:00:00.000Z', 'All In Agencies', 5),
  ('6', 'JADEN POPE', 0, 0, 6, '2024-03-01T00:00:00.000Z', 'All In Agencies', 6),
  ('7', 'WESTON CHRISTOPHER', 0, 0, 7, '2024-03-01T00:00:00.000Z', 'All In Agencies', 7),
  ('8', 'NOLAN SCHOENBACHLER', 0, 0, 8, '2024-03-01T00:00:00.000Z', 'All In Agencies', 8),
  ('9', 'THOMAS FOX', 0, 0, 9, '2024-03-01T00:00:00.000Z', 'All In Agencies', 9),
  ('10', 'JEREMI KISINSKI', 0, 0, 10, '2024-03-01T00:00:00.000Z', 'All In Agencies', 10),
  ('11', 'JAKE DOLL', 0, 0, 11, '2024-03-01T00:00:00.000Z', 'All In Agencies', 11),
  ('12', 'DANIEL SUAREZ', 0, 0, 12, '2024-03-01T00:00:00.000Z', 'All In Agencies', 12),
  ('13', 'RYAN BOVE', 0, 0, 13, '2024-03-01T00:00:00.000Z', 'All In Agencies', 13),
  ('14', 'RYAN COOPER', 0, 0, 14, '2024-03-01T00:00:00.000Z', 'All In Agencies', 14),
  ('15', 'LUCAS KONSTATOS', 0, 0, 15, '2024-03-01T00:00:00.000Z', 'All In Agencies', 15),
  ('16', 'ANTHONY MAYROSE', 0, 0, 16, '2024-03-01T00:00:00.000Z', 'All In Agencies', 16),
  ('17', 'ANDREW FLASKAMP', 0, 0, 17, '2024-03-01T00:00:00.000Z', 'All In Agencies', 17),
  ('18', 'FABIAN ESCATEL', 0, 0, 18, '2024-03-01T00:00:00.000Z', 'All In Agencies', 18),
  ('19', 'KAMREN HERALD', 0, 0, 19, '2024-03-01T00:00:00.000Z', 'All In Agencies', 19),
  ('20', 'JAYLEN BISCHOFF', 0, 0, 20, '2024-03-01T00:00:00.000Z', 'All In Agencies', 20),
  ('21', 'BRENNAN SKODA', 0, 0, 21, '2024-03-01T00:00:00.000Z', 'All In Agencies', 21),
  ('22', 'AALYIAH WASHBURN', 0, 0, 22, '2024-03-01T00:00:00.000Z', 'All In Agencies', 22),
  ('23', 'KADEN CAMENZIND', 0, 0, 23, '2024-03-01T00:00:00.000Z', 'All In Agencies', 23),
  ('24', 'HANNAH FRENCH', 0, 0, 24, '2024-03-01T00:00:00.000Z', 'All In Agencies', 24),
  ('25', 'MICHAEL CARNEY', 0, 0, 25, '2024-03-01T00:00:00.000Z', 'All In Agencies', 25),
  ('26', 'TAJ DHILLON', 0, 0, 26, '2024-03-01T00:00:00.000Z', 'All In Agencies', 26),
  ('27', 'JACOB LEE', 0, 0, 27, '2024-03-01T00:00:00.000Z', 'All In Agencies', 27),
  ('28', 'ADRIEN RAMÍREZ-RAYO', 0, 0, 28, '2024-03-01T00:00:00.000Z', 'All In Agencies', 28),
  ('29', 'DENNIS CHORNIY', 0, 0, 29, '2024-03-01T00:00:00.000Z', 'All In Agencies', 29),
  ('30', 'CHARLIE SIMMS', 0, 0, 30, '2024-03-01T00:00:00.000Z', 'All In Agencies', 30),
  ('31', 'BRENON REED', 0, 0, 31, '2024-03-01T00:00:00.000Z', 'All In Agencies', 31),
  ('32', 'KIRILL PAVLYCHEV', 0, 0, 32, '2024-03-01T00:00:00.000Z', 'All In Agencies', 32),
  ('33', 'LAINEY DROWN', 0, 0, 33, '2024-03-01T00:00:00.000Z', 'All In Agencies', 33),
  ('34', 'VALERIA ALVAL', 0, 0, 34, '2024-03-01T00:00:00.000Z', 'All In Agencies', 34)
ON CONFLICT (id) DO NOTHING;