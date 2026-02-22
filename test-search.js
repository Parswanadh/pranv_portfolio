// Simple test script to verify search functionality
const projects = require('./lib/data/projects.ts').projects

console.log('Projects loaded:', projects.length)
console.log('Sample project:', projects[0])

// Test content indexing
async function testIndex() {
  const { indexContent } = require('./lib/content-indexer.ts')
  const items = await indexContent()
  console.log('Indexed items:', items.length)
  console.log('Sample items:', items.slice(0, 3))
}

// Test embeddings
async function testEmbeddings() {
  const { searchContent } = require('./lib/embeddings.ts')
  const results = await searchContent('AI', 5)
  console.log('Search results for "AI":', results.length)
  console.log('Top result:', results[0])
}

async function run() {
  await testIndex()
  await testEmbeddings()
}

run().catch(console.error)
