import { NavLink } from 'react-router-dom';
import './Navbar.css';

const NAV_ITEMS = [
  { to: '/',        label: 'Home',    icon: '⌂' },
  { to: '/sorting', label: 'Sorting', icon: '▥' },
  { to: '/trees',   label: 'Trees',   icon: '⬡' },
  { to: '/graphs',  label: 'Graphs',  icon: '◎' },
];

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <span className="brand-icon">{'</>'}</span>
          <span className="brand-name">AlgoVis</span>
        </NavLink>

        <ul className="navbar-links">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                <span className="nav-icon">{icon}</span>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
