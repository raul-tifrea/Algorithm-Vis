import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import './App.css';
import Home    from './pages/Home';
import Sorting from './pages/Sorting';
import Trees   from './pages/Trees';
import Graphs  from './pages/Graphs';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/"        element={<Home />}    />
            <Route path="/sorting" element={<Sorting />} />
            <Route path="/trees"   element={<Trees />}   />
            <Route path="/graphs"  element={<Graphs />}  />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
