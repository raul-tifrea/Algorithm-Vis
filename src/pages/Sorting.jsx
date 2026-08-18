import SortVisualizer from '../visualizers/SortVisualizer';
import './PageLayout.css';

const SortIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

export default function Sorting() {
  return (
    <div className="page">
      <div className="page-header">
        <span className="page-icon blue"><SortIcon /></span>
        <div>
          <h2>Sorting Algorithms</h2>
          <p>Select an algorithm, adjust the size and speed, then press Play Button.</p>
        </div>
      </div>
      <SortVisualizer />
    </div>
  );
}
