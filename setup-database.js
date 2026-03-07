const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://onlrkjvewecrrfkrgwhz.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ubHJranZld2VjcnJma3Jnd2h6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTA0Mjk2MiwiZXhwIjoyMDU2NjE4OTYyfQ.wJDqx_YFzYEZP8-fZoUJd3O3qF0hNB6HHVzYWyaBUa8'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log('Setting up March Madness database...')
  
  try {
    // Create sales_reps table
    const { error: createRepsTableError } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS sales_reps (
          id text PRIMARY KEY,
          name text NOT NULL,
          total_sales integer DEFAULT 0,
          total_premium numeric DEFAULT 0,
          rank integer DEFAULT 1,
          last_sale timestamp with time zone DEFAULT '2024-03-01T00:00:00.000Z',
          team text DEFAULT 'All In Agencies',
          bracket_position integer DEFAULT 1,
          created_at timestamp with time zone DEFAULT now(),
          updated_at timestamp with time zone DEFAULT now()
        );
      `
    })
    
    if (createRepsTableError) console.log('Sales reps table already exists or error:', createRepsTableError.message)
    else console.log('✅ Created sales_reps table')

    // Create sales table
    const { error: createSalesTableError } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS sales (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          rep_name text NOT NULL,
          client_name text NOT NULL,
          policy_type text NOT NULL,
          premium numeric NOT NULL,
          timestamp timestamp with time zone DEFAULT now(),
          created_at timestamp with time zone DEFAULT now()
        );
      `
    })
    
    if (createSalesTableError) console.log('Sales table already exists or error:', createSalesTableError.message)
    else console.log('✅ Created sales table')

    // Check if reps exist
    const { data: existingReps, error: checkError } = await supabase
      .from('sales_reps')
      .select('id')
      .limit(1)
    
    if (checkError) {
      console.log('Error checking existing reps:', checkError.message)
      return
    }

    if (existingReps && existingReps.length === 0) {
      // Insert all 34 agents
      const agents = [
        'MAX KONOPKA', 'ROBERT BRADY', 'ZION RUSSELL', 'BYRON ACHA', 'JOSE VALDEZ',
        'JADEN POPE', 'WESTON CHRISTOPHER', 'NOLAN SCHOENBACHLER', 'THOMAS FOX', 'JEREMI KISINSKI',
        'JAKE DOLL', 'DANIEL SUAREZ', 'RYAN BOVE', 'RYAN COOPER', 'LUCAS KONSTATOS',
        'ANTHONY MAYROSE', 'ANDREW FLASKAMP', 'FABIAN ESCATEL', 'KAMREN HERALD', 'JAYLEN BISCHOFF',
        'BRENNAN SKODA', 'AALYIAH WASHBURN', 'KADEN CAMENZIND', 'HANNAH FRENCH', 'MICHAEL CARNEY',
        'TAJ DHILLON', 'JACOB LEE', 'ADRIEN RAMÍREZ-RAYO', 'DENNIS CHORNIY', 'CHARLIE SIMMS',
        'BRENON REED', 'KIRILL PAVLYCHEV', 'LAINEY DROWN', 'VALERIA ALVAL'
      ]

      const repsToInsert = agents.map((name, index) => ({
        id: (index + 1).toString(),
        name,
        total_sales: 0,
        total_premium: 0,
        rank: index + 1,
        last_sale: '2024-03-01T00:00:00.000Z',
        team: 'All In Agencies',
        bracket_position: index + 1
      }))

      const { error: insertError } = await supabase
        .from('sales_reps')
        .insert(repsToInsert)
      
      if (insertError) {
        console.error('Error inserting sales reps:', insertError.message)
      } else {
        console.log('✅ Inserted all 34 agents')
      }
    } else {
      console.log('✅ Agents already exist in database')
    }
    
    console.log('🎯 Database setup complete! Tournament is ready.')
    console.log('🌐 URL: https://www.allingiveaway.com')
    
  } catch (error) {
    console.error('Error setting up database:', error.message)
  }
}

setupDatabase()