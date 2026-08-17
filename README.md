# AlgoVis — Algorithm Visualizer

An interactive web app for visualizing classic algorithms step by step — built with **React + Vite**.

## Features

- **Sorting** — Bubble, Selection, Insertion, Merge, Quick, Heap Sort
- **Tree Traversals** — In-order, Pre-order, Post-order
- **Graph Algorithms** — BFS (Breadth-First Search), DFS (Depth-First Search)

Each visualizer includes:
- ▶ Play / ⏸ Pause / → Step / ← Back controls
- Adjustable animation speed
- Color-coded state visualization
- Syntax-highlighted algorithm code panel
- Time & space complexity info

## Tech Stack

| | |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| Styling | Vanilla CSS (CSS variables) |
| Graphs/Trees | SVG (programmatic) |

## Architecture

**Layered architecture** with strict one-way dependencies:

```
/pages        ← presentation (page wrappers + Navbar)
/visualizers  ← application logic (state, animation, controls)
/algorithms   ← domain logic (pure functions, zero React deps)
```

See the full [design analysis](./DESIGN.md) for SOLID, GRASP, and design patterns used.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Project Structure

```
src/
├── algorithms/
│   ├── sorting/      # bubble.js, merge.js, quick.js, insertion.js, selection.js, heap.js
│   ├── trees/        # traversals.js (in/pre/post-order)
│   └── graphs/       # bfs.js, dfs.js
├── visualizers/      # SortVisualizer, TreeVisualizer, GraphVisualizer
├── pages/            # Home, Sorting, Trees, Graphs
├── components/       # Navbar
└── index.css         # Global design system
```
