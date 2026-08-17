import SortVisualizer from '../visualizers/SortVisualizer';
import './PageLayout.css';

export default function Sorting() {
  return (
    <div className="page">
      <div className="page-header">
        <span className="page-icon blue">▥</span>
        <div>
          <h2>Sorting Algorithms</h2>
          <p>Select an algorithm, adjust the size and speed, then press Play.</p>
        </div>
      </div>
      <SortVisualizer />
    </div>
  );
}
