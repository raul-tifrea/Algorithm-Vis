import TreeVisualizer from '../visualizers/TreeVisualizer';
import './PageLayout.css';

export default function Trees() {
  return (
    <div className="page">
      <div className="page-header">
        <span className="page-icon purple">⬡</span>
        <div>
          <h2>Tree Traversals</h2>
          <p>Explore a binary search tree using 4 traversal strategies.</p>
        </div>
      </div>
      <TreeVisualizer />
    </div>
  );
}
