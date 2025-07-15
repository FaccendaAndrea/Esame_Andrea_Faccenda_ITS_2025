import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotification } from '../App';

export default function ResponsabileDashboard() {
  const [richieste, setRichieste] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [categorie, setCategorie] = useState([]);
  const [filtroOggetto, setFiltroOggetto] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroStato, setFiltroStato] = useState('');
  const [filtroDipendente, setFiltroDipendente] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const notify = useNotification();

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

  useEffect(() => {
    fetchRichieste();
    fetch('http://localhost:5161/api/categorie', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(r => r.json())
      .then(setCategorie);
  }, []);

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
      notify(tipo === 'approva' ? 'Richiesta approvata!' : 'Richiesta rifiutata!', tipo === 'approva' ? 'success' : 'error');
    } catch (e) {
      setError(e.message);
      notify(e.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div style={{minHeight:'100dvh',width:'100vw',height:'100dvh',background:'#f5f6fa',padding:0,margin:0,overflowX:'hidden'}}>
      <div style={{maxWidth:1300,minHeight:'100vh',margin:'0 auto',background:'#fff',borderRadius:0,boxShadow:'none',padding:'2.5em 2em',width:'100%',position:'relative'}}>
        <div style={{fontWeight:800,fontSize:'2.2em',color:'#222',marginBottom:18}}>
          Benvenuto/a, {user.nome} {user.cognome}
        </div>
        <Menu navigate={navigate} />
        <button onClick={handleLogout} style={{position:'absolute',top:24,right:32,background:'#d63031',color:'#fff',border:'none',borderRadius:6,padding:'0.6em 1.2em',fontWeight:600,fontSize:'1em',cursor:'pointer'}}>Logout</button>
        <h2 style={{fontWeight:700,color:'#111',marginBottom:8}}>Gestione richieste di acquisto</h2>
        <div style={{display:'flex',gap:16,marginBottom:18}}>
          <input
            type="text"
            placeholder="Cerca per oggetto..."
            value={filtroOggetto}
            onChange={e => setFiltroOggetto(e.target.value)}
            style={{padding:'0.7em',borderRadius:6,border:'1px solid #dfe6e9',background:'#fff',color:'#222',outlineColor:'#0984e3',minWidth:180}}
          />
          <select
            value={filtroCategoria}
            onChange={e => setFiltroCategoria(e.target.value)}
            style={{padding:'0.7em',borderRadius:6,border:'1px solid #dfe6e9',background:'#fff',color:'#222',outlineColor:'#0984e3'}}
          >
            <option value="">Tutte le categorie</option>
            {categorie.map(c => (
              <option key={c.categoriaId} value={c.categoriaId}>{c.descrizione}</option>
            ))}
          </select>
          <select
            value={filtroStato}
            onChange={e => setFiltroStato(e.target.value)}
            style={{padding:'0.7em',borderRadius:6,border:'1px solid #dfe6e9',background:'#fff',color:'#222',outlineColor:'#0984e3'}}
          >
            <option value="">Tutti gli stati</option>
            <option value="In attesa">In attesa</option>
            <option value="Approvata">Approvata</option>
            <option value="Rifiutata">Rifiutata</option>
          </select>
          <input
            type="text"
            placeholder="Cerca dipendente..."
            value={filtroDipendente}
            onChange={e => setFiltroDipendente(e.target.value)}
            style={{padding:'0.7em',borderRadius:6,border:'1px solid #dfe6e9',background:'#fff',color:'#222',outlineColor:'#0984e3',minWidth:180}}
          />
          <button
            onClick={()=>{setFiltroOggetto('');setFiltroCategoria('');setFiltroStato('');setFiltroDipendente('');}}
            style={{padding:'0.7em 1.5em',borderRadius:6,border:'none',background:'#b2bec3',color:'#fff',fontWeight:'bold',cursor:'pointer',fontSize:'1em'}}
          >Reset</button>
        </div>
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
              {richieste
                .filter(r =>
                  (!filtroOggetto || r.oggetto.toLowerCase().includes(filtroOggetto.toLowerCase())) &&
                  (!filtroCategoria || String(r.categoria?.categoriaId) === filtroCategoria) &&
                  (!filtroStato || r.stato === filtroStato) &&
                  (!filtroDipendente || ((r.utente?.nome + ' ' + r.utente?.cognome).toLowerCase().includes(filtroDipendente.toLowerCase())))
                )
                .map(r => (
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
                    <button onClick={()=>navigate(`/richieste/${r.richiestaId}`)} style={{background:'#636e72',color:'#fff',border:'none',borderRadius:6,padding:'0.4em 1em',fontWeight:500,cursor:'pointer'}}>Dettaglio</button>
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