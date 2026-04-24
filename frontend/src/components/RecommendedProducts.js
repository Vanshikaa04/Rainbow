import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getRecommended } from '../utils/api';
import { categoryMeta } from '../utils/helpers';
import ProductCard from './ProductCard';

const RecommendedProducts = ({ productId, category }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const meta = categoryMeta[category] || categoryMeta.general;

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    getRecommended(productId)
      .then(r => setProducts(r.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [productId]);

  if (!loading && products.length === 0) return null;

  return (
    <section style={{ marginTop: 64 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.5 }}
        style={{ marginBottom: 32 }}
      >
        <div className="section-accent">
          <div className="section-accent-bar" style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}99)` }} />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: meta.color }}>
            {meta.icon} {meta.label} collection
          </span>
        </div>
        <h2 className="section-title">You May Also Like</h2>
        <p className="section-subtitle" style={{ marginBottom: 0 }}>
          More from the {meta.label} range
        </p>
      </motion.div>

      {loading ? (
        <div className="product-grid">
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)' }}>
              <div className="skeleton" style={{ height: 200 }} />
              <div style={{ padding: 16 }}>
                <div className="skeleton" style={{ height: 16, width: '80%', marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 12, marginBottom: 6 }} />
                <div className="skeleton" style={{ height: 40, borderRadius: 11, marginTop: 12 }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="product-grid">
          {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
        </div>
      )}
    </section>
  );
};

export default RecommendedProducts;