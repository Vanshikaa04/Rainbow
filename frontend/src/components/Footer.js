import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaInstagram, FaFacebookF, FaWhatsapp } from 'react-icons/fa';
import { categoryMeta } from '../utils/helpers';

const socials = [
  { icon: FaInstagram, href: 'https://www.instagram.com/rainbowmarketing_?igsh=bno0MWV4bnZvd2do', label: 'Instagram', color: '#E1306C' },
  { icon: FaFacebookF, href: '#', label: 'Facebook',  color: '#1877F2' },
  { icon: FaWhatsapp,  href: 'https://wa.me/919825017709', label: 'WhatsApp',  color: '#25D366' },
];

export default function Footer() {
  return (
    <footer style={{ background:'#0F1612', color:'rgba(255,255,255,.72)', marginTop:96 }}>

      {/* Main content */}
      <div style={{ padding:'clamp(40px,7vw,72px) 0 0' }}>
        <div className="container">

          <div style={{
            display:'grid',
            gridTemplateColumns:'1fr minmax(0,420px)',
            gap:'clamp(32px,5vw,72px)',
            marginBottom:48,
            alignItems:'start',
          }}
          className="footer-grid">

            {/* LEFT */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:36 }}>

              {/* Brand */}
              <div>
                <div style={{ marginBottom:16, background:'white', borderRadius:12, display:'inline-block', padding:'6px 10px' }}>
                  <img src="/logo.png" alt="Rainbow Marketing" style={{ height:100 }} />
                </div>

                <p style={{ fontSize:'0.84rem', lineHeight:1.8, color:'rgba(255,255,255,.5)', marginBottom:20, maxWidth:200 }}>
                  Quality products across wellness, freshness, baby care and everyday essentials.
                </p>

                {/* Socials */}
                <div style={{ display:'flex', gap:10 }}>
                  {socials.map(({ icon: Icon, href, label, color }) => (
                    <motion.a key={label} href={href} target="_blank"
                      whileHover={{ scale:1.15 }}
                      style={{ width:36, height:36, borderRadius:10, background:'rgba(255,255,255,.08)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Icon size={16} color={color} />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 style={{ color:'white', marginBottom:16 }}>Collections</h4>
                <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
                  {Object.entries(categoryMeta).map(([key, m]) => (
                    <Link key={key} to={`/?category=${key}`} style={{ color:'rgba(255,255,255,.5)' }}>
                      {m.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick Links + Contact */}
              <div>
                <h4 style={{ color:'white', marginBottom:16 }}>Quick Links</h4>

                <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
                  <Link to="/" style={{ color:'rgba(255,255,255,.5)' }}>Home</Link>
                  <Link to="/admin/login" style={{ color:'rgba(255,255,255,.5)' }}>Admin</Link>

                  {/* WhatsApp Active */}
                  <div style={{ marginTop:12 }}>
                    <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(37,211,102,.10)', padding:'8px 13px', borderRadius:10 }}>
                      <div style={{ width:7, height:7, borderRadius:'50%', background:'#25D366' }} />
                      <span style={{ fontSize:'0.76rem' }}>WhatsApp Active</span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div style={{ marginTop:16 }}>
                    <h5 style={{ color:'white', fontSize:'0.85rem' }}>Contact</h5>
                    <p style={{ fontSize:'0.8rem', margin:0 }}>Kamal Pritmani</p>
                    <a href="tel:+919825017709" style={{ fontSize:'0.8rem', color:'#25D366', textDecoration:'none' }}>
                      +91 98250 17709
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT - MAP */}
            <div>
              <h4 style={{ color:'white', marginBottom:14 }}>Find Us</h4>

              <a 
                href="https://www.google.com/maps/place/Rainbow+marketing,+Ahmedabad"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display:'block' }}
              >
                <div style={{
                  borderRadius:16,
                  overflow:'hidden',
                  border:'1px solid rgba(255,255,255,.08)',
                  height:280,
                  cursor:'pointer'
                }}>
                  <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3670.086378070454!2d72.65577387503006!3d23.093933613661967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e811284b1ec9f%3A0xd7db2f92408b1206!2sRainbow%20marketing!5e0!3m2!1sen!2sin!4v1777018873393!5m2!1sen!2sin"
                    width="100%"
                    height="280"
                    style={{ border:0, pointerEvents:'none' }}
                    loading="lazy"
                  />
                </div>
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,.07)', padding:'18px 0' }}>
        <div className="container" style={{
          display:'flex',
          flexDirection:'column',
          alignItems:'center',
          textAlign:'center',
          gap:6
        }}>
          <p style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.56)', margin:0 }}>
            © {new Date().getFullYear()} Rainbow Marketing. All rights reserved.
          </p>

          <p style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.56)', margin:0 }}>
            Design & Developed by{" "}
            <a href="https://soulfulscribble.in" target="_blank" rel="noopener noreferrer">
              <span style={{ color:"white" }}>Soulful Scribble</span>
            </a>
          </p>
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          .footer-grid{ grid-template-columns:1fr !important; }
        }
      `}</style>

    </footer>
  );
}