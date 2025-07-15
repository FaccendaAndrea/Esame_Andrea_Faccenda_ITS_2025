import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../App';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [ruolo, setRuolo] = useState('Dipendente');
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const notify = useNotification();

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
    if (password !== password2) newErrors.push('Le password non coincidono');
    newErrors.push(...validatePassword(password));
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors([]);
    try {
      const res = await fetch('http://localhost:5161/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nome, cognome, ruolo })
      });
      const data = await res.json();
      if (res.ok) {
        notify('Registrazione avvenuta! Puoi ora fare login.', 'success');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setErrors([data.message || 'Registrazione fallita']);
      }
    } catch (err) {
      setErrors(['Errore di rete']);
    }
  };

  return (
    <div style={{minHeight:'100dvh',minWidth:'100vw',display:'flex',justifyContent:'center',alignItems:'center',background:'#f5f6fa'}}>
      <div style={{background:'#fff',padding:'2.5em 2em',borderRadius:'14px',boxShadow:'0 2px 24px #0002',width:'100%',maxWidth:400,display:'flex',flexDirection:'column',alignItems:'center'}}>
        <img src="/vite.svg" alt="Logo" style={{width:60,marginBottom:18}} />
        <h2 style={{textAlign:'center',marginBottom:'0.5em',color:'#2d3436',fontWeight:700}}>Crea un nuovo account</h2>
        <p style={{textAlign:'center',marginBottom:'1.5em',color:'#636e72',fontSize:'1em'}}>Compila i campi per registrarti</p>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1.2em',width:'100%'}} autoComplete="on">
          {errors.length > 0 && (
            <div style={{background:'#ffeaea',color:'#d63031',borderRadius:6,padding:'0.7em 1em',marginBottom:8,fontSize:'0.98em',boxShadow:'0 1px 4px #0001'}}>
              <ul style={{margin:0,paddingLeft:18}}>
                {errors.map((err,i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}
          <div style={{display:'flex',flexDirection:'column',gap:4}}>
            <label htmlFor="nome" style={{fontWeight:500,marginBottom:2}}>Nome</label>
            <input id="nome" type="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required style={{padding:'0.7em',borderRadius:6,border:'1px solid #dfe6e9',outlineColor:'#0984e3',background:'#fff',color:'#222'}} />
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:4}}>
            <label htmlFor="cognome" style={{fontWeight:500,marginBottom:2}}>Cognome</label>
            <input id="cognome" type="text" placeholder="Cognome" value={cognome} onChange={e => setCognome(e.target.value)} required style={{padding:'0.7em',borderRadius:6,border:'1px solid #dfe6e9',outlineColor:'#0984e3',background:'#fff',color:'#222'}} />
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:4}}>
            <label htmlFor="email" style={{fontWeight:500,marginBottom:2}}>Email</label>
            <input id="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{padding:'0.7em',borderRadius:6,border:'1px solid #dfe6e9',outlineColor:'#0984e3',background:'#fff',color:'#222'}} autoFocus />
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:4}}>
            <label htmlFor="password" style={{fontWeight:500,marginBottom:2}}>Password</label>
            <input id="password" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{padding:'0.7em',borderRadius:6,border:'1px solid #dfe6e9',outlineColor:'#0984e3',background:'#fff',color:'#222'}} />
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:4}}>
            <label htmlFor="password2" style={{fontWeight:500,marginBottom:2}}>Conferma password</label>
            <input id="password2" type="password" placeholder="Ripeti password" value={password2} onChange={e => setPassword2(e.target.value)} required style={{padding:'0.7em',borderRadius:6,border:'1px solid #dfe6e9',outlineColor:'#0984e3',background:'#fff',color:'#222'}} />
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:4}}>
            <label htmlFor="ruolo" style={{fontWeight:500,marginBottom:2}}>Ruolo</label>
            <select id="ruolo" value={ruolo} onChange={e => setRuolo(e.target.value)} required style={{padding:'0.7em',borderRadius:6,border:'1px solid #dfe6e9',outlineColor:'#0984e3',background:'#fff',color:'#222'}}>
              <option value="Dipendente">Dipendente</option>
              <option value="Responsabile">Responsabile</option>
            </select>
          </div>
          <button type="submit" style={{padding:'0.7em',borderRadius:6,border:'none',background:'#00b894',color:'#fff',fontWeight:'bold',cursor:'pointer',fontSize:'1.1em',marginTop:8}}>Registrati</button>
        </form>
        <p style={{marginTop:'1.5em',textAlign:'center',fontSize:'0.98em'}}>Hai già un account? <a href="/login" style={{color:'#0984e3',fontWeight:500,textDecoration:'underline'}}>Login</a></p>
      </div>
    </div>
  );
} 