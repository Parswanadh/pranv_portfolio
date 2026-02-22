# Smart Semantic Search Implementation

## Overview
Smart semantic search system using TF-IDF (Term Frequency-Inverse Document Frequency) embeddings for intelligent content discovery across the portfolio.

## Components

### 1. Content Indexer (`lib/content-indexer.ts`)
Indexes all portfolio content including:
- **Projects**: All projects with titles, descriptions, tech stack, and categories
- **Pages**: Main portfolio pages (Home, About, Projects, Agents, Contact, etc.)
- **Skills**: Expertise areas (AI, Machine Learning, Embedded Systems, etc.)

**Interface**:
```typescript
interface ContentItem {
  id: string
  type: 'project' | 'page' | 'section' | 'skill'
  title: string
  description: string
  content: string
  tags: string[]
  url: string
  timestamp?: number
}
```

### 2. Embeddings Generator (`lib/embeddings.ts`)
Generates TF-IDF vectors for semantic similarity:
- **Vocabulary Building**: Creates a vocabulary from all indexed content
- **Document Frequency**: Calculates how often terms appear across documents
- **TF-IDF Calculation**: Computes term importance for each document
- **Vector Normalization**: Normalizes vectors for cosine similarity
- **Search Function**: Performs semantic search with combined scoring

**Key Functions**:
- `generateEmbeddings()`: Creates TF-IDF embeddings for all content
- `searchContent(query, limit)`: Performs semantic search
- Returns ranked results with similarity scores

### 3. Smart Search Component (`components/SmartSearch.tsx`)
Full-featured search interface with:
- **Keyboard Shortcuts**: `Shift+K` or `Cmd+Shift+K` to open
- **Real-time Search**: Debounced search with loading states
- **Keyboard Navigation**: Arrow keys + Enter to navigate and select
- **Visual Feedback**: Score indicators, type icons, and highlighting
- **Responsive Design**: Mobile-friendly with backdrop blur

**Features**:
- Type-specific icons and colors
- Relevance score display (percentage + emoji)
- Search suggestions for common terms
- Empty states with helpful guidance
- Smooth animations and transitions

### 4. Search API (`app/api/search/route.ts`)
RESTful API endpoints:
- **GET `/api/search?q=query`**: Simple search endpoint
- **POST `/api/search`**: Advanced search with options
- Returns JSON with results, count, and query info

### 5. Search Utilities (`lib/search-utils.ts`)
Helper functions:
- `getSearchSuggestions()`: Get search suggestions
- `getSearchHighlight()`: Highlight matching text
- `formatScore()`: Format relevance scores
- `getTypeEmoji()`: Get type-specific emojis
- `getTypeLabel()`: Get type labels

## Usage

### Keyboard Shortcuts
- `Shift+K` / `Cmd+Shift+K`: Toggle smart search
- `↑/↓`: Navigate results
- `Enter`: Select result
- `Esc`: Close search

### Example Searches
- "AI projects" - Finds AI-related projects
- "Python" - Finds Python-based projects and skills
- "Robotics" - Finds robotics projects and skills
- "About" - Finds the About page
- "Computer Vision" - Finds CV projects and expertise

## Algorithm Details

### TF-IDF Scoring
1. **Term Frequency (TF)**: How often a term appears in a document
2. **Inverse Document Frequency (IDF)**: How unique the term is across all documents
3. **TF-IDF Score**: TF × IDF (term importance)

### Combined Scoring
- **Text Similarity (70%)**: Keyword matching in title, description, tags, content
- **Vector Similarity (30%)**: Cosine similarity of TF-IDF vectors
- **Boosts**: Title matches (+3), description matches (+2), tag matches (+2.5)

### Performance
- Indexed content cached in memory
- Debounced search (300ms) to reduce API calls
- Normalized vectors for fast cosine similarity
- Limited vocabulary (top 50 terms per document)

## Integration

### Layout Integration
Added to `app/layout.tsx`:
```tsx
import { SmartSearch } from '@/components/SmartSearch'

// In body:
<SmartSearch />
```

### Server Actions
Server action available at `lib/actions/search.ts`:
```typescript
'use server'

import { performSearch } from '@/lib/actions/search'

const results = await performSearch('AI', 10)
```

## Future Enhancements

### Phase 5: Advanced Features
1. **OpenAI Embeddings**: Replace TF-IDF with real embeddings
2. **Hybrid Search**: Combine semantic and keyword search
3. **Fuzzy Matching**: Handle typos and misspellings
4. **Search History**: Remember recent searches
5. **Analytics**: Track search queries and results
6. **A/B Testing**: Test different ranking algorithms

### Optimization Opportunities
1. **Vector Database**: Use ChromaDB or Pinecone for embeddings
2. **Caching**: Cache search results and embeddings
3. **Pagination**: Handle large result sets
4. **Faceted Search**: Add filters for type, category, date
5. **Auto-suggest**: Real-time suggestions as you type

## Files Created

1. `lib/content-indexer.ts` - Content indexing logic
2. `lib/embeddings.ts` - TF-IDF embeddings and search
3. `lib/search-utils.ts` - Search helper functions
4. `lib/actions/search.ts` - Server actions for search
5. `components/SmartSearch.tsx` - Search UI component
6. `app/api/search/route.ts` - REST API endpoints

## Testing

### Manual Testing
1. Press `Shift+K` to open search
2. Type "AI" and see results
3. Use arrow keys to navigate
4. Press Enter to select a result
5. Try different queries: "Python", "Robotics", "About"

### API Testing
```bash
# GET request
curl "http://localhost:3000/api/search?q=AI"

# POST request
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query":"AI","limit":5}'
```

## Notes

- **Client-side search**: Search runs entirely in the browser
- **No API keys required**: Uses TF-IDF instead of external embeddings
- **Privacy-focused**: No data sent to external services
- **Fast**: Indexed content cached in memory
- **Scalable**: Can handle hundreds of items without performance issues

## Dependencies

None! This implementation uses:
- Built-in TypeScript/JavaScript
- React hooks
- Next.js routing
- Lucide React icons (already in project)
