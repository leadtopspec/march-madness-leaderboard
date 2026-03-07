// Reset the tournament to start fresh
const API_URL = 'https://api.jsonbin.io/v3/b/6754465aad19ca34f8cec3a7'
const API_KEY = '$2a$10$n8r4VBF7v2MgUgzHLRRpW.pRaHQ4SLo9uMlOCb0e/YyE.NBK0lBNu'

const AGENTS = [
  'MAX KONOPKA', 'ROBERT BRADY', 'ZION RUSSELL', 'BYRON ACHA', 'JOSE VALDEZ',
  'JADEN POPE', 'WESTON CHRISTOPHER', 'NOLAN SCHOENBACHLER', 'THOMAS FOX', 'JEREMI KISINSKI',
  'JAKE DOLL', 'DANIEL SUAREZ', 'RYAN BOVE', 'RYAN COOPER', 'LUCAS KONSTATOS',
  'ANTHONY MAYROSE', 'ANDREW FLASKAMP', 'FABIAN ESCATEL', 'KAMREN HERALD', 'JAYLEN BISCHOFF',
  'BRENNAN SKODA', 'AALYIAH WASHBURN', 'KADEN CAMENZIND', 'HANNAH FRENCH', 'MICHAEL CARNEY',
  'TAJ DHILLON', 'JACOB LEE', 'ADRIEN RAMÍREZ-RAYO', 'DENNIS CHORNIY', 'CHARLIE SIMMS',
  'BRENON REED', 'KIRILL PAVLYCHEV', 'LAINEY DROWN', 'VALERIA ALVAL'
]

async function resetTournament() {
  const salesReps = AGENTS.map((name, index) => ({
    id: (index + 1).toString(),
    name,
    totalSales: 0,
    totalPremium: 0,
    rank: index + 1,
    lastSale: '2024-03-01T00:00:00.000Z',
    team: 'All In Agencies',
    bracketPosition: index + 1
  }))

  const data = {
    salesReps,
    sales: [],
    lastUpdated: new Date().toISOString()
  }

  try {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY
      },
      body: JSON.stringify(data)
    })

    if (response.ok) {
      console.log('✅ Tournament reset successfully!')
      console.log('🏀 All 34 agents at 0 sales, ready for competition')
    } else {
      console.error('❌ Error resetting tournament:', response.statusText)
    }
  } catch (error) {
    console.error('❌ Network error:', error)
  }
}

resetTournament()