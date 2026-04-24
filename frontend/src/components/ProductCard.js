import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiMessageCircle } from 'react-icons/fi';
import { buildWhatsAppLink, formatPrice, categoryMeta } from '../utils/helpers';

const ProductCard = ({ product, index = 0, compact = false }) => {
  const meta = categoryMeta[product.category] || categoryMeta.general;
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null;

  const imgSrc = product.images?.[0]?.url ||
    `https://placehold.co/400x400/F5F3EF/A09890?text=${encodeURIComponent(product.name.slice(0, 2))}`;

  const imgHeight = compact ? 160 : 220;

  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.36) }}
    >
      {/* Image */}
      <Link to={`/product/${product._id}`} style={{ position: 'relative', overflow: 'hidden', display: 'block' }}>
        <motion.img
          src={imgSrc}
          alt={product.name}
          style={{ width: '100%', height: imgHeight, objectFit: 'cover', display: 'block' }}
          whileHover={{ scale: 1.07 }}
          transition={{ duration: 0.4 }}
          onError={e => { e.target.src = `https://placehold.co/400x400/F5F3EF/888?text=${encodeURIComponent(product.name.slice(0,2))}`; }}
        />
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          <span className={`badge cat-${product.category}`}>{meta.icon} {meta.label}</span>
          {discount && <span className="badge" style={{ background: '#FF6B35', color: '#fff' }}>-{discount}%</span>}
          {product.featured && <span className="badge" style={{ background: '#C9A84C', color: '#fff' }}>⭐</span>}
        </div>
        {!product.inStock && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(250,250,248,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Out of Stock</span>
          </div>
        )}
      </Link>

      {/* Body */}
      <div style={{ padding: compact ? '14px 16px 16px' : '18px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Link to={`/product/${product._id}`}>
          <h3 style={{ fontSize: compact ? '0.88rem' : '0.97rem', fontWeight: 600, marginBottom: 5, fontFamily: 'Playfair Display, serif', lineHeight: 1.3,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.name}
          </h3>
        </Link>

        {!compact && (
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 10, flex: 1,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.description}
          </p>
        )}

        {/* Stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 10 }}>
          {[...Array(5)].map((_, i) => (
            <FiStar key={i} size={11}
              style={{ color: i < Math.floor(product.rating) ? '#F59E0B' : 'var(--border)',
                fill: i < Math.floor(product.rating) ? '#F59E0B' : 'none' }} />
          ))}
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginLeft: 3 }}>({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 13 }}>
          <span style={{ fontSize: compact ? '1rem' : '1.15rem', fontWeight: 700 }}>{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        {/* WhatsApp */}
        <a href={product.inStock ? buildWhatsAppLink(product.whatsappNumber, product.name, product.price) : '#'}
          target="_blank" rel="noopener noreferrer"
          className="whatsapp-btn"
          style={{ width: '100%', justifyContent: 'center', padding: compact ? '10px 14px' : '11px 18px', fontSize: '0.85rem', borderRadius: 11, pointerEvents: product.inStock ? 'auto' : 'none', opacity: product.inStock ? 1 : 0.5 }}>
          <FiMessageCircle size={15} />
          {compact ? 'WhatsApp' : 'Enquire on WhatsApp'}
        </a>
      </div>
    </motion.div>
  );
};

export default ProductCard;