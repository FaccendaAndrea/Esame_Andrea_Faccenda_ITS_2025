import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function StatistichePage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroAnno, setFiltroAnno] = useState('');
  const [filtroMese, setFiltroMese] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5161/api/statistiche/richieste', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) throw new Error('Errore nel caricamento statistiche');
      setStats(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const anni = Array.from(new Set(stats.map(s => s.anno))).sort((a,b)=>b-a);
  const mesi = Array.from(new Set(stats.map(s => s.mese))).sort((a,b)=>a-b);
  const categorie = Array.from(new Set(stats.map(s => s.categoria)));

  const filtered = stats.filter(s =>
    (!filtroAnno || s.anno === Number(filtroAnno)) &&
    (!filtroMese || s.mese === Number(filtroMese)) &&
    (!filtroCategoria || s.categoria === filtroCategoria)
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{minHeight:'100dvh',width:'100vw',height:'100dvh',background:'#f5f6fa',padding:0,margin:0,overflowX:'hidden'}}>
      <div style={{maxWidth:1300,minHeight:'100vh',margin:'0 auto',background:'#fff',borderRadius:0,boxShadow:'none',padding:'2.5em 2em',width:'100%',position:'relative'}}>
        <button onClick={handleLogout} style={{position:'absolute',top:24,right:32,background:'#d63031',color:'#fff',border:'none',borderRadius:6,padding:'0.6em 1.2em',fontWeight:600,fontSize:'1em',cursor:'pointer'}}>Logout</button>
        <div style={{fontWeight:800,fontSize:'2.2em',color:'#222',marginBottom:18}}>Area statistiche</div>
        <Menu navigate={navigate} />
        <h2 style={{fontWeight:700,color:'#111',marginBottom:8}}>Statistiche richieste di acquisto</h2>
        <div style={{display:'flex',gap:16,marginBottom:24}}>
          <select value={filtroAnno} onChange={e=>setFiltroAnno(e.target.value)} style={{padding:'0.7em',borderRadius:6,border:'1px solid #dfe6e9',background:'#fff',color:'#222',outlineColor:'#0984e3'}}>
            <option value="">Anno</option>
            {anni.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={filtroMese} onChange={e=>setFiltroMese(e.target.value)} style={{padding:'0.7em',borderRadius:6,border:'1px solid #dfe6e9',background:'#fff',color:'#222',outlineColor:'#0984e3'}}>
            <option value="">Mese</option>
            {mesi.map(m => <option key={m} value={m}>{m.toString().padStart(2,'0')}</option>)}
          </select>
          <select value={filtroCategoria} onChange={e=>setFiltroCategoria(e.target.value)} style={{padding:'0.7em',borderRadius:6,border:'1px solid #dfe6e9',background:'#fff',color:'#222',outlineColor:'#0984e3'}}>
            <option value="">Categoria</option>
            {categorie.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={()=>{setFiltroAnno('');setFiltroMese('');setFiltroCategoria('');}} style={{padding:'0.7em 1.5em',borderRadius:6,border:'none',background:'#b2bec3',color:'#fff',fontWeight:'bold',cursor:'pointer',fontSize:'1em'}}>Reset</button>
        </div>
        {error && <div style={{background:'#ffeaea',color:'#d63031',borderRadius:6,padding:'0.7em 1em',marginBottom:16}}>{error}</div>}
        {loading ? <div>Caricamento...</div> : (
          <table style={{width:'100%',borderCollapse:'collapse',marginTop:8,color:'#111'}}>
            <thead>
              <tr style={{background:'#f5f6fa'}}>
                <th style={{padding:'0.7em',textAlign:'left',color:'#636e72'}}>Anno</th>
                <th style={{padding:'0.7em',textAlign:'left',color:'#636e72'}}>Mese</th>
                <th style={{padding:'0.7em',textAlign:'left',color:'#636e72'}}>Categoria</th>
                <th style={{padding:'0.7em',textAlign:'left',color:'#636e72'}}>Numero richieste</th>
                <th style={{padding:'0.7em',textAlign:'left',color:'#636e72'}}>Totale quantità</th>
                <th style={{padding:'0.7em',textAlign:'left',color:'#636e72'}}>Totale spesa (€)</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s,i) => (
                <tr key={i} style={{borderBottom:'1px solid #eee',color:'#111'}}>
                  <td style={{padding:'0.7em'}}>{s.anno}</td>
                  <td style={{padding:'0.7em'}}>{s.mese.toString().padStart(2,'0')}</td>
                  <td style={{padding:'0.7em'}}>{s.categoria}</td>
                  <td style={{padding:'0.7em'}}>{s.numeroRichieste}</td>
                  <td style={{padding:'0.7em'}}>{s.totaleQuantita}</td>
                  <td style={{padding:'0.7em'}}>{s.totaleSpesa.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Menu({ navigate }) {
  const location = useLocation();
  return (
    <nav style={{display:'flex',gap:24,alignItems:'center',marginBottom:32,borderBottom:'1px solid #eee',paddingBottom:12}}>
      <button
        onClick={()=>navigate('/responsabile')}
        style={{
          background: location.pathname === '/responsabile' ? '#0984e3' : 'none',
          color: location.pathname === '/responsabile' ? '#fff' : '#0984e3',
          border:'none',fontWeight:600,fontSize:'1.1em',cursor:'pointer',borderRadius:6,padding:'0.4em 1.2em',transition:'background 0.2s,color 0.2s'
        }}
      >Dashboard</button>
      <button
        onClick={()=>navigate('/categorie')}
        style={{
          background: location.pathname === '/categorie' ? '#0984e3' : 'none',
          color: location.pathname === '/categorie' ? '#fff' : '#0984e3',
          border:'none',fontWeight:600,fontSize:'1.1em',cursor:'pointer',borderRadius:6,padding:'0.4em 1.2em',transition:'background 0.2s,color 0.2s'
        }}
      >Categorie</button>
      <button
        onClick={()=>navigate('/statistiche')}
        style={{
          background: location.pathname === '/statistiche' ? '#0984e3' : 'none',
          color: location.pathname === '/statistiche' ? '#fff' : '#0984e3',
          border:'none',fontWeight:600,fontSize:'1.1em',cursor:'pointer',borderRadius:6,padding:'0.4em 1.2em',transition:'background 0.2s,color 0.2s'
        }}
      >Statistiche</button>
    </nav>
  );
} 