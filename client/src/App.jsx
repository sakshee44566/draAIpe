import { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { useUser } from './contexts/UserContext';

import Home from './components/Home'
import Women from './components/Women'
import Men from './components/Men'
import Accessories from './components/Accessories'
import AISuggestion from './components/AISuggestion'
import Cart from './components/Cart'
import Login from './components/Login'
import './App.css'

function App() {
  const [cart, setCart] = useState([])
  const { user, setUser } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) setUser(JSON.parse(storedUser));
}, []);

  return (
    <div>
      <header style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', borderBottom: '1px solid #eee'}}>
        <div style={{fontWeight: 'bold', fontSize: '1.5rem'}}>drAIpe</div>
        <nav>
          <ul style={{display: 'flex', gap: '1.5rem', listStyle: 'none', margin: 0, padding: 0}}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/women">Women</Link></li>
            <li><Link to="/men">Men</Link></li>
            <li><Link to="/accessories">Accessories</Link></li>
            <li><Link to="/ai-suggestion">AI Suggestion</Link></li>
            <li><Link to="/cart">Cart ({cart.length})</Link></li>
            <li style={{ position: 'relative' }}>
              {user ? (
                <div
                  className="user-dropdown"
                  style={{ position: 'relative', display: 'inline-block' }}
                  onClick={(e) => { e.stopPropagation(); setShowDropdown((v) => !v); }}
                >
                  <button
                    className="user-btn"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Hi, {user.name}!
                  </button>
                  {showDropdown && (
                    <div
                      className="dropdown-menu"
                      style={{
                        position: 'absolute',
                        top: '2.2rem',
                        right: 0,
                        background: '#fff',
                        border: '1px solid #eee',
                        borderRadius: '4px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        zIndex: 10,
                      }}
                    >
                      <button
                        style={{
                          padding: '0.5rem 1.5rem',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          width: '100%',
                          textAlign: 'left',
                        }}
                        onClick={() => {
                          setUser(null);
                          localStorage.removeItem('user');
                          setShowDropdown(false);
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login">Login/Sign In</Link>
              )}
            </li>
          </ul>
        </nav>
      </header>
      <main style={{padding: '2rem'}}>
        <Routes>
          <Route path="/" element={<Home cart={cart} setCart={setCart} />} />
          <Route path="/women" element={<Women cart={cart} setCart={setCart} />} />
          <Route path="/men" element={<Men cart={cart} setCart={setCart} />} />
          <Route path="/accessories" element={<Accessories cart={cart} setCart={setCart} />} />
          <Route path="/ai-suggestion" element={<AISuggestion />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  )
}

export default App;
