/**
 * Convert Google Drive share link to thumbnail URL
 * Input:  https://drive.google.com/file/d/{id}/view?usp=sharing
 * Output: https://drive.google.com/thumbnail?id={id}&sz=w800
 *
 * Note: uc?export=view is deprecated and often returns an HTML confirmation page.
 * The thumbnail API is the reliable alternative for embedding images.
 */
export function convertGoogleDriveUrl(url: string): string {
  if (!url) return ""

  // Already converted to thumbnail API
  if (url.includes("drive.google.com/thumbnail")) {
    return url
  }

  // Already using deprecated uc?export=view — convert to thumbnail
  const ucMatch = url.match(/[?&]id=([a-zA-Z0-9-_]+)/)
  if (url.includes("drive.google.com/uc") && ucMatch?.[1]) {
    return `https://drive.google.com/thumbnail?id=${ucMatch[1]}&sz=w800`
  }

  // Extract file ID from standard share link
  // Handles: /file/d/{id}/view, /d/{id}/, open?id={id}
  const fileMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/)
  if (fileMatch?.[1]) {
    return `https://drive.google.com/thumbnail?id=${fileMatch[1]}&sz=w800`
  }

  const openMatch = url.match(/[?&]id=([a-zA-Z0-9-_]+)/)
  if (openMatch?.[1]) {
    return `https://drive.google.com/thumbnail?id=${openMatch[1]}&sz=w800`
  }

  return url
}
