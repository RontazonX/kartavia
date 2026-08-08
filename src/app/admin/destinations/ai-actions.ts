'use server'

export async function findWikipediaImage(title: string) {
  try {
    const headers = { 'User-Agent': 'KartaviaApp/1.0 (contact@kartavia.com)' }
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(title)}&pithumbsize=1000&format=json`, { headers })
    const data = await res.json()
    const pages = data.query?.pages
    if (pages) {
      const pageId = Object.keys(pages)[0]
      if (pageId !== '-1' && pages[pageId].thumbnail) {
        return { success: true, url: pages[pageId].thumbnail.source }
      }
    }
    // Fallback to general search if title doesn't match a page exactly
    const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(title)}&utf8=&format=json`, { headers })
    const searchData = await searchRes.json()
    if (searchData.query?.search?.length > 0) {
        const firstResultTitle = searchData.query.search[0].title
        const res2 = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(firstResultTitle)}&pithumbsize=1000&format=json`, { headers })
        const data2 = await res2.json()
        const pages2 = data2.query?.pages
        if (pages2) {
            const pageId2 = Object.keys(pages2)[0]
            if (pageId2 !== '-1' && pages2[pageId2].thumbnail) {
                return { success: true, url: pages2[pageId2].thumbnail.source }
            }
        }
    }
    
    return { success: false, error: 'No image found' }
  } catch (e) {
    return { success: false, error: 'Failed to fetch image' }
  }
}
