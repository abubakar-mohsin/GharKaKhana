// Compute meal log dates on the client so we use the user's real local day.
// If we derive the date on the server, users near midnight can get the wrong
// calendar date because the server timezone may not match their browser timezone.

export function getLocalDateString() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function getMealTimeFromHour() {
  const hour = new Date().getHours()

  if (hour >= 6 && hour < 11) return 'BREAKFAST'
  if (hour >= 11 && hour < 16) return 'LUNCH'
  if (hour >= 16 && hour < 22) return 'DINNER'

  return 'SNACK'
}
