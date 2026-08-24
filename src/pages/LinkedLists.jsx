import React from 'react';
import './PageLayout.css';
import LinkedListVisualizer from '../visualizers/LinkedListVisualizer';

const ListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="9" width="6" height="6" rx="1" />
    <rect x="16" y="9" width="6" height="6" rx="1" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <polyline points="14 9 17 12 14 15" />
  </svg>
);

export default function LinkedLists() {
  return (
    <div className="page fade-in">
      <div className="page-header">
        <span className="page-icon purple"><ListIcon /></span>
        <div>
          <h2>Linked Lists</h2>
          <p>Visualize pointer manipulations in Linked List algorithms</p>
        </div>
      </div>
      
      <main className="page-content">
        <LinkedListVisualizer />
      </main>
    </div>
  );
}
