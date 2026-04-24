import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { getBrowseOthers } from '../utils/api';
import { categoryMeta } from '../utils/helpers';
import ProductCard from './ProductCard';

const CategoryRow = ({ catKey, products, index }) => {
  const meta = categoryMeta[catKey] || categoryMeta.general;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{ marginBottom: 52 }}
    >
      {/* Row header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 20, flexWrap: 'wrap', gap: 10,
        padding: '14px 20px', borderRadius: 16,
        background: meta.bg, border: `1px solid ${meta.color}22`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '2rem' }}>{meta.icon}</span>
          <div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: meta.color, fontWeight: 700 }}>
              {meta.label}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 2 }}>{meta.description}</p>
          </div>
        </div>
        <Link to={`/?category=${catKey}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600, color: meta.color, background: 'white', padding: '8px 16px', borderRadius: 99, border: `1px solid ${meta.color}44`, transition: 'all .2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = meta.color; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = meta.color; }}
        >
          See all <FiArrowRight size={13} />
        </Link>
      </div>

      {/* Products — 3 per row */}
      <div className="three-col">
        {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} compact />)}
      </div>
    </motion.div>
  );
};

const BrowseOtherCategories = ({ productId, currentCategory }) => {
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    getBrowseOthers(productId)
      .then(r => setGrouped(r.data))
      .catch(() => setGrouped({}))
      .finally(() => setLoading(false));
  }, [productId]);

  const cats = Object.keys(grouped).filter(k => grouped[k]?.length > 0);
  if (!loading && cats.length === 0) return null;

  return (
    <section style={{ marginTop: 72, paddingTop: 56, borderTop: '1px solid var(--border)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.5 }}
        style={{ marginBottom: 40 }}
      >
        <div className="section-accent">
          <div className="section-accent-bar" style={{ background: 'linear-gradient(135deg, #5C6BC0, #00897B)' }} />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#5C6BC0' }}>
            Browse More
          </span>
        </div>
        <h2 className="section-title">Browse Other Categories</h2>
        <p className="section-subtitle" style={{ marginBottom: 0 }}>
          Explore our full Rainbow collection
        </p>
      </motion.div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {[...Array(3)].map((_, ri) => (
            <div key={ri}>
              <div className="skeleton" style={{ height: 68, borderRadius: 16, marginBottom: 20 }} />
              <div className="three-col">
                {[...Array(3)].map((_, i) => (
                  <div key={i} style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <div className="skeleton" style={{ height: 160 }} />
                    <div style={{ padding: 14 }}>
                      <div className="skeleton" style={{ height: 14, width: '75%', marginBottom: 8 }} />
                      <div className="skeleton" style={{ height: 38, borderRadius: 10, marginTop: 10 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        cats.map((catKey, i) => (
          <CategoryRow key={catKey} catKey={catKey} products={grouped[catKey]} index={i} />
        ))
      )}
    </section>
  );
};

export default BrowseOtherCategories;