import { useNavigate } from 'react-router-dom';
import * as jwt_decode from 'jwt-decode';

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let email = '';
  try {
    if (token) {
      const decoded = jwt_decode.default(token);
      email = decoded.email || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || '';
    }
  } catch {}

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{minHeight:'100dvh',minWidth:'100vw',display:'flex',flexDirection:'column',background:'#f5f6fa'}}>
      <header style={{padding:'2em 0 1em 0',textAlign:'center',background:'#0984e3',color:'#fff',boxShadow:'0 2px 8px #0001'}}>
        <h1 style={{margin:0,fontWeight:700,fontSize:'2.2rem'}}>Benvenuto{email ? `, ${email}` : ''}!</h1>
        <p style={{marginTop:'0.5em',fontSize:'1.1rem'}}>Hai effettuato l'accesso con successo.</p>
      </header>
      <main style={{flex:1,display:'flex',justifyContent:'center',alignItems:'center'}}>
        <div style={{background:'#fff',padding:'2em',borderRadius:'12px',boxShadow:'0 2px 16px #0002',width:'100%',maxWidth:500}}>
          <h2 style={{textAlign:'center',color:'#2d3436',marginBottom:'1em'}}>Token JWT</h2>
          <div style={{background:'#dfe6e9',padding:'1em',borderRadius:6,wordBreak:'break-all',margin:'1em 0',fontSize:'0.9em',maxHeight:'30vh',overflow:'auto'}}>{token}</div>
          <button onClick={handleLogout} style={{width:'100%',padding:'0.7em',borderRadius:6,border:'none',background:'#d63031',color:'#fff',fontWeight:'bold',cursor:'pointer',marginTop:'1em'}}>Logout</button>
        </div>
      </main>
      <footer style={{textAlign:'center',padding:'1em 0',color:'#636e72',fontSize:'0.95em'}}>Template Esame &copy; {new Date().getFullYear()} - Andrea Faccenda</footer>
    </div>
  );
} 