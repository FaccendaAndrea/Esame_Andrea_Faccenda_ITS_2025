import { useEffect, useState } from 'react';
import RichiestaForm from '../components/RichiestaForm';

export default function DipendenteDashboard() {
  const [richieste, setRichieste] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

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

  const handleDelete = async (id) => {
    if (!window.confirm('Sei sicuro di voler eliminare questa richiesta?')) return;
    try {
      const res = await fetch(`http://localhost:5161/api/richieste/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) throw new Error('Impossibile eliminare la richiesta');
      fetchRichieste();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div style={{minHeight:'100dvh',background:'#f5f6fa',width:'100vw',height:'100dvh',padding:0,margin:0}}>
      <div style={{width:'100vw',height:'100dvh',background:'#fff',borderRadius:0,boxShadow:'none',padding:'2.5em 2em',margin:0}}>
        <h2 style={{fontWeight:700,color:'#111',marginBottom:8}}>Le tue richieste di acquisto</h2>
        <button onClick={()=>{setEditing(null);setShowForm(true);}} style={{background:'#0984e3',color:'#fff',border:'none',borderRadius:6,padding:'0.7em 1.5em',fontWeight:600,fontSize:'1em',marginBottom:24,cursor:'pointer'}}>Nuova richiesta</button>
        {showForm && (
          <RichiestaForm onSuccess={()=>{setShowForm(false);fetchRichieste();}} onCancel={()=>setShowForm(false)} richiesta={editing} />
        )}
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {richieste.map(r => (
                <tr key={r.richiestaId} style={{borderBottom:'1px solid #eee',color:'#111'}}>
                  <td style={{padding:'0.7em'}}>{new Date(r.dataRichiesta).toLocaleDateString()}</td>
                  <td style={{padding:'0.7em'}}>{r.categoria?.descrizione}</td>
                  <td style={{padding:'0.7em'}}>{r.oggetto}</td>
                  <td style={{padding:'0.7em'}}>{r.quantita}</td>
                  <td style={{padding:'0.7em'}}>{r.costoUnitario.toFixed(2)} €</td>
                  <td style={{padding:'0.7em'}}>{r.stato}</td>
                  <td style={{padding:'0.7em',display:'flex',gap:8}}>
                    {r.stato === 'In attesa' && <>
                      <button onClick={()=>{setEditing(r);setShowForm(true);}} style={{background:'#00b894',color:'#fff',border:'none',borderRadius:6,padding:'0.4em 1em',fontWeight:500,cursor:'pointer'}}>Modifica</button>
                      <button onClick={()=>handleDelete(r.richiestaId)} style={{background:'#d63031',color:'#fff',border:'none',borderRadius:6,padding:'0.4em 1em',fontWeight:500,cursor:'pointer'}}>Elimina</button>
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