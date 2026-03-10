#!/usr/bin/env node

// Verify the Ryan fix worked correctly

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://ickpatjkbkovhckmdkne.supabase.co'
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_mUyBSjIwOryHZbVCcRCTQw_IlSvptDH'

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyFix() {
  try {
    console.log('🔍 Verifying Ryan fix...')
    
    // Check both Ryans
    const { data: salesReps, error } = await supabase
      .from('sales_reps')
      .select('*')
      .in('name', ['RYAN BOVE', 'RYAN COOPER'])

    if (error) {
      console.error('❌ Error:', error)
      return
    }

    console.log('📊 Current Ryan status:')
    salesReps.forEach(rep => {
      console.log(`  ${rep.name}: ${rep.total_sales} sales, $${rep.total_premium} premium`)
    })

    // Verify both are at 0
    const allZero = salesReps.every(rep => rep.total_sales === 0 && rep.total_premium === 0)
    
    if (allZero) {
      console.log('✅ Fix verified! Both Ryans are reset to 0.')
    } else {
      console.log('❌ Issue still exists - Ryans not properly reset.')
    }

    // Show current leaderboard
    console.log('\n📈 Current Top 10 Leaderboard:')
    const { data: topReps, error: topError } = await supabase
      .from('sales_reps')
      .select('name, total_sales, total_premium')
      .order('total_premium', { ascending: false })
      .limit(10)

    if (!topError) {
      topReps.forEach((rep, index) => {
        console.log(`  ${index + 1}. ${rep.name}: ${rep.total_sales} sales, $${rep.total_premium}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Verification error:', error)
  }
}

verifyFix()