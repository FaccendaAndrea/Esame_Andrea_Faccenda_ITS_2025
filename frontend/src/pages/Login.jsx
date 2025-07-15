import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../App';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const notify = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5161/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        notify('Login effettuato con successo!', 'success');
        navigate('/');
      } else {
        notify(data.message || 'Login fallito', 'error');
      }
    } catch (err) {
      notify('Errore di rete', 'error');
    }
  };

  return (
    <div style={{minHeight:'100dvh',minWidth:'100vw',display:'flex',justifyContent:'center',alignItems:'center',background:'#f5f6fa'}}>
      <div style={{background:'#fff',padding:'2.5em 2em',borderRadius:'14px',boxShadow:'0 2px 24px #0002',width:'100%',maxWidth:400,display:'flex',flexDirection:'column',alignItems:'center'}}>
        <img src="/vite.svg" alt="Logo" style={{width:60,marginBottom:18}} />
        <h2 style={{textAlign:'center',marginBottom:'0.5em',color:'#2d3436',fontWeight:700}}>Accedi al tuo account</h2>
        <p style={{textAlign:'center',marginBottom:'1.5em',color:'#636e72',fontSize:'1em'}}>Inserisci le tue credenziali per continuare</p>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1.2em',width:'100%'}} autoComplete="on">
          <div style={{display:'flex',flexDirection:'column',gap:4}}>
            <label htmlFor="email" style={{fontWeight:500,marginBottom:2}}>Email</label>
            <input id="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{padding:'0.7em',borderRadius:6,border:'1px solid #dfe6e9',outlineColor:'#0984e3'}} autoFocus />
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:4}}>
            <label htmlFor="password" style={{fontWeight:500,marginBottom:2}}>Password</label>
            <input id="password" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{padding:'0.7em',borderRadius:6,border:'1px solid #dfe6e9',outlineColor:'#0984e3'}} />
          </div>
          <button type="submit" style={{padding:'0.7em',borderRadius:6,border:'none',background:'#0984e3',color:'#fff',fontWeight:'bold',cursor:'pointer',fontSize:'1.1em',marginTop:8}}>Login</button>
        </form>
        <p style={{marginTop:'1.5em',textAlign:'center',fontSize:'0.98em'}}>Non hai un account? <a href="/register" style={{color:'#0984e3',fontWeight:500,textDecoration:'underline'}}>Registrati</a></p>
      </div>
    </div>
  );
} 