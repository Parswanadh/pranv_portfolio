'use server'

import { searchContent } from '@/lib/embeddings'

export async function performSearch(
  query: string,
  limit = 8
): Promise<Array<{ item: any; score: number }>> {
  if (!query || query.trim().length === 0) {
    return []
  }

  return await searchContent(query, limit)
}
