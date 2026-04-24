import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { FiArrowRight, FiPackage, FiSearch } from 'react-icons/fi';
import { getProducts } from '../utils/api';
import { categoryMeta } from '../utils/helpers';
import ProductCard from '../components/ProductCard';
import CategoryBar from '../components/CategoryBar';
import FeaturedProducts from '../components/FeaturedProducts';
import LatestCollection from '../components/LatestCollection';

/* ── Animated section wrapper ─────────────────────────────────── */
export const FadeUp = ({ children, delay = 0, style = {} }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} style={style}
      initial={{ opacity:0, y:40 }} animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration:.6, delay, ease:[.4,0,.2,1] }}>
      {children}
    </motion.div>
  );
};

/* ── Floating orb ─────────────────────────────────────────────── */
const Orb = ({ color, size, top, left, right, bottom, delay=0 }) => (
  <motion.div style={{
    position:'absolute', top, left, right, bottom,
    width:size, height:size, borderRadius:'50%',
    background:color, filter:'blur(70px)', pointerEvents:'none', zIndex:0,
  }}
    animate={{ scale:[1,1.15,0.95,1], opacity:[0.6,1,0.7,0.6] }}
    transition={{ duration:8+delay, repeat:Infinity, ease:'easeInOut', delay }}/>
);

/* ── Rainbow stripe ───────────────────────────────────────────── */
const RainbowStripe = () => (
  <div style={{ height:5, background:'linear-gradient(90deg,#E53935,#F4511E,#F9A825,#2E7D32,#1E88E5,#3949AB,#6A1B9A)', borderRadius:3 }}/>
);

/* ── Hero section ─────────────────────────────────────────────── */
const Hero = ({ onCategoryClick }) => {
  const cats = Object.entries(categoryMeta);

  return (
    <section style={{ minHeight:'95vh', display:'flex', alignItems:'center', position:'relative', overflow:'hidden', paddingTop:90, paddingBottom:60 }}>
      {/* Animated gradient background */}
      <motion.div style={{ position:'absolute', inset:0, zIndex:0 }}
        animate={{ background:[
          'linear-gradient(135deg,#fff7ed 0%,#fce7f3 30%,#eff6ff 60%,#ecfdf5 100%)',
          'linear-gradient(135deg,#eff6ff 0%,#ecfdf5 30%,#fff7ed 60%,#fce7f3 100%)',
          'linear-gradient(135deg,#ecfdf5 0%,#fff7ed 30%,#fce7f3 60%,#eff6ff 100%)',
          'linear-gradient(135deg,#fce7f3 0%,#eff6ff 30%,#ecfdf5 60%,#fff7ed 100%)',
        ]}}
        transition={{ duration:12, repeat:Infinity, ease:'linear' }}/>

      {/* Floating color orbs matching category colors */}
      <Orb color="rgba(245,158,11,0.22)" size={380} top="-5%" right="5%"  delay={0}/>
      <Orb color="rgba(244,63,94,0.18)"  size={300} bottom="5%" left="2%" delay={2}/>
      <Orb color="rgba(59,130,246,0.18)" size={260} top="40%" right="2%"  delay={4}/>
      <Orb color="rgba(16,185,129,0.18)" size={220} bottom="10%" right="25%" delay={6}/>

      <div className="container" style={{ position:'relative', zIndex:1, width:'100%' }}>
        <div className="two-col">
          {/* ── Left ── */}
          <div>
            {/* Badge */}
            <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.6, delay:.1 }}
              style={{ display:'inline-flex', alignItems:'center', gap:8, background:'white', border:'1.5px solid var(--border)', borderRadius:99, padding:'7px 18px', fontSize:'0.78rem', fontWeight:700, color:'var(--brand)', marginBottom:24, boxShadow:'var(--shadow-md)', letterSpacing:'.03em' }}>
              {/* <span style={{ width:8, height:8, borderRadius:'50%', background:'var(--grad-rainbow)', display:'inline-block' }}/> */}
              Rainbow Marketing 
            </motion.div>

            {/* Headline */}
            <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:.7, delay:.2 }}
              style={{ fontSize:'clamp(2.2rem,5.5vw,4.2rem)', fontWeight:900, lineHeight:1.07, marginBottom:20, color:'var(--text-primary)' }}>
              One Brand,
              <br/>
              <motion.span
                style={{ background:'linear-gradient(90deg,#E53935,#F4511E,#F9A825,#2E7D32,#1E88E5,#6A1B9A)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', backgroundSize:'200%' }}
                animate={{ backgroundPosition:['0% 50%','100% 50%','0% 50%'] }}
                transition={{ duration:6, repeat:Infinity }}>
                Endless Quality
              </motion.span>
            </motion.h1>

            {/* Punchline */}
            <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.6, delay:.35 }}
              style={{ fontSize:'clamp(1rem,2.2vw,1.2rem)', fontWeight:600, color:'var(--brand)', fontStyle:'italic', marginBottom:12, fontFamily:'Playfair Display,serif' }}>
              "Bringing Every Essential Under One Spectrum."
            </motion.p>

            <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.6, delay:.45 }}
              style={{ fontSize:'clamp(0.9rem,2vw,1.05rem)', color:'var(--text-secondary)', lineHeight:1.8, marginBottom:32, maxWidth:440 }}>
              Four curated collections — Clove, I-Fresh, CuteBaby, General — each crafted for quality. Connect with us instantly via WhatsApp.
            </motion.p>

            {/* CTAs */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.6, delay:.55 }}
              style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <motion.a href="#products" whileHover={{ scale:1.04, y:-2 }} whileTap={{ scale:.97 }}
                style={{ display:'inline-flex', alignItems:'center', gap:8, background:'var(--brand)', color:'white', padding:'13px 28px', borderRadius:13, fontWeight:700, fontSize:'0.97rem', boxShadow:'0 8px 24px rgba(46,125,50,.38)', textDecoration:'none' }}>
                Shop Now <FiArrowRight/>
              </motion.a>
              <motion.a href="#categories" whileHover={{ scale:1.04, y:-2 }} whileTap={{ scale:.97 }}
                style={{ display:'inline-flex', alignItems:'center', gap:8, background:'white', color:'var(--brand)', padding:'13px 28px', borderRadius:13, fontWeight:700, fontSize:'0.97rem', border:'2px solid var(--brand)', textDecoration:'none' }}>
                Browse Collections
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.6, delay:.7 }}
              style={{ display:'flex', gap:'clamp(20px,4vw,40px)', flexWrap:'wrap', marginTop:44 }}>
              {[{n:'4',l:'Collections',c:'#E53935'},{n:'100+',l:'Products',c:'#F9A825'},{n:'24/7',l:'WhatsApp',c:'#2E7D32'}].map(s => (
                <div key={s.l}>
                  <div style={{ fontSize:'clamp(1.4rem,3vw,1.9rem)', fontWeight:900, fontFamily:'Playfair Display,serif', color:s.c }}>{s.n}</div>
                  <div style={{ fontSize:'0.77rem', color:'var(--text-secondary)', fontWeight:500 }}>{s.l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: category cards ── */}
          <motion.div initial={{ opacity:0, scale:.92, x:40 }} animate={{ opacity:1, scale:1, x:0 }} transition={{ duration:.8, delay:.3 }}
            style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {cats.map(([key, m], i) => (
              <motion.div key={key}
                whileHover={{ y:-10, scale:1.04, boxShadow:`0 20px 50px ${m.glowColor}` }}
                whileTap={{ scale:.96 }}
                initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:.4+i*.12, type:'spring', stiffness:280 }}
                onClick={()=>onCategoryClick(key)}
                style={{ background:m.cardBg, borderRadius:22, padding:'clamp(16px,3vw,24px) clamp(14px,2.5vw,20px)', cursor:'pointer', textAlign:'center', border:`1.5px solid ${m.color}30`, boxShadow:`0 4px 20px ${m.glowColor}`, transition:'box-shadow .3s', position:'relative', overflow:'hidden' }}>
                {/* Animated glow blob inside card */}
                <motion.div style={{ position:'absolute', top:-30, right:-30, width:100, height:100, borderRadius:'50%', background:m.glowColor, filter:'blur(30px)' }}
                  animate={{ scale:[1,1.4,1] }} transition={{ duration:4+i, repeat:Infinity }}/>

                <div style={{ position:'relative', zIndex:1 }}>
                  {/* Category logo or fallback initial */}
                  <motion.div animate={{ y:[0,-6,0] }} transition={{ duration:3+i*.4, repeat:Infinity }}
                    style={{ width:100, height:100, borderRadius:14,  display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px',  overflow:'hidden' }}>
                    <img src={`/${key}-logo.png`} alt={m.label} style={{ width:'100%', height:'100%', objectFit:'contain', padding:6 }}
                      onError={e=>{ e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}/>
                    <div style={{ display:'none', width:'100%', height:'100%', alignItems:'center', justifyContent:'center', fontFamily:'Playfair Display,serif', fontWeight:800, fontSize:'1.4rem', color:m.color }}>{m.label.charAt(0)}</div>
                  </motion.div>

                  <div style={{ fontFamily:'Playfair Display,serif', fontWeight:700, fontSize:'clamp(0.9rem,2vw,1rem)', color:m.color, marginBottom:3 }}>{m.label}</div>
                  <div style={{ fontSize:'0.72rem', color:m.color, opacity:.75, marginBottom:10 }}>{m.description}</div>
                  <div style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:'0.75rem', fontWeight:700, color:'white', background:m.color, padding:'5px 12px', borderRadius:99 }}>
                    Browse <FiArrowRight size={11}/>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ── Category Showcase (home, below products) ──────────────────── */
const CategoryShowcase = ({ onCategoryClick }) => (
  <section id="categories" style={{ padding:'var(--section-py) 0', position:'relative', overflow:'hidden' }}>
    {/* Animated soft bg */}
    <motion.div style={{ position:'absolute', inset:0, zIndex:0 }}
      animate={{ background:['linear-gradient(135deg,#fff7ed,#fce7f3,#eff6ff,#ecfdf5)','linear-gradient(135deg,#ecfdf5,#eff6ff,#fce7f3,#fff7ed)'] }}
      transition={{ duration:10, repeat:Infinity, ease:'linear' }}/>

    <div className="container" style={{ position:'relative', zIndex:1 }}>
      <FadeUp style={{ textAlign:'center', marginBottom:48 }}>
        <h2 className="section-title">Shop by Collection</h2>
        <p className="section-subtitle">Four curated ranges for every need</p>
      </FadeUp>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'var(--card-gap)' }}>
        {Object.entries(categoryMeta).map(([key, m], i) => (
          <FadeUp key={key} delay={i*0.12}>
            <Link to={`/category/${key}`} style={{ textDecoration:'none', display:'block' }}>
              <motion.div
                whileHover={{ y:-12, scale:1.03 }}
                whileTap={{ scale:.97 }}
                style={{ borderRadius:24, padding:'clamp(24px,4vw,36px) clamp(18px,3vw,26px)', textAlign:'center', background:m.cardBg, border:`2px solid ${m.color}25`, boxShadow:`0 6px 30px ${m.glowColor}`, position:'relative', overflow:'hidden', cursor:'pointer', transition:'box-shadow .3s' }}
                onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 24px 60px ${m.glowColor}`}
                onMouseLeave={e=>e.currentTarget.style.boxShadow=`0 6px 30px ${m.glowColor}`}>
                {/* Animated bg blobs */}
                <motion.div style={{ position:'absolute', top:-20, right:-20, width:90, height:90, borderRadius:'50%', background:m.color, opacity:.12, pointerEvents:'none' }}
                  animate={{ scale:[1,1.5,1] }} transition={{ duration:4+i, repeat:Infinity }}/>
                <motion.div style={{ position:'absolute', bottom:-15, left:-15, width:70, height:70, borderRadius:'50%', background:m.gradFrom, opacity:.1, pointerEvents:'none' }}
                  animate={{ scale:[1,1.3,1] }} transition={{ duration:5+i, repeat:Infinity, delay:1 }}/>

                <div style={{ position:'relative', zIndex:1 }}>
                  <motion.div animate={{ rotate:[0,-5,5,0] }} transition={{ duration:5+i, repeat:Infinity }}
                    style={{ width:80, height:80, borderRadius:16, background:'white', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:`0 6px 20px ${m.glowColor}`, overflow:'hidden' }}>
                    <img src={`/${key}-logo.png`} alt={m.label} style={{ width:'100%', height:'100%', objectFit:'contain', padding:8 }}
                      onError={e=>{ e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}/>
                    <div style={{ display:'none', width:'100%', height:'100%', alignItems:'center', justifyContent:'center', fontFamily:'Playfair Display,serif', fontWeight:800, fontSize:'1.6rem', color:m.color }}>{m.label.charAt(0)}</div>
                  </motion.div>

                  <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(1.05rem,2.5vw,1.25rem)', fontWeight:800, marginBottom:6, color:m.color }}>{m.label}</h3>
                  <p style={{ fontSize:'0.83rem', color:m.color, opacity:.8, marginBottom:6 }}>{m.tagline}</p>
                  <p style={{ fontSize:'0.8rem', color:'var(--text-secondary)', marginBottom:18, lineHeight:1.5 }}>{m.description}</p>

                  <motion.span whileHover={{ gap:'10px' }}
                    style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:'0.83rem', fontWeight:700, color:'white', background:`linear-gradient(135deg,${m.gradFrom},${m.gradTo})`, padding:'8px 18px', borderRadius:99, boxShadow:`0 4px 14px ${m.glowColor}`, transition:'gap .2s' }}>
                    Explore {m.label} <FiArrowRight size={13}/>
                  </motion.span>
                </div>
              </motion.div>
            </Link>
          </FadeUp>
        ))}
      </div>
    </div>
  </section>
);

/* ── Products section ─────────────────────────────────────────── */
const ProductsSection = ({ category, search }) => {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [total,    setTotal]    = useState(0);
  const pollRef = useRef(null);
  const meta = category ? categoryMeta[category] : null;

  const fetchProducts = useCallback(async (silent=false) => {
    if (!silent) setLoading(true);
    try {
      const r = await getProducts({ category:category||undefined, search:search||undefined, limit:40 });
      setProducts(r.data.products);
      setTotal(r.data.total);
    } catch {}
    finally { if (!silent) setLoading(false); }
  }, [category, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    const start = () => { pollRef.current = setInterval(()=>fetchProducts(true), 20000); };
    const stop  = () => clearInterval(pollRef.current);
    const vis   = () => { document.hidden ? stop() : start(); };
    start();
    document.addEventListener('visibilitychange', vis);
    return () => { stop(); document.removeEventListener('visibilitychange', vis); };
  }, [fetchProducts]);

  return (
    <>
      <FadeUp style={{ textAlign:'center', marginBottom:36 }}>
        {search ? (
          <>
            <h2 className="section-title">Search Results</h2>
            <p className="section-subtitle">"{search}" — {total} found</p>
          </>
        ) : meta ? (
          <>
            <h2 className="section-title" style={{ color:meta.color }}>{meta.label} Collection</h2>
            <p className="section-subtitle">{total} products</p>
          </>
        ) : (
          <>
            <h2 className="section-title">All Products</h2>
            <p className="section-subtitle">{total} items available</p>
          </>
        )}
      </FadeUp>

      <FadeUp delay={.1} style={{ marginBottom:40 }}>
        <CategoryBar/>
      </FadeUp>

      {loading ? (
        <div className="product-grid">
          {[...Array(8)].map((_,i) => (
            <div key={i} style={{ borderRadius:18, overflow:'hidden', border:'1px solid var(--border)' }}>
              <div className="skeleton" style={{ height:220 }}/>
              <div style={{ padding:18 }}>
                <div className="skeleton" style={{ height:17, width:'76%', marginBottom:10 }}/>
                <div className="skeleton" style={{ height:42, borderRadius:11, marginTop:12 }}/>
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
          style={{ textAlign:'center', padding:'80px 20px', color:'var(--text-muted)' }}>
          <FiPackage size={44} style={{ opacity:.3, display:'block', margin:'0 auto 14px' }}/>
          <h3 style={{ fontFamily:'Playfair Display,serif', marginBottom:8, color:'var(--text-primary)' }}>No products found</h3>
          <p>Try a different category or search term</p>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={`${category}-${search}`}
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            transition={{ duration:.4 }} className="product-grid">
            {products.map((p,i) => <ProductCard key={p._id} product={p} index={i}/>)}
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};

/* ── Page ─────────────────────────────────────────────────────── */
export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get('category');
  const search   = searchParams.get('search');

  const handleCategoryClick = key => {
    navigate(`/category/${key}`);
  };

  const isFiltered = !!(category || search);

  return (
    <div>
      {!isFiltered && <Hero onCategoryClick={handleCategoryClick}/>}
      {!isFiltered && <RainbowStripe/>}
      {!isFiltered && <FeaturedProducts/>}

      <section id="products" style={{ padding:'var(--section-py) 0' }}>
        <div className="container">
          <ProductsSection category={category} search={search}/>
        </div>
      </section>

      {!isFiltered && <RainbowStripe/>}
      {!isFiltered && <CategoryShowcase onCategoryClick={handleCategoryClick}/>}
      {!isFiltered && <LatestCollection/>}
    </div>
  );
} 