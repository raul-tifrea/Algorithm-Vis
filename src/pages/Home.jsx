import { Link } from 'react-router-dom';
import './Home.css';

const CategoryIcons = {
  sorting: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  trees: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4" r="2" /><circle cx="6" cy="14" r="2" /><circle cx="18" cy="14" r="2" />
      <line x1="12" y1="6" x2="6" y2="12" /><line x1="12" y1="6" x2="18" y2="12" />
    </svg>
  ),
  graphs: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="12" r="2" /><circle cx="19" cy="5" r="2" /><circle cx="19" cy="19" r="2" />
      <line x1="7" y1="12" x2="17" y2="6" /><line x1="7" y1="12" x2="17" y2="18" />
    </svg>
  ),
};


const CATEGORIES = [
  {
    to: '/sorting',
    icon: CategoryIcons.sorting,
    title: 'Sorting',
    color: 'blue',
    algorithms: ['Bubble', 'Merge', 'Quick', 'Insertion', 'Selection', 'Heap'],
    desc: 'Watch arrays get sorted step by step with 6 classic algorithms.',
  },
  {
    to: '/trees',
    icon: CategoryIcons.trees,
    title: 'Tree Algorithms',
    color: 'purple',
    algorithms: ['In-order', 'Pre-order', 'Post-order', 'BST Search', 'BST Insert'],
    desc: 'Step through a binary tree with traversal strategies and BST operations.',
  },
  {
    to: '/graphs',
    icon: CategoryIcons.graphs,
    title: 'Graph Algorithms',
    color: 'green',
    algorithms: ['BFS', 'DFS', 'Dijkstra', 'Bellman-Ford', 'Prim', 'Kruskal'],
    desc: 'Explore graph traversal with algorithms — watch the frontier and visited nodes update live.',
  },
];


export default function Home() {
  return (
    <div className="home fade-in-up">

      <section className="hero">
        <div className="hero-eyebrow">Interactive Learning</div>
        <h1>Algorithm <span className="gradient-text">Visualizer</span></h1>
        <p className="hero-sub">
          An interactive playground for sorting algorithms, tree traversals,
          and graph searches — step by step, frame by frame.
        </p>
        <div className="hero-actions">
          <Link to="/sorting" className="btn btn-primary">Start with Sorting</Link>
          <Link to="/graphs" className="btn btn-ghost">Graph Algorithms</Link>
        </div>
      </section>

      <section className="bento">

        {CATEGORIES.map(cat => (
          <Link key={cat.to} to={cat.to} className={`bento-card cat-card card color-${cat.color}`}>
            <div className="cat-header">
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-title">{cat.title}</span>
            </div>
            <p className="cat-desc">{cat.desc}</p>
            <div className="cat-algos">
              {cat.algorithms.map(a => (
                <span key={a} className="cat-algo-tag">{a}</span>
              ))}
            </div>
            <span className="cat-cta">Open &rarr;</span>
          </Link>
        ))}

      </section>
    </div>
  );
}
