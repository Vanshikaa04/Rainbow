import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiPackage, FiChevronLeft } from 'react-icons/fi';
import { getProductsByCategory } from '../utils/api';
import { categoryMeta } from '../utils/helpers';
import ProductCard from '../components/ProductCard';

/* ── Animated orb ─────────────────────────────────────────────── */
const Orb = ({ color, size, style }) => (
  <motion.div style={{ position:'absolute', width:size, height:size, borderRadius:'50%', background:color, filter:'blur(65px)', pointerEvents:'none', ...style }}
    animate={{ scale:[1,1.2,0.9,1], opacity:[0.5,0.9,0.6,0.5] }}
    transition={{ duration:10, repeat:Infinity, ease:'easeInOut' }}/>
);

/* ── Feature item with stagger animation ──────────────────────── */
const FeatureItem = ({ icon, text, index, color, bg }) => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once:true, margin:'-40px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity:0, x:-40 }}
      animate={inView ? { opacity:1, x:0 } : {}}
      transition={{ duration:.5, delay:index*0.1, ease:[.4,0,.2,1] }}
      whileHover={{ x:8, scale:1.02 }}
      style={{ display:'flex', alignItems:'center', gap:16, padding:'16px 20px', background:bg, borderRadius:16, border:`1.5px solid ${color}20`, boxShadow:`0 2px 12px ${color}15`, cursor:'default', transition:'box-shadow .2s', marginBottom:10 }}
      onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 6px 24px ${color}30`}
      onMouseLeave={e=>e.currentTarget.style.boxShadow=`0 2px 12px ${color}15`}>
      <motion.div
        animate={{ rotate:[0,-8,8,0], scale:[1,1.15,1] }}
        transition={{ duration:3+index*.3, repeat:Infinity }}
        style={{ fontSize:'1.8rem', flexShrink:0, width:44, height:44, borderRadius:12, background:'white', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 2px 10px ${color}25` }}>
        {icon}
      </motion.div>
      <span style={{ fontSize:'clamp(0.88rem,2vw,0.97rem)', fontWeight:500, color:'var(--text-primary)', lineHeight:1.4 }}>{text}</span>
      <motion.div style={{ marginLeft:'auto', color, opacity:.5, flexShrink:0 }}
        animate={{ x:[0,4,0] }} transition={{ duration:2, repeat:Infinity, delay:index*.2 }}>
        <FiArrowRight size={14}/>
      </motion.div>
    </motion.div>
  );
};

/* ── ProductCard skeleton ─────────────────────────────────────── */
const Skeleton = () => (
  <div style={{ borderRadius:18, overflow:'hidden', border:'1px solid var(--border)' }}>
    <div className="skeleton" style={{ height:220 }}/>
    <div style={{ padding:18 }}>
      <div className="skeleton" style={{ height:17, width:'76%', marginBottom:10 }}/>
      <div className="skeleton" style={{ height:42, borderRadius:11, marginTop:12 }}/>
    </div>
  </div>
);

/* ── Page ─────────────────────────────────────────────────────── */
export default function CategoryPage() {
  const { catKey } = useParams();
  const meta = categoryMeta[catKey];
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const pollRef = useRef(null);

  const fetchProducts = useCallback(async (silent=false) => {
    if (!silent) setLoading(true);
    try {
      const r = await getProductsByCategory(catKey);
      setProducts(r.data);
    } catch {}
    finally { if (!silent) setLoading(false); }
  }, [catKey]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    const start = () => { pollRef.current = setInterval(()=>fetchProducts(true), 20000); };
    const stop  = () => clearInterval(pollRef.current);
    const vis   = () => { document.hidden?stop():start(); };
    start();
    document.addEventListener('visibilitychange', vis);
    return () => { stop(); document.removeEventListener('visibilitychange', vis); };
  }, [fetchProducts]);

  if (!meta) return (
    <div style={{ paddingTop:120, textAlign:'center', padding:'120px 20px' }}>
      <h2 style={{ fontFamily:'Playfair Display,serif' }}>Category not found</h2>
      <Link to="/" style={{ color:'var(--brand)', fontWeight:600, marginTop:16, display:'inline-block' }}>← Back to Home</Link>
    </div>
  );

  return (
    <div style={{ paddingTop:64 }}>

      {/* ── Hero banner ── */}
      <section style={{ position:'relative', overflow:'hidden', minHeight:'52vh', display:'flex', alignItems:'center', paddingTop:60, paddingBottom:60 }}>
        {/* Animated gradient bg */}
        <motion.div style={{ position:'absolute', inset:0 }}
          animate={{ background:[
            `linear-gradient(135deg,${meta.bg} 0%,white 50%,${meta.bg} 100%)`,
            `linear-gradient(135deg,white 0%,${meta.bg} 50%,white 100%)`,
          ]}}
          transition={{ duration:8, repeat:Infinity, ease:'linear' }}/>

        {/* Orbs */}
        <Orb color={meta.glowColor} size={320} style={{ top:'-10%', right:'5%' }}/>
        <Orb color={meta.glowColor} size={200} style={{ bottom:'-5%', left:'3%' }}/>
        <Orb color={meta.glowColor.replace('0.4','0.2')} size={180} style={{ top:'30%', right:'20%' }}/>

        {/* Animated decorative circles */}
        {[...Array(6)].map((_,i) => (
          <motion.div key={i} style={{ position:'absolute', width:8+i*4, height:8+i*4, borderRadius:'50%', background:meta.color, opacity:.15+i*.04, top:`${15+i*12}%`, right:`${5+i*8}%`, pointerEvents:'none' }}
            animate={{ y:[0,-20,0], x:[0,10,0] }}
            transition={{ duration:4+i, repeat:Infinity, delay:i*.5 }}/>
        ))}

        <div className="container" style={{ position:'relative', zIndex:1, width:'100%' }}>
          {/* Breadcrumb */}
          <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }}
            style={{ display:'flex', alignItems:'center', gap:8, marginBottom:28, fontSize:'0.85rem', color:'var(--text-muted)' }}>
            <Link to="/" style={{ display:'flex', alignItems:'center', gap:4, color:'var(--text-secondary)', fontWeight:500, transition:'color .2s' }}
              onMouseEnter={e=>e.currentTarget.style.color=meta.color}
              onMouseLeave={e=>e.currentTarget.style.color='var(--text-secondary)'}>
              <FiChevronLeft size={14}/> Home
            </Link>
            <span>/</span>
            <span style={{ color:meta.color, fontWeight:600 }}>{meta.label}</span>
          </motion.div>

          <div className="two-col" style={{ alignItems:'center' }}>
            {/* Left: text */}
            <div>
              <motion.div initial={{ opacity:0, scale:.8 }} animate={{ opacity:1, scale:1 }} transition={{ duration:.6, type:'spring', stiffness:200 }}
                style={{ display:'inline-flex', alignItems:'center', gap:8, background:`linear-gradient(135deg,${meta.gradFrom},${meta.gradTo})`, color:'white', borderRadius:99, padding:'6px 16px', fontSize:'0.78rem', fontWeight:700, marginBottom:18, boxShadow:`0 4px 14px ${meta.glowColor}`, letterSpacing:'.04em', textTransform:'uppercase' }}>
                {meta.label} Collection
              </motion.div>

              <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:.7, delay:.1 }}
                style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(2rem,5vw,3.6rem)', fontWeight:900, lineHeight:1.08, marginBottom:14, color:'var(--text-primary)' }}>
                {meta.label}
                <br/>
                <span style={{ color:meta.color }}>{meta.tagline}</span>
              </motion.h1>

              <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.6, delay:.25 }}
                style={{ fontSize:'clamp(0.92rem,2vw,1.05rem)', color:'var(--text-secondary)', lineHeight:1.8, marginBottom:28, maxWidth:480 }}>
                Explore our complete {meta.label} range — crafted with care, tested for quality, and available to order instantly via WhatsApp.
              </motion.p>

              <motion.div initial={{ opacity:0, y:15 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5, delay:.4 }}
                style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                <a href="#products"
                  style={{ display:'inline-flex', alignItems:'center', gap:8, background:`linear-gradient(135deg,${meta.gradFrom},${meta.gradTo})`, color:'white', padding:'12px 26px', borderRadius:13, fontWeight:700, fontSize:'0.95rem', boxShadow:`0 8px 22px ${meta.glowColor}`, textDecoration:'none', transition:'transform .2s, box-shadow .2s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 14px 32px ${meta.glowColor}`; }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow=`0 8px 22px ${meta.glowColor}`; }}>
                  Shop {meta.label} <FiArrowRight/>
                </a>
                <Link to="/"
                  style={{ display:'inline-flex', alignItems:'center', gap:8, background:'white', color:meta.color, padding:'12px 26px', borderRadius:13, fontWeight:700, fontSize:'0.95rem', border:`2px solid ${meta.color}40`, textDecoration:'none' }}>
                  All Collections
                </Link>
              </motion.div>
            </div>

            {/* Right: logo + floating badges */}
            <div style={{ display:'flex', justifyContent:'center', alignItems:'center', position:'relative', minHeight:280 }}>
              <motion.div
                animate={{ y:[0,-12,0] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
                style={{ width:250, height:250, borderRadius:40, background:meta.cardBg, border:`3px solid ${meta.color}30`, boxShadow:`0 24px 60px ${meta.glowColor}`, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', zIndex:2, overflow:'hidden' }}>
                <img src={`/${catKey}-logo.png`} alt={meta.label} style={{ width:'80%', height:'80%', objectFit:'contain' }}
                  onError={e=>{ e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}/>
                <div style={{ display:'none', width:'100%', height:'100%', alignItems:'center', justifyContent:'center', fontFamily:'Playfair Display,serif', fontWeight:900, fontSize:'4rem', color:meta.color }}>{meta.label.charAt(0)}</div>
              </motion.div>

              {/* Floating feature badges around logo */}
              {/* {meta.features.slice(0,4).map((f, i) => {
                const positions = [
                  { top:-30, left:-60 },
                  { top:-30, right:-60 },
                  { bottom:-30, left:-60 },
                  { bottom:-30, right:-60 },
                ];
                return (
                  <motion.div key={i}
                    initial={{ opacity:0, scale:0 }} animate={{ opacity:1, scale:1 }}
                    transition={{ delay:.6+i*.15, type:'spring', stiffness:280 }}
                    animate2={{ y:[0,-6,0] }}
                    style={{ position:'absolute', ...positions[i], background:'white', borderRadius:14, padding:'8px 12px', boxShadow:`0 6px 20px ${meta.glowColor}`, display:'flex', alignItems:'center', gap:7, whiteSpace:'nowrap', border:`1px solid ${meta.color}20`, zIndex:3 }}>
                    <span style={{ fontSize:'1.1rem' }}>{f.icon}</span>
                    <span style={{ fontSize:'0.72rem', fontWeight:600, color:meta.color, maxWidth:90, overflow:'hidden', textOverflow:'ellipsis' }}>{f.text.split('—')[0].trim()}</span>
                  </motion.div>
                );
              })} */}
            </div>
          </div>
        </div>
      </section>

      {/* Rainbow stripe */}
      <div style={{ height:4, background:`linear-gradient(90deg,${meta.gradFrom},${meta.gradTo},${meta.gradFrom})` }}/>

      {/* ── Features section ── */}
      <section style={{ padding:'var(--section-py) 0', background:meta.bg }}>
        <div className="container">
          <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.5 }}
            style={{ textAlign:'center', marginBottom:48 }}>
            <span style={{ display:'inline-block', background:`linear-gradient(135deg,${meta.gradFrom},${meta.gradTo})`, color:'white', borderRadius:99, padding:'5px 16px', fontSize:'0.76rem', fontWeight:700, letterSpacing:'.05em', textTransform:'uppercase', marginBottom:14 }}>
              Why Choose {meta.label}?
            </span>
            <h2 className="section-title">What Makes Us Special</h2>
            <p className="section-subtitle" style={{ marginBottom:0 }}>Every feature designed with you in mind</p>
          </motion.div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:20, maxWidth:900, margin:'0 auto' }}>
            {meta.features.map((f, i) => (
              <FeatureItem key={i} icon={f.icon} text={f.text} index={i} color={meta.color} bg="white"/>
            ))}
          </div>
        </div>
      </section>

      {/* ── Products ── */}
      <section id="products" style={{ padding:'var(--section-py) 0' }}>
        <div className="container">
          <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.5 }}
            style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:36, flexWrap:'wrap', gap:12 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
                <div style={{ width:4, height:32, background:`linear-gradient(135deg,${meta.gradFrom},${meta.gradTo})`, borderRadius:4 }}/>
                <h2 className="section-title" style={{ marginBottom:0 }}>{meta.label} Products</h2>
              </div>
              <p style={{ color:'var(--text-secondary)', fontSize:'0.92rem', marginLeft:16 }}>{products.length} items in this collection</p>
            </div>
            <Link to="/"
              style={{ display:'flex', alignItems:'center', gap:6, fontSize:'0.85rem', fontWeight:600, color:meta.color, background:meta.bg, padding:'9px 18px', borderRadius:99, border:`1px solid ${meta.color}30`, textDecoration:'none', transition:'all .2s' }}
              onMouseEnter={e=>{ e.currentTarget.style.background=meta.color; e.currentTarget.style.color='white'; }}
              onMouseLeave={e=>{ e.currentTarget.style.background=meta.bg; e.currentTarget.style.color=meta.color; }}>
              All Collections <FiArrowRight size={13}/>
            </Link>
          </motion.div>

          {loading ? (
            <div className="product-grid">
              {[...Array(6)].map((_,i) => <Skeleton key={i}/>)}
            </div>
          ) : products.length === 0 ? (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
              style={{ textAlign:'center', padding:'80px 20px', color:'var(--text-muted)' }}>
              <FiPackage size={44} style={{ opacity:.3, display:'block', margin:'0 auto 14px' }}/>
              <h3 style={{ fontFamily:'Playfair Display,serif', marginBottom:8, color:'var(--text-primary)' }}>No products yet</h3>
              <p>Check back soon — new items added regularly!</p>
            </motion.div>
          ) : (
            <AnimatePresence>
              <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }}
                className="product-grid">
                {products.map((p,i) => <ProductCard key={p._id} product={p} index={i}/>)}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section style={{ padding:'56px 0', position:'relative', overflow:'hidden' }}>
        <motion.div style={{ position:'absolute', inset:0 }}
          animate={{ background:[`linear-gradient(135deg,${meta.gradFrom},${meta.gradTo})`,`linear-gradient(135deg,${meta.gradTo},${meta.gradFrom})`] }}
          transition={{ duration:5, repeat:Infinity, ease:'linear' }}/>
        <Orb color="rgba(255,255,255,0.15)" size={200} style={{ top:'-30%', right:'10%' }}/>
        <Orb color="rgba(255,255,255,0.10)" size={150} style={{ bottom:'-20%', left:'5%' }}/>
        <div className="container" style={{ position:'relative', zIndex:1, textAlign:'center' }}>
          <motion.h2 initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(1.5rem,3.5vw,2.4rem)', color:'white', marginBottom:12 }}>
            Ready to explore {meta.label}?
          </motion.h2>
          <motion.p initial={{ opacity:0, y:15 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:.15 }}
            style={{ color:'rgba(255,255,255,.85)', fontSize:'1rem', marginBottom:28 }}>
            Connect via WhatsApp for instant ordering and personalised assistance.
          </motion.p>
          <motion.div initial={{ opacity:0, scale:.9 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ delay:.3 }}
            style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/"
              style={{ display:'inline-flex', alignItems:'center', gap:8, background:'white', color:meta.color, padding:'13px 26px', borderRadius:13, fontWeight:700, fontSize:'0.95rem', textDecoration:'none', boxShadow:'0 8px 24px rgba(0,0,0,.2)' }}>
              Browse All Collections <FiArrowRight/>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}