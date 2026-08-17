import GraphVisualizer from '../visualizers/GraphVisualizer';
import './PageLayout.css';

export default function Graphs() {
  return (
    <div className="page">
      <div className="page-header">
        <span className="page-icon green">◎</span>
        <div>
          <h2>Graph Algorithms</h2>
          <p>Traverse a pre-built graph with BFS and DFS — watch the frontier and visited nodes update live.</p>
        </div>
      </div>
      <GraphVisualizer />
    </div>
  );
}
