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
  pathfinding: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="15" y1="3" x2="15" y2="21" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
    </svg>
  ),
  linkedlists: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="9" width="6" height="6" rx="1" />
      <rect x="16" y="9" width="6" height="6" rx="1" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <polyline points="14 9 17 12 14 15" />
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
  {
    to: '/pathfinding',
    icon: CategoryIcons.pathfinding,
    title: 'Pathfinding',
    color: 'blue',
    algorithms: ['A*', 'Dijkstra'],
    desc: 'Draw walls on a 2D grid and watch A* and Disjkstra magically find the shortest path.',
  },
  {
    to: '/linked-lists',
    icon: CategoryIcons.linkedlists,
    title: 'Linked Lists',
    color: 'purple',
    algorithms: ['Reverse', 'Cycle Detection'],
    desc: 'Visualize pointer manipulation with classic Linked List algorithms.',
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
      </section>

      <section className="ios-list-group">
        {CATEGORIES.map(cat => (
          <Link key={cat.to} to={cat.to} className="ios-list-item">
            <div className={`ios-icon-box color-${cat.color}`}>
              {cat.icon}
            </div>
            <div className="ios-list-content">
              <span className="ios-list-title">{cat.title}</span>
              <span className="ios-list-subtitle">{cat.desc}</span>
            </div>
            <div className="ios-list-chevron">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
