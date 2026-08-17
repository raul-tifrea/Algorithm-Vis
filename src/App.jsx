import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar  from './components/Navbar';
import Home    from './pages/Home';
import Sorting from './pages/Sorting';
import Trees   from './pages/Trees';
import Graphs  from './pages/Graphs';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"        element={<Home />}    />
        <Route path="/sorting" element={<Sorting />} />
        <Route path="/trees"   element={<Trees />}   />
        <Route path="/graphs"  element={<Graphs />}  />
      </Routes>
    </BrowserRouter>
  );
}
