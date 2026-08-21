import React from 'react';
import './PageLayout.css';
import GridVisualizer from '../visualizers/GridVisualizer';

export default function Pathfinding() {
  return (
    <div className="page fade-in">
      <header className="page-header">
        <div>
          <h1 className="page-title">Pathfinding</h1>
          <p className="page-subtitle">Navigate through a grid using search algorithms</p>
        </div>
      </header>
      
      <main className="page-content">
        <GridVisualizer />
      </main>
    </div>
  );
}
