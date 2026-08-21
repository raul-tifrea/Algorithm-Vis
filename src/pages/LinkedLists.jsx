import React from 'react';
import './PageLayout.css';
import LinkedListVisualizer from '../visualizers/LinkedListVisualizer';

export default function LinkedLists() {
  return (
    <div className="page fade-in">
      <header className="page-header">
        <div>
          <h1 className="page-title">Linked Lists</h1>
          <p className="page-subtitle">Visualize pointer manipulations in Linked List algorithms</p>
        </div>
      </header>
      
      <main className="page-content">
        <LinkedListVisualizer />
      </main>
    </div>
  );
}
