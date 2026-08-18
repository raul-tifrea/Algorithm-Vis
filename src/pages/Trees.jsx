import TreeVisualizer from '../visualizers/TreeVisualizer';
import './PageLayout.css';

const TreeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="4" r="2" /><circle cx="6" cy="14" r="2" /><circle cx="18" cy="14" r="2" />
    <line x1="12" y1="6" x2="6" y2="12" /><line x1="12" y1="6" x2="18" y2="12" />
  </svg>
);

export default function Trees() {
  return (
    <div className="page">
      <div className="page-header">
        <span className="page-icon purple"><TreeIcon /></span>
        <div>
          <h2>Tree Traversals</h2>
          <p>Explore a binary search tree using 3 traversal strategies.</p>
        </div>
      </div>
      <TreeVisualizer />
    </div>
  );
}
