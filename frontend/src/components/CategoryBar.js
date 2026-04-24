import React from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categoryMeta } from '../utils/helpers';

export default function CategoryBar() {
  const { catKey } = useParams();
  const [params] = useSearchParams();
  const active = catKey || params.get('category') || 'all';

  const categories = [
    { id:'all', label:'All', color:'#2E7D32', bg:'#E8F5E9' },
    ...Object.entries(categoryMeta).map(([id, m]) => ({ id, label:m.label, color:m.color, bg:m.bg })),
  ];

  return (
    <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center' }}>
      {categories.map((cat, i) => {
        const isActive = active === cat.id;
        const to = cat.id === 'all' ? '/' : `/category/${cat.id}`;
        return (
          <motion.div key={cat.id}
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:i*0.06, duration:.35 }}
            whileHover={{ y:-3, scale:1.04 }} whileTap={{ scale:.96 }}>
            <Link to={to} style={{
              display:'flex', alignItems:'center', gap:7,
              padding:'9px 20px', borderRadius:50,
              border:`2px solid ${isActive ? cat.color : 'var(--border)'}`,
              background: isActive ? cat.bg : 'white',
              color: isActive ? cat.color : 'var(--text-secondary)',
              fontWeight: isActive ? 700 : 500,
              fontSize:'clamp(0.76rem,1.8vw,0.88rem)',
              // boxShadow: isActive ? `0 4px 14px ${cat.color}30` : 'var(--shadow-sm)',
              transition:'all .2s',
              textDecoration:'none',
            }}>
              {cat.label}
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}