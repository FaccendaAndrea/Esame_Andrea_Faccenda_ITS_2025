import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../App';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  // const notify = useNotification();

  function validatePassword(pw) {
    const errors = [];
    if (pw.length < 6) errors.push('Almeno 6 caratteri');
    if (!/[A-Z]/.test(pw)) errors.push('Almeno una lettera maiuscola');
    if (!/[a-z]/.test(pw)) errors.push('Almeno una lettera minuscola');
    if (!/[0-9]/.test(pw)) errors.push('Almeno un numero');
    if (!/[^A-Za-z0-9]/.test(pw)) errors.push('Almeno un carattere speciale');
    return errors;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = [];
    if (!email) newErrors.push('Inserisci l\'email');
    if (!password) newErrors.push('Inserisci la password');
    else newErrors.push(...validatePassword(password));
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors([]);
    try {
      const res = await fetch('http://localhost:5161/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // notify('Login effettuato con successo!', 'success');
        if (data.user.ruolo === 'Responsabile') navigate('/responsabile');
        else if (data.user.ruolo === 'Dipendente') navigate('/dipendente');
        else navigate('/');
      } else {
        setErrors([data.message || 'Login fallito']);
      }
    } catch (err) {
      setErrors(['Errore di rete']);
    }
  };

  return (
    <div style={{minHeight:'100dvh',minWidth:'100vw',display:'flex',justifyContent:'center',alignItems:'center',background:'#f5f6fa'}}>
      <div style={{background:'#fff',padding:'2.5em 2em',borderRadius:'14px',boxShadow:'0 2px 24px #0002',width:'100%',maxWidth:400,display:'flex',flexDirection:'column',alignItems:'center'}}>
        <img src="/vite.svg" alt="Logo" style={{width:60,marginBottom:18}} />
        <h2 style={{textAlign:'center',marginBottom:'0.5em',color:'#2d3436',fontWeight:700}}>Accedi al tuo account</h2>
        <p style={{textAlign:'center',marginBottom:'1.5em',color:'#636e72',fontSize:'1em'}}>Inserisci le tue credenziali per continuare</p>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1.2em',width:'100%'}} autoComplete="on">
          {errors.length > 0 && (
            <div style={{background:'none',color:'#d63031',borderRadius:6,padding:'0.7em 1em',marginBottom:8,fontSize:'0.98em',fontWeight:500}}>
              <ul style={{margin:0,paddingLeft:18}}>
                {errors.map((err,i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}
          <div style={{display:'flex',flexDirection:'column',gap:4}}>
            <label htmlFor="email" style={{fontWeight:500,marginBottom:2}}>Email</label>
            <input id="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{padding:'0.7em',borderRadius:6,border:'1px solid #dfe6e9',outline:'none',background:'#fff',color:'#222'}} autoFocus onFocus={e=>e.target.style.border='1px solid #0984e3'} onBlur={e=>e.target.style.border='1px solid #dfe6e9'} />
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:4}}>
            <label htmlFor="password" style={{fontWeight:500,marginBottom:2}}>Password</label>
            <input id="password" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{padding:'0.7em',borderRadius:6,border:'1px solid #dfe6e9',outline:'none',background:'#fff',color:'#222'}} onFocus={e=>e.target.style.border='1px solid #0984e3'} onBlur={e=>e.target.style.border='1px solid #dfe6e9'} />
          </div>
          <button type="submit" style={{padding:'0.7em',borderRadius:6,border:'none',background:'#0984e3',color:'#fff',fontWeight:'bold',cursor:'pointer',fontSize:'1.1em',marginTop:8}}>Login</button>
        </form>
        <p style={{marginTop:'1.5em',textAlign:'center',fontSize:'0.98em'}}>Non hai un account? <a href="/register" style={{color:'#0984e3',fontWeight:500,textDecoration:'underline'}}>Registrati</a></p>
      </div>
    </div>
  );
} 