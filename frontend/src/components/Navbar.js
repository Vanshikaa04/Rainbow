import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMenu, FiX, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { categoryMeta } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search,     setSearch]     = useState('');
  const [userMenu,   setUserMenu]   = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();
  const { admin, logout } = useAuth();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMobileOpen(false); setUserMenu(false); }, [location]);

  const handleSearch = e => {
    e.preventDefault();
    if (search.trim()) { navigate(`/?search=${encodeURIComponent(search.trim())}`); setSearch(''); }
  };

  const cats = Object.entries(categoryMeta);

  return (
    <>
      <motion.nav
        initial={{ y:-80 }} animate={{ y:0 }}
        transition={{ duration:.5, ease:[.4,0,.2,1] }}
        style={{
          position:'fixed', top:0, left:0, right:0, zIndex:1000,
          background:'rgba(255,255,255,0.97)',
          backdropFilter:'blur(20px)',
          borderBottom:'1px solid var(--border)',
          boxShadow: scrolled ? 'var(--shadow-md)' : 'var(--shadow-sm)',
          transition:'box-shadow .3s',
        }}>
        <div className="container" style={{ display:'flex', alignItems:'center', height:64, gap:14 }}>

          {/* Logo */}
          <Link to="/" style={{ display:'flex', alignItems:'center', flexShrink:0 }}>
            <motion.img src="/logo.png" alt="Rainbow Marketing"
              style={{ height:40, mixBlendMode:'multiply', display:'block' }}
              whileHover={{ scale:1.05 }} transition={{ type:'spring', stiffness:400 }}/>
          </Link>

          {/* Desktop category links */}
          <nav className="nav-links" style={{ display:'flex', gap:2, alignItems:'center', flex:1, overflow:'hidden' }}>
            <DLink to="/" label="All"/>
            {cats.map(([key, m]) => (
              <DLink key={key} to={`/category/${key}`} label={m.label} hoverBg={m.bg} hoverColor={m.color}/>
            ))}
          </nav>

          {/* Desktop search */}
          <form onSubmit={handleSearch} className="search-form"
            style={{ display:'flex', alignItems:'center', gap:7, background:'var(--surface)', borderRadius:11, padding:'8px 14px', border:'1.5px solid var(--border)', flexShrink:0 }}>
            <FiSearch style={{ color:'var(--text-muted)', fontSize:14 }}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..."
              style={{ border:'none', background:'transparent', outline:'none', fontSize:'0.85rem', width:130, color:'var(--text-primary)' }}/>
          </form>

          {/* Desktop user button */}
          <div style={{ position:'relative', flexShrink:0 }} className="search-form">
            <UserBtn admin={admin} onClick={()=>setUserMenu(v=>!v)}/>
            <AnimatePresence>
              {userMenu && <UserDropdown admin={admin} logout={logout} navigate={navigate} onClose={()=>setUserMenu(false)}/>}
            </AnimatePresence>
          </div>

          {/* ── Mobile: right-side cluster — login icon + hamburger ── */}
          <div style={{ display:'none', alignItems:'center', gap:8, marginLeft:'auto' }} className="mobile-nav-right">
            {/* Mobile user icon */}
            <div style={{ position:'relative' }}>
              <UserBtn admin={admin} onClick={()=>{ setUserMenu(v=>!v); setMobileOpen(false); }} small/>
              <AnimatePresence>
                {userMenu && <UserDropdown admin={admin} logout={logout} navigate={navigate} onClose={()=>setUserMenu(false)}/>}
              </AnimatePresence>
            </div>
            {/* Hamburger */}
            <motion.button
              whileTap={{ scale:.93 }}
              onClick={()=>{ setMobileOpen(v=>!v); setUserMenu(false); }}
              style={{ width:38, height:38, borderRadius:10, background:'var(--surface)', border:'1.5px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--text-primary)', flexShrink:0 }}>
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen
                  ? <motion.span key="x" initial={{ rotate:-90, opacity:0 }} animate={{ rotate:0, opacity:1 }} exit={{ rotate:90, opacity:0 }} transition={{ duration:.18 }}><FiX size={20}/></motion.span>
                  : <motion.span key="m" initial={{ rotate:90, opacity:0 }} animate={{ rotate:0, opacity:1 }} exit={{ rotate:-90, opacity:0 }} transition={{ duration:.18 }}><FiMenu size={20}/></motion.span>
                }
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile full-screen drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity:0, x:'100%' }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:'100%' }}
            transition={{ type:'spring', damping:28, stiffness:300 }}
            style={{ position:'fixed', inset:0, zIndex:999, background:'rgba(255,255,255,.98)', backdropFilter:'blur(24px)', padding:'80px 24px 40px', overflowY:'auto' }}>
            {/* Mobile search */}
            <form onSubmit={e=>{handleSearch(e);setMobileOpen(false);}}
              style={{ display:'flex', alignItems:'center', gap:8, background:'var(--surface)', borderRadius:12, padding:'11px 15px', border:'1.5px solid var(--border)', marginBottom:28 }}>
              <FiSearch style={{ color:'var(--text-muted)' }}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..."
                style={{ flex:1, border:'none', background:'transparent', outline:'none', fontSize:'0.93rem' }}/>
            </form>
            {/* Mobile links */}
            {[{ to:'/', label:'All Products', color:'var(--brand)' },
              ...cats.map(([k,m]) => ({ to:`/category/${k}`, label:m.label, color:m.color }))
            ].map((item, i) => (
              <motion.div key={item.to}
                initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}
                transition={{ delay:i*0.05, duration:.3 }}>
                <Link to={item.to}
                  style={{ display:'flex', alignItems:'center', padding:'15px 0', borderBottom:'1px solid var(--border)', fontSize:'1.05rem', fontWeight:500, color:item.color }}>
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click-outside for user dropdown */}
      {userMenu && <div onClick={()=>setUserMenu(false)} style={{ position:'fixed', inset:0, zIndex:199 }}/>}

      <style>{`
        @media(max-width:900px){
          .nav-links,.search-form{ display:none !important; }
          .mobile-nav-right{ display:flex !important; }
        }
      `}</style>
    </>
  );
}

const UserBtn = ({ admin, onClick, small }) => (
  <motion.button whileHover={{ scale:1.06 }} whileTap={{ scale:.94 }} onClick={onClick}
    style={{ width:small?34:38, height:small?34:38, borderRadius:10, border:'1.5px solid var(--border)', background:admin?'linear-gradient(135deg,#2E7D32,#43A047)':'white', display:'flex', alignItems:'center', justifyContent:'center', color:admin?'white':'var(--text-secondary)', cursor:'pointer', boxShadow:admin?'0 2px 10px rgba(46,125,50,.3)':'none', flexShrink:0 }}>
    <FiUser size={small?13:15}/>
  </motion.button>
);

const UserDropdown = ({ admin, logout, navigate, onClose }) => (
  <motion.div
    initial={{ opacity:0, scale:.92, y:-6 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:.92, y:-6 }}
    transition={{ type:'spring', damping:22, stiffness:360 }}
    style={{ position:'absolute', right:0, top:'calc(100% + 8px)', background:'white', borderRadius:14, border:'1px solid var(--border)', boxShadow:'var(--shadow-lg)', minWidth:195, overflow:'hidden', zIndex:300 }}>
    {admin ? (
      <>
        <div style={{ padding:'11px 15px', borderBottom:'1px solid var(--border)', background:'var(--surface)' }}>
          <div style={{ fontSize:'0.71rem', color:'var(--text-muted)', fontWeight:500 }}>Logged in as</div>
          <div style={{ fontWeight:700, fontSize:'0.88rem', color:'var(--brand)' }}>{admin.username}</div>
        </div>
        <Link to="/admin/dashboard" onClick={onClose}
          style={{ display:'flex', alignItems:'center', gap:9, padding:'11px 15px', fontSize:'0.85rem', color:'var(--text-primary)', transition:'background .15s' }}
          onMouseEnter={e=>e.currentTarget.style.background='var(--surface)'}
          onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
          <FiSettings size={13}/> Admin Dashboard
        </Link>
        <button onClick={()=>{ logout(); navigate('/'); onClose(); }}
          style={{ display:'flex', alignItems:'center', gap:9, padding:'11px 15px', fontSize:'0.85rem', color:'#DC2626', width:'100%', borderTop:'1px solid var(--border)', background:'none', cursor:'pointer', transition:'background .15s' }}
          onMouseEnter={e=>e.currentTarget.style.background='#FEF2F2'}
          onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
          <FiLogOut size={13}/> Logout
        </button>
      </>
    ) : (
      <Link to="/admin/login" onClick={onClose}
        style={{ display:'flex', alignItems:'center', gap:9, padding:'13px 15px', fontSize:'0.85rem', color:'var(--text-primary)', transition:'background .15s' }}
        onMouseEnter={e=>e.currentTarget.style.background='var(--surface)'}
        onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
        <FiUser size={13}/> Admin Login
      </Link>
    )}
  </motion.div>
);

const DLink = ({ to, label, hoverBg, hoverColor }) => (
  <Link to={to}
    style={{ padding:'7px 11px', borderRadius:8, fontSize:'0.84rem', fontWeight:500, color:'var(--text-secondary)', transition:'all .2s', whiteSpace:'nowrap' }}
    onMouseEnter={e=>{ e.currentTarget.style.background=hoverBg||'var(--surface)'; e.currentTarget.style.color=hoverColor||'var(--brand)'; }}
    onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text-secondary)'; }}>
    {label}
  </Link>
);