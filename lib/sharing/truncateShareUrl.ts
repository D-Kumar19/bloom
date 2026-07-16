const URL_PATTERN = /https?:\/\/[^\s]+/g

function truncateUrlBody(url: string): string {
  try {
    const parsed = new URL(url)
    const query = parsed.searchParams.get('b')

    if (!query || query.length <= 28) {
      return url
    }

    const truncatedQuery = `${query.slice(0, 24)}...${query.slice(-4)}`
    parsed.searchParams.set('b', truncatedQuery)
    return parsed.toString()
  } catch {
    if (url.length <= 48) {
      return url
    }

    return `${url.slice(0, 32)}...${url.slice(-4)}`
  }
}

export function truncateShareUrl(url: string): string {
  return truncateUrlBody(url)
}

export function formatShareMessagePreview(message: string): string {
  return message.replace(URL_PATTERN, (url) => truncateShareUrl(url))
}
