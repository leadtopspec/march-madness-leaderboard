#!/usr/bin/env node

// Fix Ryan Cooper/Ryan Bove confusion issue
// This script will backup data, then reset both Ryans to 0

const { createClient } = require('@supabase/supabase-js')

// Use the correct Supabase URL (from Jeremi's confirmation: ickpatjkbkovhckmdkne)
const supabaseUrl = 'https://ickpatjkbkovhckmdkne.supabase.co'
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_mUyBSjIwOryHZbVCcRCTQw_IlSvptDH'

const supabase = createClient(supabaseUrl, supabaseKey)

async function backupAndFixRyans() {
  try {
    console.log('🗄️ Backing up current tournament data...')
    
    // 1. Backup all sales_reps data
    const { data: salesReps, error: salesError } = await supabase
      .from('sales_reps')
      .select('*')
      .order('total_premium', { ascending: false })

    if (salesError) {
      console.error('❌ Error fetching sales_reps:', salesError)
      return
    }

    // 2. Backup all sales data
    const { data: sales, error: salesDataError } = await supabase
      .from('sales')
      .select('*')
      .order('timestamp', { ascending: false })

    if (salesDataError) {
      console.error('❌ Error fetching sales:', salesDataError)
      return
    }

    // 3. Save backup to file
    const backup = {
      timestamp: new Date().toISOString(),
      salesReps,
      sales,
      notes: 'Backup before fixing Ryan Cooper/Ryan Bove confusion issue'
    }

    require('fs').writeFileSync(
      `tournament-backup-${new Date().toISOString().split('T')[0]}.json`,
      JSON.stringify(backup, null, 2)
    )

    console.log('✅ Backup saved to tournament-backup-' + new Date().toISOString().split('T')[0] + '.json')
    
    // 4. Find both Ryans
    const ryanBove = salesReps.find(rep => rep.name === 'RYAN BOVE')
    const ryanCooper = salesReps.find(rep => rep.name === 'RYAN COOPER')

    console.log('📊 Current Ryan data:')
    console.log('  RYAN BOVE:', ryanBove ? `${ryanBove.total_sales} sales, $${ryanBove.total_premium} premium` : 'Not found')
    console.log('  RYAN COOPER:', ryanCooper ? `${ryanCooper.total_sales} sales, $${ryanCooper.total_premium} premium` : 'Not found')

    // 5. Reset both Ryans to 0
    console.log('🔄 Resetting both Ryans to 0...')

    if (ryanBove) {
      const { error: boveError } = await supabase
        .from('sales_reps')
        .update({
          total_sales: 0,
          total_premium: 0,
          last_sale: '2024-03-01T00:00:00.000Z',
          updated_at: new Date().toISOString()
        })
        .eq('id', ryanBove.id)

      if (boveError) {
        console.error('❌ Error updating RYAN BOVE:', boveError)
      } else {
        console.log('✅ RYAN BOVE reset to 0')
      }
    }

    if (ryanCooper) {
      const { error: cooperError } = await supabase
        .from('sales_reps')
        .update({
          total_sales: 0,
          total_premium: 0,
          last_sale: '2024-03-01T00:00:00.000Z',
          updated_at: new Date().toISOString()
        })
        .eq('id', ryanCooper.id)

      if (cooperError) {
        console.error('❌ Error updating RYAN COOPER:', cooperError)
      } else {
        console.log('✅ RYAN COOPER reset to 0')
      }
    }

    // 6. Remove all sales entries for both Ryans (to clean up confusion)
    const { error: deleteSalesError } = await supabase
      .from('sales')
      .delete()
      .in('rep_name', ['RYAN BOVE', 'RYAN COOPER'])

    if (deleteSalesError) {
      console.error('❌ Error deleting Ryan sales:', deleteSalesError)
    } else {
      console.log('✅ Cleared all sales entries for both Ryans')
    }

    console.log('🎉 Fix complete! Both Ryans have been reset to 0.')
    console.log('📝 Data backed up before changes.')
    
  } catch (error) {
    console.error('❌ Script error:', error)
  }
}

backupAndFixRyans()