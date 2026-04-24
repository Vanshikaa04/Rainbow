import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getLatestProducts } from '../utils/api';
import ProductCard from './ProductCard';

const LatestCollection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getLatestProducts()
      .then(r => setProducts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section style={{ padding: 'var(--section-py) 0' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}
        >
          <div>
            <div className="section-accent">
              <div className="section-accent-bar" style={{ background: 'linear-gradient(135deg, #5C6BC0, #EC407A)' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#5C6BC0' }}>Just arrived</span>
            </div>
            <h2 className="section-title">✨ What's New in Rainbow</h2>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>The latest additions to our collection</p>
          </div>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 10, border: '1.5px solid #5C6BC0', color: '#5C6BC0', fontWeight: 600, fontSize: '0.88rem', background: 'white', flexShrink: 0 }}>
            Explore All <FiArrowRight size={14} />
          </motion.button>
        </motion.div>

        {loading ? (
          <div className="product-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <div className="skeleton" style={{ height: 220 }} />
                <div style={{ padding: 18 }}>
                  <div className="skeleton" style={{ height: 18, width: '75%', marginBottom: 10 }} />
                  <div className="skeleton" style={{ height: 13, marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 42, borderRadius: 11, marginTop: 12 }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="product-grid">
            {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestCollection;