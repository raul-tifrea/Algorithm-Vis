import React from 'react';
import './PageLayout.css';
import GridVisualizer from '../visualizers/GridVisualizer';

const PathIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="15" y1="3" x2="15" y2="21" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
  </svg>
);

export default function Pathfinding() {
  return (
    <div className="page fade-in">
      <div className="page-header">
        <span className="page-icon blue"><PathIcon /></span>
        <div>
          <h2>Pathfinding</h2>
          <p>Navigate through a grid using search algorithms</p>
        </div>
      </div>
      
      <main className="page-content">
        <GridVisualizer />
      </main>
    </div>
  );
}
