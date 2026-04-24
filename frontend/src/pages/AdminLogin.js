import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';
import { adminLogin } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [form, setForm]     = useState({ username:'', password:'' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login }           = useAuth();
  const navigate            = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await adminLogin(form);
      login(res.data.token, res.data.admin);
      toast.success(`Welcome back, ${res.data.admin.username}! 🌈`);
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const inp = {
    width:'100%', padding:'12px 15px 12px 42px', borderRadius:12,
    border:'1.5px solid var(--border)', background:'var(--surface)',
    fontSize:'0.93rem', outline:'none', color:'var(--text-primary)',
    fontFamily:'DM Sans,sans-serif', transition:'all .2s',
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#FFF8F5,#FFF0F7,#F0F4FF)', padding:20 }}>
      {/* Blobs */}
      {[{top:'8%',left:'8%',color:'#FF6B3528',size:200},{bottom:'8%',right:'8%',color:'#EC407A28',size:260},{top:'55%',right:'20%',color:'#5C6BC028',size:170}].map((b,i) => (
        <div key={i} style={{ position:'fixed', ...b, width:b.size, height:b.size, borderRadius:'50%', background:b.color, filter:'blur(48px)', pointerEvents:'none' }} />
      ))}

      <motion.div
        initial={{ opacity:0, y:36, scale:.96 }} animate={{ opacity:1, y:0, scale:1 }}
        transition={{ duration:.5, ease:[.34,1.56,.64,1] }}
        style={{ background:'white', borderRadius:26, padding:'clamp(28px,5vw,48px) clamp(22px,4vw,44px)', width:'100%', maxWidth:420, boxShadow:'var(--shadow-xl)', border:'1px solid var(--border)', position:'relative', zIndex:1 }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <motion.div
            style={{ width:100, height:60, borderRadius:16, margin:'0 auto 14px',  display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.7rem', fontWeight:900, color:'white', fontFamily:'Playfair Display,serif' }}
          >
            <img    src="/rainbow.png"
                alt="Rainbow"
                style={{ height:80, width:'auto', display:'block' ,marginBottom:"12px"}} />
          </motion.div>
          <h1 style={{  fontSize:'1.6rem', fontWeight:800, marginBottom:4 , marginTop:"20px"}}>Admin Panel</h1>
          <p style={{ color:'var(--text-secondary)', fontSize:'0.88rem' }}>Sign in to manage Rainbow</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div style={{ marginBottom:18 }}>
            <label style={{ display:'block', fontSize:'0.85rem', fontWeight:600, marginBottom:7, color:'var(--text-primary)' }}>Username</label>
            <div style={{ position:'relative' }}>
              <FiUser style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', fontSize:15 }} />
              <input {...inp} type="text" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} placeholder="Your username" required
                style={inp}
                onFocus={e=>{e.target.style.borderColor='#FF6B35';e.target.style.background='white';}}
                onBlur={e=>{e.target.style.borderColor='var(--border)';e.target.style.background='var(--surface)';}} />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom:26 }}>
            <label style={{ display:'block', fontSize:'0.85rem', fontWeight:600, marginBottom:7, color:'var(--text-primary)' }}>Password</label>
            <div style={{ position:'relative' }}>
              <FiLock style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', fontSize:15 }} />
              <input type={showPwd?'text':'password'} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Your password" required
                style={{ ...inp, paddingRight:42 }}
                onFocus={e=>{e.target.style.borderColor='#FF6B35';e.target.style.background='white';}}
                onBlur={e=>{e.target.style.borderColor='var(--border)';e.target.style.background='var(--surface)';}} />
              <button type="button" onClick={()=>setShowPwd(v=>!v)}
                style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', padding:4, background:'none', border:'none', cursor:'pointer', display:'flex' }}>
                {showPwd ? <FiEyeOff size={15}/> : <FiEye size={15}/>}
              </button>
            </div>
          </div>

          <motion.button type="submit" disabled={loading} whileHover={{ scale:1.02 }} whileTap={{ scale:.98 }}
            style={{ width:'100%', padding:'13px', borderRadius:13, background:loading?'var(--text-muted)':'linear-gradient(135deg,#FF6B35,#EC407A)', color:'white', fontSize:'0.97rem', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:'0 8px 22px rgba(255,107,53,.32)', border:'none', cursor:loading?'not-allowed':'pointer' }}>
            {loading ? <><div className="spinner" style={{ width:19,height:19,borderWidth:2 }}/> Signing in...</> : <><FiLogIn/> Sign In</>}
          </motion.button>
        </form>

      
      </motion.div>
    </div>
  );
};

export default AdminLogin;