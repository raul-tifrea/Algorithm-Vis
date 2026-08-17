import { Link } from 'react-router-dom';
import './Home.css';

const CATEGORIES = [
  {
    to: '/sorting',
    icon: '▥',
    title: 'Sorting',
    color: 'blue',
    algorithms: ['Bubble', 'Merge', 'Quick', 'Insertion', 'Selection', 'Heap'],
    desc: 'Watch arrays get sorted step by step with 6 classic algorithms.',
  },
  {
    to: '/trees',
    icon: '⬡',
    title: 'Tree Traversals',
    color: 'purple',
    algorithms: ['In-order', 'Pre-order', 'Post-order'],
    desc: 'Step through a binary tree using different traversal strategies.',
  },
  {
    to: '/graphs',
    icon: '◎',
    title: 'Graph Algorithms',
    color: 'green',
    algorithms: ['BFS', 'DFS'],
    desc: 'Explore graph traversal with BFS and DFS on an interactive graph.',
  },
];

export default function Home() {
  return (
    <div className="home fade-in-up">
      {/* Hero */}
      <section className="hero">
        <h1>Algorithm <span className="gradient-text">Visualizer</span></h1>
        <p className="hero-sub">
          An interactive playground for sorting algorithms, tree traversals,
          and graph searches — step by step, frame by frame.
        </p>
        <div className="hero-actions">
          <Link to="/sorting" className="btn btn-primary">Start with Sorting →</Link>
          <Link to="/graphs"  className="btn btn-ghost">Graph Algorithms</Link>
        </div>
      </section>

      {/* Category Cards */}
      <section className="categories">
        {CATEGORIES.map(cat => (
          <Link key={cat.to} to={cat.to} className={`category-card card color-${cat.color}`}>
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
            <span className="cat-cta">Open →</span>
          </Link>
        ))}
      </section>

      {/* Quick features */}
      <section className="features">
        <div className="features-grid">
          {[
            { icon: '⏯', label: 'Play / Pause / Step' },
            { icon: '⟵', label: 'Go Back one frame' },
            { icon: '⚡', label: 'Adjustable speed' },
            { icon: '</>', label: 'View algorithm code' },
          ].map(f => (
            <div key={f.label} className="feature-chip card">
              <span className="chip-icon">{f.icon}</span>
              <span className="chip-label">{f.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
