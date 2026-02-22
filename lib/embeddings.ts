import { indexContent, type ContentItem } from './content-indexer'

export type { ContentItem }

export interface EmbeddingVector {
  id: string
  vector: number[]
  keywords: string[]
}

// Simple keyword extraction and TF-IDF like approach
// For production, consider using OpenAI embeddings or a local model
export async function generateEmbeddings(): Promise<Map<string, EmbeddingVector>> {
  const items = await indexContent()
  const embeddings = new Map<string, EmbeddingVector>()

  // Build vocabulary and document frequency
  const vocabulary = new Map<string, number>()
  const docFrequency = new Map<string, number>()

  items.forEach((item) => {
    const words = item.content.toLowerCase().split(/\W+/)
    const uniqueWords = new Set(words.filter((w) => w.length > 3))

    uniqueWords.forEach((word) => {
      vocabulary.set(word, (vocabulary.get(word) || 0) + 1)
    })

    uniqueWords.forEach((word) => {
      docFrequency.set(word, (docFrequency.get(word) || 0) + 1)
    })
  })

  // Generate embeddings for each item
  items.forEach((item) => {
    const words = item.content.toLowerCase().split(/\W+/)
    const termFrequency = new Map<string, number>()

    // Calculate TF for this document
    words.forEach((word) => {
      if (word.length > 3) {
        termFrequency.set(word, (termFrequency.get(word) || 0) + 1)
      }
    })

    // Calculate TF-IDF vector
    const vector: number[] = []
    const keywords: string[] = []

    // Sort terms by TF-IDF score
    const termScores = Array.from(termFrequency.entries())
      .map(([term, tf]) => {
        const df = docFrequency.get(term) || 1
        const idf = Math.log(items.length / df)
        const tfidf = tf * idf
        return { term, tfidf }
      })
      .sort((a, b) => b.tfidf - a.tfidf)

    // Take top terms for embedding
    const topTerms = termScores.slice(0, 50)

    topTerms.forEach(({ term, tfidf }) => {
      vector.push(tfidf)
      keywords.push(term)
    })

    // Normalize vector
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0))
    const normalizedVector = vector.map((val) => (magnitude > 0 ? val / magnitude : 0))

    embeddings.set(item.id, {
      id: item.id,
      vector: normalizedVector,
      keywords: keywords.slice(0, 10), // Store top 10 keywords
    })
  })

  return embeddings
}

export async function searchContent(
  query: string,
  limit = 5
): Promise<Array<{ item: ContentItem; score: number }>> {
  const embeddings = await generateEmbeddings()
  const items = await indexContent()

  // Process query
  const queryWords = query.toLowerCase().split(/\W+/).filter((w) => w.length > 3)

  if (queryWords.length === 0) {
    return []
  }

  // Create query embedding
  const queryTermFreq = new Map<string, number>()
  queryWords.forEach((word) => {
    queryTermFreq.set(word, (queryTermFreq.get(word) || 0) + 1)
  })

  // Calculate scores for each item
  const results = items.map((item) => {
    const embedding = embeddings.get(item.id)

    if (!embedding) {
      return { item, score: 0 }
    }

    // Calculate text similarity (keyword matching)
    let textScore = 0
    const itemWords = item.content.toLowerCase().split(/\W+/)

    queryWords.forEach((queryWord) => {
      // Exact match in title
      if (item.title.toLowerCase().includes(queryWord)) {
        textScore += 3
      }
      // Exact match in description
      if (item.description.toLowerCase().includes(queryWord)) {
        textScore += 2
      }
      // Match in tags
      if (item.tags.some((tag) => tag.toLowerCase().includes(queryWord))) {
        textScore += 2.5
      }
      // Match in content
      itemWords.forEach((itemWord) => {
        if (itemWord === queryWord) {
          textScore += 1
        }
      })
    })

    // Calculate vector similarity (cosine similarity)
    const queryVector = Array.from(queryTermFreq.values())
    const itemVector = embedding.vector

    let cosineSimilarity = 0

    if (queryVector.length > 0 && itemVector.length > 0) {
      // Pad query vector to match item vector length
      const paddedQuery = [...queryVector]
      while (paddedQuery.length < itemVector.length) {
        paddedQuery.push(0)
      }

      const dotProduct = paddedQuery.reduce((sum, val, i) => sum + val * itemVector[i], 0)

      const queryMagnitude = Math.sqrt(paddedQuery.reduce((sum, val) => sum + val * val, 0))
      const itemMagnitude = Math.sqrt(itemVector.reduce((sum, val) => sum + val * val, 0))

      if (queryMagnitude > 0 && itemMagnitude > 0) {
        cosineSimilarity = dotProduct / (queryMagnitude * itemMagnitude)
      }
    }

    // Combine scores (70% text similarity, 30% vector similarity)
    const combinedScore = textScore * 0.7 + cosineSimilarity * 0.3

    return { item, score: combinedScore }
  })

  // Sort by score and return top results
  return results
    .sort((a, b) => b.score - a.score)
    .filter((result) => result.score > 0) // Only return relevant results
    .slice(0, limit)
}
