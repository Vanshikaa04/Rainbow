import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaInstagram, FaFacebookF, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import { categoryMeta } from '../utils/helpers';

/* Replace with your actual Google Maps embed src */
const MAP_SRC = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58755.0!2d72.72!3d23.03!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000';

const socials = [
  { icon: FaInstagram, href: '#', label: 'Instagram', color: '#E1306C' },
  { icon: FaFacebookF, href: '#', label: 'Facebook',  color: '#1877F2' },
  { icon: FaWhatsapp,  href: '#', label: 'WhatsApp',  color: '#25D366' },
  { icon: FaYoutube,   href: '#', label: 'YouTube',   color: '#FF0000' },
];

export default function Footer() {
  return (
    <footer style={{ background:'#0F1612', color:'rgba(255,255,255,.72)', marginTop:96 }}>

      {/* ── Main content ── */}
      <div style={{ padding:'clamp(40px,7vw,72px) 0 0' }}>
        <div className="container">

          {/* Two-column: links left, map right */}
          <div style={{
            display:'grid',
            gridTemplateColumns:'1fr minmax(0,420px)',
            gap:'clamp(32px,5vw,72px)',
            marginBottom:48,
            alignItems:'start',
          }}
            className="footer-grid">

            {/* ── Left: brand + links ── */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:36 }}>

              {/* Brand */}
              <div>
                {/* Logo — mix-blend-mode removes black bg */}
                <div style={{ marginBottom:16, background:'white', borderRadius:12, display:'inline-block', padding:'6px 10px' }}>
                  <img src="/logo.png" alt="Rainbow Marketing" style={{ height:100, display:'block' }} />
                </div>
                <p style={{ fontSize:'0.84rem', lineHeight:1.8, color:'rgba(255,255,255,.5)', marginBottom:20, maxWidth:200 }}>
                  Quality products across wellness, freshness, baby care and everyday essentials.
                </p>
                {/* Social icons */}
                <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                  {socials.map(({ icon: Icon, href, label, color }) => (
                    <motion.a key={label} href={href} aria-label={label}
                      whileHover={{ scale:1.18, y:-2 }}
                      style={{ width:36, height:36, borderRadius:10, background:'rgba(255,255,255,.08)', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,.65)', transition:'background .2s, color .2s' }}
                      onMouseEnter={e=>{ e.currentTarget.style.background=color+'22'; e.currentTarget.style.color=color; }}
                      onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,.08)'; e.currentTarget.style.color='rgba(255,255,255,.65)'; }}>
                      <Icon size={16} />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 style={{ color:'white', fontFamily:'Playfair Display,serif', fontSize:'0.97rem', marginBottom:16, fontWeight:600 }}>Collections</h4>
                <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
                  {Object.entries(categoryMeta).map(([key, m]) => (
                    <Link key={key} to={`/?category=${key}`}
                      style={{ color:'rgba(255,255,255,.5)', fontSize:'0.85rem', transition:'color .2s' }}
                      onMouseEnter={e=>e.currentTarget.style.color=m.color}
                      onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.5)'}>
                      {m.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div>
                <h4 style={{ color:'white', fontFamily:'Playfair Display,serif', fontSize:'0.97rem', marginBottom:16, fontWeight:600 }}>Quick Links</h4>
                <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
                  {[
                    { to:'/', label:'Home' },
                    { to:'/admin/login', label:'Admin' },
                  ].map(l => (
                    <Link key={l.to} to={l.to}
                      style={{ color:'rgba(255,255,255,.5)', fontSize:'0.85rem', transition:'color .2s' }}
                      onMouseEnter={e=>e.currentTarget.style.color='#43A047'}
                      onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.5)'}>
                      {l.label}
                    </Link>
                  ))}
                  <div style={{ marginTop:12 }}>
                    <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(37,211,102,.10)', border:'1px solid rgba(37,211,102,.22)', padding:'8px 13px', borderRadius:10 }}>
                      <div style={{ width:7, height:7, borderRadius:'50%', background:'#25D366', animation:'pdot 2s infinite' }} />
                      <span style={{ fontSize:'0.76rem', color:'rgba(255,255,255,.65)', fontWeight:600 }}>WhatsApp Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right: Map ── */}
            <div>
              <h4 style={{ color:'white', fontFamily:'Playfair Display,serif', fontSize:'0.97rem', marginBottom:14, fontWeight:600 }}>Find Us</h4>
              <div style={{ borderRadius:16, overflow:'hidden', border:'1px solid rgba(255,255,255,.08)', height:280, position:'relative' }}>
               <iframe src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d468463.2881482295!2d72.51158891598345!3d23.465173540322173!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x395e811284b1ec9f%3A0xd7db2f92408b1206!2sRainbow%20marketing%2C%20opp.%20Prem%20Prakash%20Ashram%2C%20Nana%20Chiloda%2C%20Ahmedabad%2C%20Gujarat%20382330!3m2!1d23.0939287!2d72.6583488!5e0!3m2!1sen!2sin!4v1777008763811!5m2!1sen!2sin"
                  width="100%" height="280"
                  style={{ border:0, display:'block', filter:'grayscale(30%) brightness(0.9)' }}
                  allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,.07)', padding:'18px 0',display:"flex", justifyItems:'center' }}>
        <div className="container" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
          <p style={{ fontSize:'0.78rem', color:'rgba(255, 255, 255, 0.56)' }}>© {new Date().getFullYear()} Rainbow Marketing. All rights reserved.</p>
          <br />
          <p style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.56)' }}>Design & Developed by <a href="https://soulfulscribble.in" target="_blank" rel="noopener noreferrer"><span style={{color:"white"}}>Soulful Scribble</span></a></p>
        </div>
      </div>

      <style>{`
        @keyframes pdot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.35)} }
        @media(max-width:768px){
          .footer-grid{ grid-template-columns:1fr !important; }
        }
      `}</style>
    </footer>
  );
}