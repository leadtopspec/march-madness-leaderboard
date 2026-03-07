// TOURNAMENT DATA RESET SCRIPT
// This will clear ALL tournament data and start fresh

const JSONBIN_ID = '67543c1eacd3cb34a8b2bbdf'
const JSONBIN_KEY = '$2a$10$DVaj3B8eMT1ggwsB6HCEa.8Y3Rh7QLnOLCnpTcuI7kT9qNADiGY4a'

const initialReps = [
  "MAX KONOPKA", "ROBERT BRADY", "ZION RUSSELL", "BYRON ACHA", "JOSE VALDEZ",
  "JADEN POPE", "WESTON CHRISTOPHER", "NOLAN SCHOENBACHLER", "THOMAS FOX", "JEREMI KISINSKI",
  "JAKE DOLL", "DANIEL SUAREZ", "RYAN BOVE", "RYAN COOPER", "LUCAS KONSTATOS",
  "ANTHONY MAYROSE", "ANDREW FLASKAMP", "FABIAN ESCATEL", "KAMREN HERALD", "JAYLEN BISCHOFF",
  "BRENNAN SKODA", "AALYIAH WASHBURN", "KADEN CAMENZIND", "HANNAH FRENCH", "MICHAEL CARNEY",
  "TAJ DHILLON", "JACOB LEE", "ADRIEN RAMÍREZ-RAYO", "DENNIS CHORNIY", "CHARLIE SIMMS",
  "BRENON REED", "KIRILL PAVLYCHEV", "LAINEY DROWN", "VALERIA ALVAL"
].map((name, index) => ({
  id: `agent_${index + 1}`,
  name,
  totalSales: 0,
  totalPremium: 0,
  rank: index + 1,
  lastSale: new Date().toISOString(),
  team: index < 17 ? "TEAM RED" : "TEAM BLACK",
  bracketPosition: index + 1
}))

const freshTournamentData = {
  salesReps: initialReps,
  sales: [],
  lastUpdated: new Date().toISOString(),
  version: Date.now()
}

async function resetTournament() {
  try {
    console.log('🔄 Resetting tournament data...')
    
    // Reset cloud storage
    const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_KEY,
        'X-Bin-Meta': 'false'
      },
      body: JSON.stringify(freshTournamentData)
    })
    
    if (!response.ok) {
      throw new Error(`JSONBin reset failed: ${response.status}`)
    }
    
    console.log('✅ Cloud storage reset successfully')
    console.log(`📊 Reset to 0 sales for all ${initialReps.length} agents`)
    console.log('🎯 Tournament is ready for fresh start!')
    
  } catch (error) {
    console.error('❌ Reset failed:', error)
    process.exit(1)
  }
}

resetTournament()