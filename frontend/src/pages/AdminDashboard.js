import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus, FiEdit2, FiTrash2, FiLogOut, FiPackage,
  FiStar, FiX, FiCheck, FiUpload, FiSearch, FiBarChart2, FiHome
} from 'react-icons/fi';
import {
  getAdminProducts, getAdminStats, createProduct, updateProduct,
  deleteProduct, deleteProductImage
} from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice, categoryMeta } from '../utils/helpers';
import toast from 'react-hot-toast';

const CATEGORIES = ['clove', 'i-fresh', 'cutebaby', 'general'];
const DEFAULT_WA  = '+919876543210'; // ← change to your number
const EMPTY_FORM  = {
  name:'', description:'', price:'', originalPrice:'',
  category:'general', whatsappNumber:DEFAULT_WA,
  inStock:true, featured:false, tags:'',
};

/* Safely convert tags to a comma string */
const tagsToStr = val => {
  if (!val) return '';
  if (Array.isArray(val)) return val.join(', ');
  if (typeof val === 'string') return val;
  return String(val);
};

/* Parse tags string to array */
const strToTags = str => {
  if (!str || typeof str !== 'string') return [];
  return str.split(',').map(t => t.trim()).filter(Boolean);
};

/* ── Toggle ──────────────────────────────────────────────────── */
const Toggle = ({ value, onChange, label }) => (
  <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:'0.88rem', fontWeight:500, userSelect:'none' }}>
    <div onClick={() => onChange(!value)}
      style={{ width:40, height:22, borderRadius:99, background:value?'#2E7D32':'#ccc', transition:'background .25s', position:'relative', cursor:'pointer', flexShrink:0 }}>
      <div style={{ position:'absolute', top:2, left:value?20:2, width:18, height:18, borderRadius:'50%', background:'white', transition:'left .25s', boxShadow:'0 1px 4px rgba(0,0,0,.2)' }} />
    </div>
    {label}
  </label>
);

/* ── Image Thumb ─────────────────────────────────────────────── */
const ImageThumb = ({ src, onRemove, isNew, removing }) => (
  <div style={{ position:'relative', width:72, height:72, flexShrink:0, opacity:removing?0.4:1, transition:'opacity .2s' }}>
    <img src={src} alt=""
      style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:10, border:`2px solid ${isNew?'#25D366':'var(--border)'}`, display:'block' }}
      onError={e => { e.target.src='https://placehold.co/72x72/F5F5F5/999?text=?'; }} />
    {isNew && <span style={{ position:'absolute', bottom:2, left:2, fontSize:'0.54rem', fontWeight:700, background:'#25D366', color:'white', borderRadius:4, padding:'1px 4px' }}>NEW</span>}
    {onRemove && !removing && (
      <button onClick={onRemove}
        style={{ position:'absolute', top:-6, right:-6, width:20, height:20, borderRadius:'50%', background:'#DC2626', color:'white', border:'2px solid white', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', padding:0 }}>
        <FiX size={10}/>
      </button>
    )}
  </div>
);

/* ── Product Form Modal ──────────────────────────────────────── */
const ProductModal = ({ product, onClose, onSaved }) => {
  const [form, setForm] = useState(() => product ? {
    name:           product.name        || '',
    description:    product.description || '',
    price:          product.price       || '',
    originalPrice:  product.originalPrice || '',
    category:       product.category    || 'general',
    whatsappNumber: product.whatsappNumber || DEFAULT_WA,
    inStock:        product.inStock !== undefined ? product.inStock : true,
    featured:       product.featured    || false,
    tags:           tagsToStr(product.tags),
  } : { ...EMPTY_FORM });

  const [existingImages, setExistingImages] = useState(product?.images || []);
  const [newFiles,    setNewFiles]    = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [removingId,  setRemovingId]  = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]:v }));
  const meta = categoryMeta[form.category] || categoryMeta.general;
  const totalImages = existingImages.length + newFiles.length;

  const handlePick = e => {
    const files = Array.from(e.target.files);
    if (totalImages + files.length > 5) { toast.error('Max 5 images per product'); return; }
    setNewFiles(p => [...p, ...files]);
    setNewPreviews(p => [...p, ...files.map(f => URL.createObjectURL(f))]);
    e.target.value = '';
  };

  const removeNewFile = i => {
    URL.revokeObjectURL(newPreviews[i]);
    setNewFiles(p => p.filter((_,j) => j!==i));
    setNewPreviews(p => p.filter((_,j) => j!==i));
  };

  const removeExisting = async img => {
    if (!product) return;
    setRemovingId(img.public_id);
    try {
      await deleteProductImage(product._id, img.public_id);
      setExistingImages(p => p.filter(x => x.public_id !== img.public_id));
      toast.success('Image removed');
    } catch { toast.error('Failed to remove image'); }
    finally { setRemovingId(null); }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      /* Append all scalar fields */
      fd.append('name',           form.name);
      fd.append('description',    form.description);
      fd.append('price',          form.price);
      fd.append('category',       form.category);
      fd.append('whatsappNumber', form.whatsappNumber);
      fd.append('inStock',        form.inStock);
      fd.append('featured',       form.featured);
      if (form.originalPrice) fd.append('originalPrice', form.originalPrice);

      /* Tags — always an array in FormData */
      strToTags(form.tags).forEach(t => fd.append('tags', t));

      /* Images */
      fd.append('keepImages', JSON.stringify(existingImages));
      newFiles.forEach(f => fd.append('images', f));

      if (product) { await updateProduct(product._id, fd); toast.success('Product updated ✅'); }
      else          { await createProduct(fd);             toast.success('Product added 🎉'); }
      onSaved();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    finally { setLoading(false); }
  };

  const inp = {
    width:'100%', padding:'10px 13px', borderRadius:10,
    border:'1.5px solid var(--border)', background:'var(--surface)',
    fontSize:'0.9rem', outline:'none', color:'var(--text-primary)',
    fontFamily:'DM Sans,sans-serif', transition:'border-color .2s, background .2s',
  };
  const lbl = { display:'block', fontSize:'0.8rem', fontWeight:600, marginBottom:6, color:'var(--text-secondary)' };
  const fi  = e => { e.target.style.borderColor=meta.color; e.target.style.background='white'; };
  const fo  = e => { e.target.style.borderColor='var(--border)'; e.target.style.background='var(--surface)'; };

  return (
    /* ── IMPORTANT: backdrop does NOT close on click — only X/Cancel do ── */
    <div style={{ position:'fixed', inset:0, zIndex:2000, background:'rgba(10,8,6,.72)', backdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <motion.div initial={{ scale:.92, y:28, opacity:0 }} animate={{ scale:1, y:0, opacity:1 }} exit={{ scale:.92, y:28, opacity:0 }}
        transition={{ type:'spring', damping:26, stiffness:340 }}
        style={{ background:'white', borderRadius:24, width:'100%', maxWidth:680, maxHeight:'92vh', overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 24px 80px rgba(0,0,0,.25)' }}>

        {/* Header */}
        <div style={{ padding:'18px 24px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', background:meta.bg, flexShrink:0 }}>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'1.1rem', color:meta.color }}>
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:8, background:'rgba(255,255,255,.7)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <FiX size={16}/>
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} style={{ overflowY:'auto', padding:'22px 24px', flex:1 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:15 }}>

            <div style={{ gridColumn:'1/-1' }}>
              <label style={lbl}>Product Name *</label>
              <input style={inp} value={form.name} onChange={e=>set('name',e.target.value)} required placeholder="e.g. Clove Premium Oil" onFocus={fi} onBlur={fo}/>
            </div>

            <div style={{ gridColumn:'1/-1' }}>
              <label style={lbl}>Description *</label>
              <textarea style={{ ...inp, height:78, resize:'vertical' }} value={form.description} onChange={e=>set('description',e.target.value)} required placeholder="Describe the product..." onFocus={fi} onBlur={fo}/>
            </div>

            <div>
              <label style={lbl}>Price (₹) *</label>
              <input style={inp} type="number" min="0" step="0.01" value={form.price} onChange={e=>set('price',e.target.value)} required placeholder="299" onFocus={fi} onBlur={fo}/>
            </div>
            <div>
              <label style={lbl}>Original Price (₹) <span style={{ fontWeight:400, color:'var(--text-muted)' }}>(optional)</span></label>
              <input style={inp} type="number" min="0" step="0.01" value={form.originalPrice} onChange={e=>set('originalPrice',e.target.value)} placeholder="399" onFocus={fi} onBlur={fo}/>
            </div>

            <div>
              <label style={lbl}>Category *</label>
              <select style={{ ...inp, cursor:'pointer' }} value={form.category} onChange={e=>set('category',e.target.value)} required>
                {CATEGORIES.map(c => <option key={c} value={c}>{categoryMeta[c]?.label}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>WhatsApp Number * <span style={{ fontWeight:400, color:'var(--text-muted)' }}>(pre-filled)</span></label>
              <input style={inp} value={form.whatsappNumber} onChange={e=>set('whatsappNumber',e.target.value)} required placeholder="+91XXXXXXXXXX" onFocus={fi} onBlur={fo}/>
            </div>

            <div style={{ gridColumn:'1/-1' }}>
              <label style={lbl}>Tags <span style={{ fontWeight:400, color:'var(--text-muted)' }}>(comma separated)</span></label>
              <input style={inp} value={form.tags} onChange={e=>set('tags',e.target.value)} placeholder="organic, premium, natural" onFocus={fi} onBlur={fo}/>
            </div>

            <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
              <Toggle value={form.inStock}  onChange={v=>set('inStock',v)}  label="In Stock"/>
              <Toggle value={form.featured} onChange={v=>set('featured',v)} label="Featured ⭐"/>
            </div>

            {/* Images */}
            <div style={{ gridColumn:'1/-1' }}>
              <label style={{ ...lbl, marginBottom:10 }}>Images ({totalImages}/5)</label>
              <div style={{ display:'flex', gap:9, flexWrap:'wrap', marginBottom:totalImages?10:0 }}>
                {existingImages.map(img => (
                  <ImageThumb key={img.public_id} src={img.url} isNew={false}
                    removing={removingId===img.public_id}
                    onRemove={removingId?null:()=>removeExisting(img)}/>
                ))}
                {newPreviews.map((p,i) => (
                  <ImageThumb key={`n${i}`} src={p} isNew onRemove={()=>removeNewFile(i)}/>
                ))}
              </div>
              {totalImages < 5 && (
                <label style={{ display:'flex', alignItems:'center', gap:9, padding:'11px 15px', borderRadius:10, border:'2px dashed var(--border)', cursor:'pointer', color:'var(--text-secondary)', fontSize:'0.84rem', transition:'border-color .2s' }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=meta.color}
                  onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                  <FiUpload size={14}/>
                  Pick images ({5-totalImages} left) — uploaded only on Save
                  <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" multiple hidden onChange={handlePick}/>
                </label>
              )}
              {totalImages>0 && (
                <p style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginTop:7 }}>
                  Red ✕ removes from Cloudinary immediately. Green NEW = uploads on Save.
                </p>
              )}
            </div>
          </div>

          <div style={{ display:'flex', gap:12, marginTop:22 }}>
            <button type="button" onClick={onClose}
              style={{ flex:1, padding:'12px', borderRadius:11, border:'1.5px solid var(--border)', background:'white', fontWeight:600, cursor:'pointer', fontSize:'0.9rem' }}>
              Cancel
            </button>
            <motion.button type="submit" disabled={loading}
              whileHover={{ scale:1.02 }} whileTap={{ scale:.98 }}
              style={{ flex:2, padding:'12px', borderRadius:11, background:`linear-gradient(135deg,${meta.color},${meta.color}bb)`, color:'white', fontWeight:700, cursor:loading?'not-allowed':'pointer', fontSize:'0.9rem', display:'flex', alignItems:'center', justifyContent:'center', gap:8, border:'none', boxShadow:`0 6px 20px ${meta.color}44` }}>
              {loading ? <><div className="spinner" style={{ width:18,height:18,borderWidth:2 }}/> Saving...</> : <><FiCheck/> {product?'Save Changes':'Add Product'}</>}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

/* ── Delete Confirm Modal ────────────────────────────────────── */
const DeleteModal = ({ onConfirm, onCancel }) => (
  /* No backdrop-click close — only Cancel or Delete button */
  <div style={{ position:'fixed', inset:0, zIndex:2000, background:'rgba(10,8,6,.72)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
    <motion.div initial={{ scale:.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:.9, opacity:0 }}
      style={{ background:'white', borderRadius:20, padding:'30px 26px', maxWidth:330, width:'100%', textAlign:'center', boxShadow:'0 24px 60px rgba(0,0,0,.22)' }}>
      <div style={{ width:52, height:52, borderRadius:14, background:'#FEF2F2', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
        <FiTrash2 size={22} color="#DC2626"/>
      </div>
      <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:'1.15rem', marginBottom:8 }}>Delete Product?</h3>
      <p style={{ color:'var(--text-secondary)', marginBottom:22, fontSize:'0.86rem', lineHeight:1.6 }}>
        Permanently deletes the product and all its Cloudinary images. This cannot be undone.
      </p>
      <div style={{ display:'flex', gap:11 }}>
        <button onClick={onCancel}
          style={{ flex:1, padding:'11px', borderRadius:10, border:'1.5px solid var(--border)', background:'white', cursor:'pointer', fontWeight:600, fontSize:'0.88rem' }}>
          Cancel
        </button>
        <button onClick={onConfirm}
          style={{ flex:1, padding:'11px', borderRadius:10, background:'#DC2626', color:'white', border:'none', cursor:'pointer', fontWeight:700, fontSize:'0.88rem' }}>
          Delete
        </button>
      </div>
    </motion.div>
  </div>
);

/* ── Mobile card ─────────────────────────────────────────────── */
const MobileCard = ({ product, onEdit, onDelete }) => {
  const meta   = categoryMeta[product.category] || categoryMeta.general;
  const imgSrc = product.images?.[0]?.url || 'https://placehold.co/54x54/F5F5F5/999?text=?';
  return (
    <motion.div initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-8 }}
      style={{ display:'flex', alignItems:'center', gap:11, padding:'11px 13px', background:'white', borderRadius:14, border:'1px solid var(--border)', boxShadow:'var(--shadow-sm)' }}>
      <div style={{ position:'relative', flexShrink:0 }}>
        <img src={imgSrc} alt={product.name}
          style={{ width:54, height:54, borderRadius:9, objectFit:'cover', border:'1px solid var(--border)', display:'block' }}
          onError={e=>{e.target.src='https://placehold.co/54x54';}}/>
        {product.images?.length>1 && (
          <span style={{ position:'absolute', bottom:-3, right:-3, background:'var(--brand)', color:'white', fontSize:'0.54rem', fontWeight:700, borderRadius:4, padding:'1px 4px' }}>+{product.images.length-1}</span>
        )}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontWeight:600, fontSize:'0.86rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:3 }}>{product.name}</div>
        <div style={{ display:'flex', gap:5, flexWrap:'wrap', alignItems:'center' }}>
          <span className={`badge cat-${product.category}`} style={{ fontSize:'0.66rem' }}>{meta.label}</span>
          <span style={{ fontSize:'0.78rem', fontWeight:700 }}>{formatPrice(product.price)}</span>
          {!product.inStock && <span style={{ fontSize:'0.66rem', background:'#FFF3E0', color:'#E65100', padding:'2px 6px', borderRadius:99, fontWeight:600 }}>Out of Stock</span>}
        </div>
      </div>
      <div style={{ display:'flex', gap:7, flexShrink:0 }}>
        <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:.9 }} onClick={()=>onEdit(product)}
          style={{ width:34, height:34, borderRadius:9, border:'1.5px solid var(--border)', background:'white', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-secondary)' }}>
          <FiEdit2 size={14}/>
        </motion.button>
        <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:.9 }} onClick={()=>onDelete(product._id)}
          style={{ width:34, height:34, borderRadius:9, border:'1.5px solid #FECACA', background:'#FEF2F2', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#DC2626' }}>
          <FiTrash2 size={14}/>
        </motion.button>
      </div>
    </motion.div>
  );
};

/* ── Admin Dashboard ─────────────────────────────────────────── */
export default function AdminDashboard() {
  const [products,   setProducts]   = useState([]);
  const [stats,      setStats]      = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [catFilter,  setCatFilter]  = useState('all');
  const [modal,      setModal]      = useState(null); // null | 'new' | product object
  const [deleteId,   setDeleteId]   = useState(null);
  const [isMobile,   setIsMobile]   = useState(window.innerWidth < 680);
  const { admin, logout }           = useAuth();
  const navigate                    = useNavigate();
  const pollRef                     = useRef(null);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 680);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const fetchAll = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [pRes, sRes] = await Promise.all([getAdminProducts(), getAdminStats()]);
      setProducts(pRes.data);
      setStats(sRes.data);
    } catch { if (!silent) toast.error('Failed to load data'); }
    finally { if (!silent) setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* Silent auto-refresh every 15 s */
  useEffect(() => {
    const start = () => { pollRef.current = setInterval(() => fetchAll(true), 15000); };
    const stop  = () => clearInterval(pollRef.current);
    const vis   = () => { document.hidden ? stop() : start(); };
    start();
    document.addEventListener('visibilitychange', vis);
    return () => { stop(); document.removeEventListener('visibilitychange', vis); };
  }, [fetchAll]);

  const handleDelete = async id => {
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      setDeleteId(null);
      fetchAll(true);
    } catch { toast.error('Delete failed'); }
  };

  const filtered = products.filter(p =>
    (catFilter === 'all' || p.category === catFilter) &&
    (!search || p.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ minHeight:'100vh', background:'#F7F7F7' }}>

      {/* ── Top bar ── */}
      <div style={{ background:'white', borderBottom:'1px solid var(--border)', position:'sticky', top:0, zIndex:100, boxShadow:'var(--shadow-sm)' }}>
        <div className="container" style={{ display:'flex', alignItems:'center', height:60, gap:10 }}>
          <Link to="/" style={{ display:'flex', alignItems:'center', flexShrink:0 }}>
            <img src="/logo.png" alt="Rainbow" style={{ height:60, mixBlendMode:'multiply', display:'block' }}/>
          </Link>
          {/* <span style={{ fontSize:'0.78rem', color:'var(--text-muted)', fontWeight:500, letterSpacing:'.04em', textTransform:'uppercase' }}>Admin</span> */}
          <div style={{ flex:1 }}/>
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 13px', borderRadius:9, border:'1.5px solid var(--border)', color:'var(--text-secondary)', fontWeight:500, fontSize:'0.81rem', background:'white', whiteSpace:'nowrap', transition:'all .2s' }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--brand)';e.currentTarget.style.color='var(--brand)';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--text-secondary)';}}>
            <FiHome size={13}/> {isMobile?'':'View Site'}
          </Link>
          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:.97 }} onClick={()=>setModal('new')}
            style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 15px', borderRadius:9, background:'var(--rb-green)', color:'white', fontWeight:600, fontSize:'0.81rem', border:'none', cursor:'pointer', boxShadow:'0 3px 12px rgba(46,125,50,.25)', whiteSpace:'nowrap' }}>
            <FiPlus size={13}/> {isMobile?'Add':'Add Product'}
          </motion.button>
          <button onClick={()=>{logout();navigate('/admin/login');}}
            style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 13px', borderRadius:9, border:'1.5px solid var(--border)', background:'white', color:'var(--text-secondary)', fontWeight:500, fontSize:'0.81rem', cursor:'pointer', whiteSpace:'nowrap' }}>
            <FiLogOut size={13}/> {isMobile?'':'Logout'}
          </button>
        </div>
      </div>

      <div className="container" style={{ paddingTop:24, paddingBottom:56 }}>

        {/* Stats */}
        {stats && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:13, marginBottom:26 }}>
            {[
              { icon:<FiPackage/>, label:'Total',    val:stats.total,              color:'var(--rb-green)' },
              { icon:<FiStar/>,    label:'Featured', val:stats.featured,           color:'var(--rb-yellow)' },
              { icon:<FiCheck/>,   label:'In Stock', val:stats.inStock,            color:'var(--rb-teal)' },
              { icon:<FiBarChart2/>,label:'Categories',val:stats.byCategory?.length||0, color:'var(--rb-purple)' },
            ].map((s,i) => (
              <motion.div key={s.label} initial={{ opacity:0,y:14 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*.07 }}
                style={{ background:'white', borderRadius:13, padding:'15px', border:'1px solid var(--border)', boxShadow:'var(--shadow-sm)', display:'flex', alignItems:'center', gap:11 }}>
                <div style={{ width:36, height:36, borderRadius:9, background:`${s.color}18`, color:s.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize:'1.4rem', fontWeight:800, fontFamily:'Playfair Display,serif', lineHeight:1.1 }}>{s.val}</div>
                  <div style={{ fontSize:'0.72rem', color:'var(--text-secondary)', fontWeight:500 }}>{s.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div style={{ display:'flex', gap:9, flexWrap:'wrap', marginBottom:16, alignItems:'center' }}>
          <div style={{ position:'relative', flex:1, minWidth:150 }}>
            <FiSearch style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', fontSize:13 }}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..."
              style={{ width:'100%', padding:'9px 12px 9px 32px', borderRadius:10, border:'1.5px solid var(--border)', background:'var(--surface)', fontSize:'0.85rem', outline:'none', color:'var(--text-primary)' }}/>
          </div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {['all',...CATEGORIES].map(c => {
              const m = c==='all' ? {color:'var(--brand)',bg:'#E8F5E9',label:'All'} : categoryMeta[c];
              const ia = catFilter===c;
              return (
                <button key={c} onClick={()=>setCatFilter(c)}
                  style={{ padding:'7px 12px', borderRadius:99, border:`1.5px solid ${ia?m.color:'var(--border)'}`, background:ia?m.bg:'white', color:ia?m.color:'var(--text-secondary)', fontWeight:ia?700:500, fontSize:'0.79rem', cursor:'pointer', transition:'all .2s', whiteSpace:'nowrap' }}>
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Products list */}
        <div style={{ background:'white', borderRadius:18, border:'1px solid var(--border)', overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>
          <div style={{ padding:'12px 18px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontWeight:600, fontSize:'0.88rem' }}>Products ({filtered.length})</span>
            <span style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>Auto-refresh: 15s</span>
          </div>

          {loading ? (
            <div style={{ padding:40, textAlign:'center' }}>
              <div className="spinner" style={{ margin:'0 auto 12px' }}/>
              <p style={{ color:'var(--text-muted)', fontSize:'0.86rem' }}>Loading...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding:'48px 20px', textAlign:'center', color:'var(--text-muted)' }}>
              <FiPackage size={34} style={{ opacity:.3, display:'block', margin:'0 auto 10px' }}/>
              <p style={{ fontSize:'0.88rem' }}>No products found</p>
            </div>
          ) : isMobile ? (
            <div style={{ padding:13, display:'flex', flexDirection:'column', gap:9 }}>
              <AnimatePresence>
                {filtered.map(p => (
                  <MobileCard key={p._id} product={p}
                    onEdit={prod => setModal(prod)}
                    onDelete={id => setDeleteId(id)}/>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:580 }}>
                <thead>
                  <tr style={{ background:'var(--surface)' }}>
                    {['Product','Category','Price','Status','Actions'].map(h => (
                      <th key={h} style={{ padding:'10px 18px', textAlign:'left', fontSize:'0.73rem', fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((p,i) => {
                      const m = categoryMeta[p.category]||categoryMeta.general;
                      const imgSrc = p.images?.[0]?.url||'https://placehold.co/42x42/F5F5F5/999?text=?';
                      return (
                        <motion.tr key={p._id}
                          initial={{ opacity:0,x:-12 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0 }}
                          transition={{ delay:i*.04 }}
                          style={{ borderBottom:'1px solid var(--border)', transition:'background .15s' }}
                          onMouseEnter={e=>e.currentTarget.style.background='var(--surface)'}
                          onMouseLeave={e=>e.currentTarget.style.background='white'}>
                          <td style={{ padding:'12px 18px' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:11 }}>
                              <div style={{ position:'relative', flexShrink:0 }}>
                                <img src={imgSrc} alt={p.name} style={{ width:42, height:42, borderRadius:9, objectFit:'cover', border:'1px solid var(--border)', display:'block' }} onError={e=>{e.target.src='https://placehold.co/42x42';}}/>
                                {p.images?.length>1 && (
                                  <span style={{ position:'absolute', bottom:-3, right:-3, background:'var(--brand)', color:'white', fontSize:'0.56rem', fontWeight:700, borderRadius:4, padding:'1px 4px' }}>+{p.images.length-1}</span>
                                )}
                              </div>
                              <div>
                                <div style={{ fontWeight:600, fontSize:'0.85rem', maxWidth:180, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</div>
                                {p.featured && <span style={{ fontSize:'0.68rem', color:'#B5891A', fontWeight:600 }}>★ Featured</span>}
                              </div>
                            </div>
                          </td>
                          <td style={{ padding:'12px 18px' }}><span className={`badge cat-${p.category}`}>{m.label}</span></td>
                          <td style={{ padding:'12px 18px' }}>
                            <div style={{ fontWeight:700, fontSize:'0.88rem' }}>{formatPrice(p.price)}</div>
                            {p.originalPrice && <div style={{ fontSize:'0.73rem', color:'var(--text-muted)', textDecoration:'line-through' }}>{formatPrice(p.originalPrice)}</div>}
                          </td>
                          <td style={{ padding:'12px 18px' }}>
                            <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:'0.74rem', fontWeight:600, padding:'3px 10px', borderRadius:99, background:p.inStock?'#E8F5E9':'#FFF3E0', color:p.inStock?'#2E7D32':'#E65100' }}>
                              <div style={{ width:5, height:5, borderRadius:'50%', background:'currentColor' }}/>{p.inStock?'In Stock':'Out of Stock'}
                            </span>
                          </td>
                          <td style={{ padding:'12px 18px' }}>
                            <div style={{ display:'flex', gap:7 }}>
                              <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:.9 }} onClick={()=>setModal(p)}
                                style={{ width:32, height:32, borderRadius:7, border:'1.5px solid var(--border)', background:'white', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-secondary)' }}>
                                <FiEdit2 size={13}/>
                              </motion.button>
                              <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:.9 }} onClick={()=>setDeleteId(p._id)}
                                style={{ width:32, height:32, borderRadius:7, border:'1.5px solid #FECACA', background:'#FEF2F2', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#DC2626' }}>
                                <FiTrash2 size={13}/>
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals — rendered outside scroll container, no AnimatePresence needed for static modals */}
      {(modal === 'new' || (modal && typeof modal === 'object')) && (
        <ProductModal
          product={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); fetchAll(true); }}
        />
      )}

      {deleteId && (
        <DeleteModal
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}