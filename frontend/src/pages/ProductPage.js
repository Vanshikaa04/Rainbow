import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiMessageCircle, FiChevronLeft, FiCheck, FiPackage } from 'react-icons/fi';
import { getProduct } from '../utils/api';
import { buildWhatsAppLink, formatPrice, categoryMeta } from '../utils/helpers';
import RecommendedProducts from '../components/RecommendedProducts';
import BrowseOtherCategories from '../components/BrowseOtherCategories';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);
    setActiveImg(0);
    getProduct(id)
      .then(r => setProduct(r.data))
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ paddingTop: 90 }}>
      <div className="container" style={{ paddingTop: 32 }}>
        <div className="two-col" style={{ marginTop: 20 }}>
          <div>
            <div className="skeleton" style={{ height: 'clamp(280px,45vw,460px)', borderRadius: 20, marginBottom: 14 }} />
            <div style={{ display: 'flex', gap: 10 }}>
              {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ width: 76, height: 76, borderRadius: 11 }} />)}
            </div>
          </div>
          <div style={{ paddingTop: 12 }}>
            <div className="skeleton" style={{ height: 14, width: 90, marginBottom: 18, borderRadius: 99 }} />
            <div className="skeleton" style={{ height: 38, marginBottom: 12 }} />
            <div className="skeleton" style={{ height: 60, marginBottom: 24 }} />
            <div className="skeleton" style={{ height: 56, borderRadius: 13 }} />
          </div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ paddingTop: 120, textAlign: 'center', padding: '120px 20px' }}>
      <FiPackage size={48} style={{ margin: '0 auto 16px', opacity: .4, display: 'block' }} />
      <h2 style={{ fontFamily: 'Playfair Display,serif', marginBottom: 8 }}>Product Not Found</h2>
      <Link to="/" style={{ color: 'var(--accent)', fontWeight: 600 }}>← Back to Home</Link>
    </div>
  );

  if (!product) return null;

  const meta = categoryMeta[product.category] || categoryMeta.general;
  const images = product.images?.length > 0
    ? product.images.map(img => img.url)
    : [`https://placehold.co/600x600/F5F3EF/A09890?text=${encodeURIComponent(product.name.slice(0,3))}`];

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .4 }}
      style={{ paddingTop: 90 }}>
      <div className="container" style={{ paddingTop: 28, paddingBottom: 48 }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28, fontSize: '0.85rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)', fontWeight: 500 }}>
            <FiChevronLeft size={13} /> Home
          </Link>
          <span>/</span>
          <Link to={`/?category=${product.category}`} style={{ color: meta.color, fontWeight: 500 }}>{meta.label}</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</span>
        </div>

        {/* Main grid */}
        <div className="two-col">
          {/* Images */}
          <div>
            <div style={{ borderRadius: 20, overflow: 'hidden', background: 'var(--surface)', marginBottom: 14, position: 'relative' }}>
              <AnimatePresence mode="wait">
                <motion.img key={activeImg} src={images[activeImg]} alt={product.name}
                  style={{ width: '100%', height: 'clamp(260px,40vw,460px)', objectFit: 'cover', display: 'block' }}
                  initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: .3 }}
                  onError={e => { e.target.src = 'https://placehold.co/600x600/F5F3EF/888?text=Image'; }} />
              </AnimatePresence>

              {/* Badges */}
              <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                <span className={`badge cat-${product.category}`}>{meta.icon} {meta.label}</span>
                {discount && <span className="badge" style={{ background: '#FF6B35', color: '#fff' }}>-{discount}% OFF</span>}
                {!product.inStock && <span className="badge" style={{ background: '#555', color: '#fff' }}>Out of Stock</span>}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {images.map((img, i) => (
                  <motion.button key={i} onClick={() => setActiveImg(i)}
                    whileHover={{ scale: 1.06 }} whileTap={{ scale: .96 }}
                    style={{ width: 72, height: 72, borderRadius: 11, overflow: 'hidden', padding: 0, border: `2.5px solid ${i === activeImg ? meta.color : 'var(--border)'}`, boxShadow: i === activeImg ? `0 0 0 3px ${meta.color}22` : 'none', cursor: 'pointer', background: 'none', transition: 'border-color .2s' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { e.target.src = 'https://placehold.co/72x72'; }} />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .5, delay: .1 }}>
            <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(1.5rem,3.5vw,2.3rem)', fontWeight: 900, marginBottom: 12, lineHeight: 1.2 }}>
              {product.name}
            </h1>

            {/* Stars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
              <div style={{ display: 'flex', gap: 3 }}>
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} size={15}
                    style={{ color: i < Math.floor(product.rating) ? '#F59E0B' : 'var(--border)', fill: i < Math.floor(product.rating) ? '#F59E0B' : 'none' }} />
                ))}
              </div>
              <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{product.rating}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>({product.reviewCount} reviews)</span>
            </div>

            {/* Price box */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24, padding: '18px 20px', background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 900, fontFamily: 'Playfair Display,serif' }}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span style={{ fontSize: '1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{formatPrice(product.originalPrice)}</span>
                  <span style={{ background: '#FF6B35', color: '#fff', padding: '3px 10px', borderRadius: 99, fontSize: '0.78rem', fontWeight: 700 }}>
                    Save {formatPrice(product.originalPrice - product.price)}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 24, fontSize: '0.95rem' }}>
              {product.description}
            </p>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 24 }}>
                {product.tags.map(t => (
                  <span key={t} style={{ background: meta.bg, color: meta.color, padding: '5px 13px', borderRadius: 99, fontSize: '0.78rem', fontWeight: 600 }}>
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Feature bullets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 28 }}>
              {['Quality Assured', 'Instant WhatsApp Response', 'Secure Enquiry'].map((f, i) => (
                <motion.div key={f} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .3 + i * .1 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--whatsapp)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FiCheck size={11} color="white" />
                  </div>
                  {f}
                </motion.div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <motion.a
              href={product.inStock ? buildWhatsAppLink(product.whatsappNumber, product.name, product.price) : undefined}
              target="_blank" rel="noopener noreferrer"
              className="whatsapp-btn"
              whileHover={product.inStock ? { scale: 1.02, y: -2 } : {}}
              whileTap={product.inStock ? { scale: .98 } : {}}
              style={{ display: 'flex', width: '100%', justifyContent: 'center', padding: '15px 24px', fontSize: '1rem', borderRadius: 14, marginBottom: 12, opacity: product.inStock ? 1 : .5, pointerEvents: product.inStock ? 'auto' : 'none' }}>
              <FiMessageCircle size={20} />
              {product.inStock ? 'Enquire on WhatsApp' : 'Currently Out of Stock'}
            </motion.a>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              💬 Opens WhatsApp with product details pre-filled
            </p>
          </motion.div>
        </div>

        {/* Recommended — same category */}
        <RecommendedProducts productId={id} category={product.category} />

        {/* Browse other categories */}
        <BrowseOtherCategories productId={id} currentCategory={product.category} />
      </div>
    </motion.div>
  );
};

export default ProductPage;