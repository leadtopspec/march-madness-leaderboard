// EMERGENCY DATA RESET
export function resetAllTournamentData() {
  console.log('🔄 RESETTING ALL TOURNAMENT DATA...')
  
  // Clear all localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('march_madness_data')
    localStorage.removeItem('march_madness_emergency') 
    localStorage.removeItem('salesReps')
    localStorage.removeItem('recentSales')
    localStorage.removeItem('loggedInAgent')
    localStorage.clear()
    
    console.log('✅ localStorage cleared')
  }
  
  // Force page reload to start fresh
  if (typeof window !== 'undefined') {
    window.location.reload()
  }
}