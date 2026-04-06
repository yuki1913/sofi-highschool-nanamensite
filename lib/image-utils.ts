/**
 * Convert Google Drive share link to direct image URL
 * Input:  https://drive.google.com/file/d/{id}/view?usp=sharing
 * Output: https://drive.google.com/uc?export=view&id={id}
 */
export function convertGoogleDriveUrl(url: string): string {
  if (!url) return ""

  // Check if it's already a direct Google Drive URL
  if (url.includes("drive.google.com/uc?export=view")) {
    return url
  }

  // Extract ID from share link
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/)
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`
  }

  // If it doesn't match Google Drive pattern, return as is
  return url
}
