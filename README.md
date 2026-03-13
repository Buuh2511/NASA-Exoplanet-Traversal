# NASA Exoplanet Traversal

A web app for querying and visualizing exoplanet data from the [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/). Filter by discovery year and facility, sort results, and explore planet mass comparisons visually.

---

## Getting Started

```bash
cd app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How to Use

### Search

Once the **"Data ready"** badge appears in the header, use the **Query Exoplanets** panel to filter by **Discovery Year**, **Discovery Facility**, or both. Click **Search** to run — at least one filter is required. Click **Clear** to reset.

### Results Table

Results display up to **10 rows at a time** (scroll for more). Click any column header to sort ascending → descending → off. Use the **`+ Add column`** button to add optional columns (Host Star, # Planets, # Stars), and click any column tag to remove it.

### Visualization

The **Mass Comparison** panel below the table renders the first 10 results as spheres sized by planet mass. Hover a sphere to see its name.

---

## Development

```bash
npm test          # run tests
npm run test:watch  # watch mode
npm run lint
npm run format
```

---

## Challenges & Solutions

**Loading speed** — The app fetches the full exoplanet dataset from NASA's TAP API on first load. The API route caches the response for 24 hours with `stale-while-revalidate`, so subsequent visits are instant.

**Query performance** — Filtering thousands of records on every search would be slow. On load, the data is indexed into two `Map` structures keyed by year and facility. Queries resolve in O(1) lookups; combined filters use set intersection on the smaller index, keeping searches near-instant regardless of dataset size.

**Sort stability** — Null values (missing measurements) are consistently pushed to the end of sorted results regardless of direction, preventing them from floating to the top on descending sorts.

**Column management** — Optional columns are tracked separately from core columns. `useMemo` ensures derived lists (`available`, `removable`) only recompute when the column state actually changes, avoiding unnecessary re-renders on every keystroke or scroll.
