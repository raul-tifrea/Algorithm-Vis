import GraphVisualizer from '../visualizers/GraphVisualizer';
import './PageLayout.css';

const GraphIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5" cy="12" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="19" cy="19" r="2"/>
    <line x1="7" y1="12" x2="17" y2="6"/><line x1="7" y1="12" x2="17" y2="18"/>
  </svg>
);

export default function Graphs() {
  return (
    <div className="page">
      <div className="page-header">
        <span className="page-icon green"><GraphIcon /></span>
        <div>
          <h2>Graph Algorithms</h2>
          <p>Traverse a pre-built graph with BFS and DFS — watch the frontier and visited nodes update live.</p>
        </div>
      </div>
      <GraphVisualizer />
    </div>
  );
}
