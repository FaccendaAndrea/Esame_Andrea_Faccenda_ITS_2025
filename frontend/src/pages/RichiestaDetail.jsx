import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function RichiestaDetail() {
  const { id } = useParams();
  const [richiesta, setRichiesta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchRichiesta() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5161/api/richieste/${id}`, {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!res.ok) throw new Error('Richiesta non trovata o non autorizzato');
        setRichiesta(await res.json());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRichiesta();
  }, [id]);

  if (loading) return <div style={{padding:'2em'}}>Caricamento...</div>;
  if (error) return <div style={{padding:'2em',color:'#d63031'}}>{error}</div>;
  if (!richiesta) return null;

  return (
    <div style={{minHeight:'100dvh',background:'#f5f6fa',padding:'2em 0'}}>
      <div style={{maxWidth:600,margin:'0 auto',background:'#fff',borderRadius:14,boxShadow:'0 2px 24px #0002',padding:'2.5em 2em'}}>
        <h2 style={{fontWeight:700,color:'#2d3436',marginBottom:18}}>Dettaglio richiesta</h2>
        <div style={{display:'flex',flexDirection:'column',gap:18}}>
          <Info label="Data richiesta" value={new Date(richiesta.dataRichiesta).toLocaleDateString()} />
          <Info label="Categoria" value={richiesta.categoria?.descrizione} />
          <Info label="Oggetto" value={richiesta.oggetto} />
          <Info label="Quantità" value={richiesta.quantita} />
          <Info label="Costo unitario" value={richiesta.costoUnitario.toFixed(2) + ' €'} />
          <Info label="Motivazione" value={richiesta.motivazione || '-'} />
          <Info label="Stato" value={richiesta.stato} />
          <Info label="Approvata da" value={richiesta.utenteApprovazione?.nome ? `${richiesta.utenteApprovazione.nome} ${richiesta.utenteApprovazione.cognome}` : '-'} />
          <Info label="Data approvazione" value={richiesta.dataApprovazione ? new Date(richiesta.dataApprovazione).toLocaleDateString() : '-'} />
        </div>
        <button onClick={()=>navigate(-1)} style={{marginTop:32,padding:'0.7em 1.5em',borderRadius:6,border:'none',background:'#b2bec3',color:'#fff',fontWeight:'bold',cursor:'pointer',fontSize:'1em'}}>Torna indietro</button>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <span style={{color:'#636e72',fontWeight:500}}>{label}</span>
      <span style={{color:'#222',fontWeight:600}}>{value}</span>
    </div>
  );
} 