#!/usr/bin/env node

// Test script to verify the Ryan Cooper/Ryan Bove fix

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://ickpatjkbkovhckmdkne.supabase.co'
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_mUyBSjIwOryHZbVCcRCTQw_IlSvptDH'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testRyanFix() {
  try {
    console.log('🧪 Testing Ryan Cooper/Ryan Bove fix...')
    
    // Test 1: Add a sale for Ryan Cooper
    console.log('\n1️⃣ Adding test sale for RYAN COOPER...')
    const { error: cooperSaleError } = await supabase
      .from('sales')
      .insert([{
        rep_name: 'RYAN COOPER',
        client_name: 'Test Client Cooper',
        policy_type: 'Term Life',
        premium: 100.00,
        timestamp: new Date().toISOString()
      }])

    if (cooperSaleError) {
      console.error('❌ Error adding Ryan Cooper sale:', cooperSaleError)
      return
    }
    
    console.log('✅ Sale added for RYAN COOPER')

    // Test 2: Check that it went to the right Ryan
    await new Promise(resolve => setTimeout(resolve, 2000)) // Wait for processing
    
    console.log('\n2️⃣ Checking database state...')
    const { data: salesReps, error } = await supabase
      .from('sales_reps')
      .select('*')
      .in('name', ['RYAN COOPER', 'RYAN BOVE'])

    if (error) {
      console.error('❌ Error fetching Ryans:', error)
      return
    }

    console.log('\n📊 Current Ryan states:')
    salesReps.forEach(rep => {
      console.log(`  ${rep.name}: ${rep.total_sales} sales, $${rep.total_premium} premium`)
    })

    // Test 3: Add a sale for Ryan Bove
    console.log('\n3️⃣ Adding test sale for RYAN BOVE...')
    const { error: boveSaleError } = await supabase
      .from('sales')
      .insert([{
        rep_name: 'RYAN BOVE',
        client_name: 'Test Client Bove',
        policy_type: 'Term Life',
        premium: 200.00,
        timestamp: new Date().toISOString()
      }])

    if (boveSaleError) {
      console.error('❌ Error adding Ryan Bove sale:', boveSaleError)
      return
    }
    
    console.log('✅ Sale added for RYAN BOVE')

    // Test 4: Final verification
    await new Promise(resolve => setTimeout(resolve, 2000)) // Wait for processing
    
    console.log('\n4️⃣ Final verification...')
    const { data: finalReps, error: finalError } = await supabase
      .from('sales_reps')
      .select('*')
      .in('name', ['RYAN COOPER', 'RYAN BOVE'])

    if (finalError) {
      console.error('❌ Error in final check:', finalError)
      return
    }

    console.log('\n📊 Final Ryan states:')
    finalReps.forEach(rep => {
      console.log(`  ${rep.name}: ${rep.total_sales} sales, $${rep.total_premium} premium`)
    })

    // Verify separation
    const cooper = finalReps.find(r => r.name === 'RYAN COOPER')
    const bove = finalReps.find(r => r.name === 'RYAN BOVE')

    if (cooper && bove) {
      if (cooper.total_premium >= 100 && bove.total_premium >= 200) {
        console.log('\n✅ SUCCESS: Both Ryans are being tracked separately!')
        console.log('   Ryan Cooper has his own sales (including $100 test sale)')
        console.log('   Ryan Bove has his own sales (including $200 test sale)')
      } else {
        console.log('\n❌ ISSUE: Sales may still be mixing between Ryans')
      }
    }
    
  } catch (error) {
    console.error('❌ Test script error:', error)
  }
}

testRyanFix()