import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../App';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const notify = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5161/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        notify('Registrazione avvenuta! Puoi ora fare login.', 'success');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        notify(data.message || 'Registrazione fallita', 'error');
      }
    } catch (err) {
      notify('Errore di rete', 'error');
    }
  };

  return (
    <div style={{minHeight:'100dvh',minWidth:'100vw',display:'flex',justifyContent:'center',alignItems:'center',background:'#f5f6fa'}}>
      <div style={{background:'#fff',padding:'2.5em 2em',borderRadius:'14px',boxShadow:'0 2px 24px #0002',width:'100%',maxWidth:400,display:'flex',flexDirection:'column',alignItems:'center'}}>
        <img src="/vite.svg" alt="Logo" style={{width:60,marginBottom:18}} />
        <h2 style={{textAlign:'center',marginBottom:'0.5em',color:'#2d3436',fontWeight:700}}>Crea un nuovo account</h2>
        <p style={{textAlign:'center',marginBottom:'1.5em',color:'#636e72',fontSize:'1em'}}>Compila i campi per registrarti</p>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1.2em',width:'100%'}} autoComplete="on">
          <div style={{display:'flex',flexDirection:'column',gap:4}}>
            <label htmlFor="email" style={{fontWeight:500,marginBottom:2}}>Email</label>
            <input id="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{padding:'0.7em',borderRadius:6,border:'1px solid #dfe6e9',outlineColor:'#0984e3'}} autoFocus />
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:4}}>
            <label htmlFor="password" style={{fontWeight:500,marginBottom:2}}>Password</label>
            <input id="password" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{padding:'0.7em',borderRadius:6,border:'1px solid #dfe6e9',outlineColor:'#0984e3'}} />
          </div>
          <button type="submit" style={{padding:'0.7em',borderRadius:6,border:'none',background:'#00b894',color:'#fff',fontWeight:'bold',cursor:'pointer',fontSize:'1.1em',marginTop:8}}>Registrati</button>
        </form>
        <p style={{marginTop:'1.5em',textAlign:'center',fontSize:'0.98em'}}>Hai già un account? <a href="/login" style={{color:'#0984e3',fontWeight:500,textDecoration:'underline'}}>Login</a></p>
      </div>
    </div>
  );
} 