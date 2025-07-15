import { useEffect, useState } from 'react';

export default function RichiestaForm({ onSuccess, onCancel, richiesta, titolo }) {
  const [categorie, setCategorie] = useState([]);
  const [form, setForm] = useState({
    categoriaId: richiesta?.categoriaId || richiesta?.categoria?.categoriaId || '',
    oggetto: richiesta?.oggetto || '',
    quantita: richiesta?.quantita || 1,
    costoUnitario: richiesta?.costoUnitario || '',
    motivazione: richiesta?.motivazione || ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:5161/api/categorie')
      .then(r => r.json())
      .then(setCategorie);
  }, []);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    if (!form.categoriaId || !form.oggetto || !form.quantita || !form.costoUnitario) {
      setError('Tutti i campi obbligatori vanno compilati');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5161/api/richieste${richiesta ? '/' + richiesta.richiestaId : ''}`, {
        method: richiesta ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          categoriaId: Number(form.categoriaId),
          oggetto: form.oggetto,
          quantita: Number(form.quantita),
          costoUnitario: Number(form.costoUnitario),
          motivazione: form.motivazione
        })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Errore salvataggio richiesta');
      }
      onSuccess && onSuccess();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{background:'#f9fafb',border:'1px solid #eee',borderRadius:10,padding:'1.5em',marginBottom:24}}>
      <h3 style={{marginTop:0,marginBottom:18,color:'#111',fontWeight:600}}>{titolo || (richiesta ? 'Modifica richiesta' : 'Nuova richiesta')}</h3>
      {error && <div style={{background:'#ffeaea',color:'#d63031',borderRadius:6,padding:'0.7em 1em',marginBottom:12}}>{error}</div>}
      <form onSubmit={handleSubmit} style={{display:'flex',flexWrap:'wrap',gap:'1.5em 2em',alignItems:'flex-end',color:'#111'}}>
        <div style={{flex:'1 1 180px',display:'flex',flexDirection:'column',gap:4}}>
          <label style={{fontWeight:500,marginBottom:2,color:'#111'}}>Categoria*</label>
          <select name="categoriaId" value={form.categoriaId} onChange={handleChange} required style={{padding:'0.7em',borderRadius:6,border:'1px solid #dfe6e9',background:'#fff',color:'#222',outlineColor:'#0984e3'}}>
            <option value="">Seleziona...</option>
            {categorie.map(c => <option key={c.categoriaId} value={c.categoriaId}>{c.descrizione}</option>)}
          </select>
        </div>
        <div style={{flex:'2 1 220px',display:'flex',flexDirection:'column',gap:4}}>
          <label style={{fontWeight:500,marginBottom:2,color:'#111'}}>Oggetto*</label>
          <input name="oggetto" value={form.oggetto} onChange={handleChange} required style={{padding:'0.7em',borderRadius:6,border:'1px solid #dfe6e9',background:'#fff',color:'#222',outlineColor:'#0984e3'}} />
        </div>
        <div style={{flex:'1 1 100px',display:'flex',flexDirection:'column',gap:4}}>
          <label style={{fontWeight:500,marginBottom:2,color:'#111'}}>Quantità*</label>
          <input name="quantita" type="number" min={1} value={form.quantita} onChange={handleChange} required style={{padding:'0.7em',borderRadius:6,border:'1px solid #dfe6e9',background:'#fff',color:'#222',outlineColor:'#0984e3'}} />
        </div>
        <div style={{flex:'1 1 120px',display:'flex',flexDirection:'column',gap:4}}>
          <label style={{fontWeight:500,marginBottom:2,color:'#111'}}>Costo unitario (€)*</label>
          <input name="costoUnitario" type="number" min={0.01} step={0.01} value={form.costoUnitario} onChange={handleChange} required style={{padding:'0.7em',borderRadius:6,border:'1px solid #dfe6e9',background:'#fff',color:'#222',outlineColor:'#0984e3'}} />
        </div>
        <div style={{flex:'2 1 220px',display:'flex',flexDirection:'column',gap:4}}>
          <label style={{fontWeight:500,marginBottom:2,color:'#111'}}>Motivazione</label>
          <input name="motivazione" value={form.motivazione} onChange={handleChange} style={{padding:'0.7em',borderRadius:6,border:'1px solid #dfe6e9',background:'#fff',color:'#222',outlineColor:'#0984e3'}} />
        </div>
        <div style={{display:'flex',gap:10,marginTop:8}}>
          <button type="submit" disabled={loading} style={{padding:'0.7em 1.5em',borderRadius:6,border:'none',background:'#0984e3',color:'#fff',fontWeight:'bold',cursor:'pointer',fontSize:'1em'}}>{richiesta ? 'Salva' : 'Crea'}</button>
          <button type="button" onClick={onCancel} style={{padding:'0.7em 1.5em',borderRadius:6,border:'none',background:'#b2bec3',color:'#fff',fontWeight:'bold',cursor:'pointer',fontSize:'1em'}}>Annulla</button>
        </div>
      </form>
    </div>
  );
} 