import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ResponsabileDashboard() {
  const [richieste, setRichieste] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  async function fetchRichieste() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5161/api/richieste', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) throw new Error('Errore nel caricamento richieste');
      setRichieste(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchRichieste(); }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleAzione = async (id, tipo) => {
    setActionLoading(id + tipo);
    try {
      const res = await fetch(`http://localhost:5161/api/richieste/${id}/${tipo}`, {
        method: 'PUT',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) throw new Error('Errore nell\'operazione');
      fetchRichieste();
    } catch (e) {
      setError(e.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div style={{minHeight:'100dvh',width:'100vw',height:'100dvh',background:'#f5f6fa',padding:0,margin:0,overflowX:'hidden'}}>
      <div style={{maxWidth:1300,minHeight:'100vh',margin:'0 auto',background:'#fff',borderRadius:0,boxShadow:'none',padding:'2.5em 2em',width:'100%',position:'relative'}}>
        <button onClick={handleLogout} style={{position:'absolute',top:24,right:32,background:'#d63031',color:'#fff',border:'none',borderRadius:6,padding:'0.6em 1.2em',fontWeight:600,fontSize:'1em',cursor:'pointer'}}>Logout</button>
        <h2 style={{fontWeight:700,color:'#111',marginBottom:8}}>Gestione richieste di acquisto</h2>
        {error && <div style={{background:'#ffeaea',color:'#d63031',borderRadius:6,padding:'0.7em 1em',marginBottom:16}}>{error}</div>}
        {loading ? <div>Caricamento...</div> : (
          <table style={{width:'100%',borderCollapse:'collapse',marginTop:8,color:'#111'}}>
            <thead>
              <tr style={{background:'#f5f6fa'}}>
                <th style={{padding:'0.7em',textAlign:'left',color:'#636e72'}}>Data</th>
                <th style={{padding:'0.7em',textAlign:'left',color:'#636e72'}}>Categoria</th>
                <th style={{padding:'0.7em',textAlign:'left',color:'#636e72'}}>Oggetto</th>
                <th style={{padding:'0.7em',textAlign:'left',color:'#636e72'}}>Quantità</th>
                <th style={{padding:'0.7em',textAlign:'left',color:'#636e72'}}>Costo</th>
                <th style={{padding:'0.7em',textAlign:'left',color:'#636e72'}}>Stato</th>
                <th style={{padding:'0.7em',textAlign:'left',color:'#636e72'}}>Dipendente</th>
                <th style={{padding:'0.7em',textAlign:'left',color:'#636e72'}}>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {richieste.map(r => (
                <tr key={r.richiestaId} 
                  style={{
                    borderBottom:'1px solid #eee',
                    color:'#111',
                    background: r.stato === 'Rifiutata' ? '#ffeaea' : r.stato === 'Approvata' ? '#eafaf1' : r.stato === 'In attesa' ? '#fffbe6' : undefined
                  }}>
                  <td style={{padding:'0.7em'}}>{new Date(r.dataRichiesta).toLocaleDateString()}</td>
                  <td style={{padding:'0.7em'}}>{r.categoria?.descrizione}</td>
                  <td style={{padding:'0.7em'}}>{r.oggetto}</td>
                  <td style={{padding:'0.7em'}}>{r.quantita}</td>
                  <td style={{padding:'0.7em'}}>{r.costoUnitario.toFixed(2)} €</td>
                  <td style={{padding:'0.7em'}}>{r.stato}</td>
                  <td style={{padding:'0.7em'}}>{r.utente?.nome} {r.utente?.cognome}</td>
                  <td style={{padding:'0.7em',display:'flex',gap:8}}>
                    {r.stato === 'In attesa' && <>
                      <button onClick={()=>handleAzione(r.richiestaId,'approva')} disabled={actionLoading===r.richiestaId+'approva'} style={{background:'#00b894',color:'#fff',border:'none',borderRadius:6,padding:'0.4em 1em',fontWeight:500,cursor:'pointer'}}>Approva</button>
                      <button onClick={()=>handleAzione(r.richiestaId,'rifiuta')} disabled={actionLoading===r.richiestaId+'rifiuta'} style={{background:'#d63031',color:'#fff',border:'none',borderRadius:6,padding:'0.4em 1em',fontWeight:500,cursor:'pointer'}}>Rifiuta</button>
                    </>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 