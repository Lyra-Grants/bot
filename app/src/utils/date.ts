export function dateToYYYYMMDDHHMM(date: Date): string {
  const year = date.getUTCFullYear()
  const month = (1 + date.getUTCMonth()).toString().padStart(2, '0') // Months are 0-based, so add 1 and make it two digits
  const day = date.getUTCDate().toString().padStart(2, '0') // Make it two digits
  const hours = date.getUTCHours().toString().padStart(2, '0') // Make it two digits
  const minutes = date.getUTCMinutes().toString().padStart(2, '0') // Make it two digits
  return `${year}-${month}-${day}:${hours}:${minutes}`
}
