import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GestioneCategorie() {
  const [categorie, setCategorie] = useState([]);
  const [descrizione, setDescrizione] = useState('');
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  async function fetchCategorie() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5161/api/categorie', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) throw new Error('Errore nel caricamento categorie');
      setCategorie(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchCategorie(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`http://localhost:5161/api/categorie${editing ? '/' + editing.categoriaId : ''}`, {
        method: editing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ descrizione })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Errore salvataggio categoria');
      setDescrizione('');
      setEditing(null);
      fetchCategorie();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleEdit = (cat) => {
    setEditing(cat);
    setDescrizione(cat.descrizione);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminare questa categoria?')) return;
    setError(null);
    try {
      const res = await fetch(`http://localhost:5161/api/categorie/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Errore eliminazione categoria');
      fetchCategorie();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div style={{minHeight:'100dvh',width:'100vw',height:'100dvh',background:'#f5f6fa',padding:0,margin:0,overflowX:'hidden'}}>
      <div style={{maxWidth:700,minHeight:'100vh',margin:'0 auto',background:'#fff',borderRadius:0,boxShadow:'none',padding:'2.5em 2em',width:'100%',position:'relative'}}>
        <Menu navigate={navigate} />
        <h2 style={{fontWeight:700,color:'#111',marginBottom:8}}>Gestione categorie</h2>
        {error && <div style={{background:'#ffeaea',color:'#d63031',borderRadius:6,padding:'0.7em 1em',marginBottom:16}}>{error}</div>}
        <form onSubmit={handleSubmit} style={{display:'flex',gap:12,marginBottom:24,alignItems:'flex-end'}}>
          <div style={{flex:1,display:'flex',flexDirection:'column',gap:4}}>
            <label style={{fontWeight:500,marginBottom:2,color:'#111'}}>Descrizione categoria</label>
            <input value={descrizione} onChange={e=>setDescrizione(e.target.value)} required style={{padding:'0.7em',borderRadius:6,border:'1px solid #dfe6e9',background:'#fff',color:'#222',outlineColor:'#0984e3'}} />
          </div>
          <button type="submit" style={{padding:'0.7em 1.5em',borderRadius:6,border:'none',background:'#0984e3',color:'#fff',fontWeight:'bold',cursor:'pointer',fontSize:'1em'}}>{editing ? 'Salva' : 'Aggiungi'}</button>
          {editing && <button type="button" onClick={()=>{setEditing(null);setDescrizione('');}} style={{padding:'0.7em 1.5em',borderRadius:6,border:'none',background:'#b2bec3',color:'#fff',fontWeight:'bold',cursor:'pointer',fontSize:'1em'}}>Annulla</button>}
        </form>
        {loading ? <div>Caricamento...</div> : (
          <table style={{width:'100%',borderCollapse:'collapse',marginTop:8,color:'#111'}}>
            <thead>
              <tr style={{background:'#f5f6fa'}}>
                <th style={{padding:'0.7em',textAlign:'left',color:'#636e72'}}>ID</th>
                <th style={{padding:'0.7em',textAlign:'left',color:'#636e72'}}>Descrizione</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categorie.map(cat => (
                <tr key={cat.categoriaId} style={{borderBottom:'1px solid #eee',color:'#111'}}>
                  <td style={{padding:'0.7em'}}>{cat.categoriaId}</td>
                  <td style={{padding:'0.7em'}}>{cat.descrizione}</td>
                  <td style={{padding:'0.7em',display:'flex',gap:8}}>
                    <button onClick={()=>handleEdit(cat)} style={{background:'#00b894',color:'#fff',border:'none',borderRadius:6,padding:'0.4em 1em',fontWeight:500,cursor:'pointer'}}>Modifica</button>
                    <button onClick={()=>handleDelete(cat.categoriaId)} style={{background:'#d63031',color:'#fff',border:'none',borderRadius:6,padding:'0.4em 1em',fontWeight:500,cursor:'pointer'}}>Elimina</button>
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
  return (
    <nav style={{display:'flex',gap:24,alignItems:'center',marginBottom:32,borderBottom:'1px solid #eee',paddingBottom:12}}>
      <button onClick={()=>navigate('/responsabile')} style={{background:'none',border:'none',color:'#0984e3',fontWeight:600,fontSize:'1.1em',cursor:'pointer'}}>Dashboard</button>
      <button onClick={()=>navigate('/categorie')} style={{background:'none',border:'none',color:'#0984e3',fontWeight:600,fontSize:'1.1em',cursor:'pointer'}}>Categorie</button>
      <button onClick={()=>navigate('/statistiche')} style={{background:'none',border:'none',color:'#0984e3',fontWeight:600,fontSize:'1.1em',cursor:'pointer'}}>Statistiche</button>
    </nav>
  );
} 