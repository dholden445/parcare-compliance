import React, { useState } from 'react';

const INIT_CONTRACTS = [
  {id:'c1',name:'eClinicalWorks EHR Agreement',vendor:'eClinicalWorks',type:'Vendor Contract',start:'Jan 1, 2026',expiry:'Dec 31, 2026',status:'Current',contact:'support@eclinicalworks.com'},
  {id:'c2',name:'Healthix HIE Participation Agreement',vendor:'Healthix',type:'Vendor Contract',start:'Feb 1, 2026',expiry:'Jan 31, 2027',status:'Current',contact:'info@healthix.org'},
  {id:'c3',name:'Lab Services Agreement — Quest Diagnostics',vendor:'Quest Diagnostics',type:'Vendor Contract',start:'Jan 1, 2026',expiry:'Dec 31, 2026',status:'Current',contact:''},
  {id:'c4',name:'Medical Waste Disposal Services',vendor:'BioMedical Systems',type:'Vendor Contract',start:'Jan 1, 2025',expiry:'Dec 31, 2025',status:'Expired',contact:''},
  {id:'c5',name:'BAA — eClinicalWorks',vendor:'eClinicalWorks',type:'Business Associate Agreement',start:'Jan 1, 2026',expiry:'Dec 31, 2026',status:'Current',contact:''},
  {id:'c6',name:'BAA — Ahava Medical',vendor:'Ahava Medical',type:'Business Associate Agreement',start:'Mar 15, 2026',expiry:'Mar 14, 2027',status:'Current',contact:''},
  {id:'c7',name:'BAA — Quest Diagnostics',vendor:'Quest Diagnostics',type:'Business Associate Agreement',start:'Jan 1, 2026',expiry:'Dec 31, 2026',status:'Current',contact:''},
  {id:'c8',name:'Cleaning & Janitorial Services — Bay Parkway',vendor:'CleanCo Services',type:'Service Agreement',start:'Jan 1, 2026',expiry:'Dec 31, 2026',status:'Current',contact:''},
  {id:'c9',name:'Security Monitoring — All Sites',vendor:'SecureWatch',type:'Service Agreement',start:'Jan 1, 2026',expiry:'Dec 31, 2026',status:'Current',contact:''},
  {id:'c10',name:'Malpractice Insurance Policy',vendor:'MLMIC Insurance',type:'Insurance',start:'Jan 1, 2026',expiry:'Dec 31, 2026',status:'Current',contact:''},
  {id:'c11',name:'General Liability Insurance',vendor:'Travelers Insurance',type:'Insurance',start:'Jan 1, 2026',expiry:'Dec 31, 2026',status:'Current',contact:''},
];

const TYPES = ['Vendor Contract','Business Associate Agreement','Service Agreement','Insurance','MOU / MOA','Grant Agreement','Other'];
const TYPE_COL = {'Vendor Contract':'#0C447C','Business Associate Agreement':'#A32D2D','Service Agreement':'#27500A','Insurance':'#633806','MOU / MOA':'#26215C','Grant Agreement':'#3B6D11','Other':'#888'};

function UploadBtn({label='Upload'}) {
  return (
    <label style={{display:'inline-block',cursor:'pointer'}}>
      <input type="file" style={{display:'none'}} onChange={e=>{ if(e.target.files[0]) alert('File "'+e.target.files[0].name+'" selected. In the full version this will be saved to storage.'); }}/>
      <span className="btn pri" style={{fontSize:11}}>{label}</span>
    </label>
  );
}

export default function Contracts() {
  const [contracts, setContracts] = useState(INIT_CONTRACTS);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({name:'',vendor:'',type:'Vendor Contract',start:'',expiry:'',contact:''});

  const shown = contracts.filter(c=>{
    const q=search.toLowerCase();
    return (!typeFilter||c.type===typeFilter)&&(!q||c.name.toLowerCase().includes(q)||c.vendor.toLowerCase().includes(q));
  });

  const add = () => {
    if(!form.name) return;
    setContracts(p=>[{id:'c'+Date.now(),...form,status:'Current'},...p]);
    setShowModal(false);
    setForm({name:'',vendor:'',type:'Vendor Contract',start:'',expiry:'',contact:''});
  };

  const sc = s => s==='Current'?'var(--tx-suc)':s==='Expired'?'var(--tx-err)':'var(--tx-warn)';

  return (
    <div>
      {showModal && (
        <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal">
            <div className="modal-t">Add contract or agreement</div>
            <div className="fl"><label>Document name</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. Lab Services Agreement"/></div>
            <div className="fl"><label>Vendor / organization</label><input value={form.vendor} onChange={e=>setForm(p=>({...p,vendor:e.target.value}))} placeholder="e.g. Quest Diagnostics"/></div>
            <div className="fl"><label>Type</label><select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}>{TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <div className="fl"><label>Start date</label><input type="date" value={form.start} onChange={e=>setForm(p=>({...p,start:e.target.value}))}/></div>
              <div className="fl"><label>Expiry date</label><input type="date" value={form.expiry} onChange={e=>setForm(p=>({...p,expiry:e.target.value}))}/></div>
            </div>
            <div className="fl"><label>Contact email</label><input value={form.contact} onChange={e=>setForm(p=>({...p,contact:e.target.value}))} placeholder="vendor contact email"/></div>
            <div className="fl"><label>Attach document</label><UploadBtn label="Choose file"/></div>
            <div className="fa"><button className="btn" onClick={()=>setShowModal(false)}>Cancel</button><button className="btn pri" onClick={add}>Add contract</button></div>
          </div>
        </div>
      )}
      <div className="tbar">
        <input placeholder="Search contracts..." value={search} onChange={e=>setSearch(e.target.value)}/>
        <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} style={{fontSize:12,padding:'5px 8px',border:'0.5px solid var(--bd-m)',borderRadius:'var(--r)',background:'var(--bg-p)',color:'var(--tx-p)'}}>
          <option value="">All types</option>
          {TYPES.map(t=><option key={t}>{t}</option>)}
        </select>
        <button className="btn pri" onClick={()=>setShowModal(true)}>Add contract</button>
      </div>
      <div className="mets" style={{gridTemplateColumns:'repeat(4,minmax(0,1fr))'}}>
        <div className="met"><div className="met-l">Total agreements</div><div className="met-v">{contracts.length}</div></div>
        <div className="met"><div className="met-l">Current</div><div className="met-v" style={{color:'#639922'}}>{contracts.filter(c=>c.status==='Current').length}</div></div>
        <div className="met"><div className="met-l">Expired</div><div className="met-v" style={{color:'#A32D2D'}}>{contracts.filter(c=>c.status==='Expired').length}</div></div>
        <div className="met"><div className="met-l">BAAs on file</div><div className="met-v" style={{color:'#185FA5'}}>{contracts.filter(c=>c.type==='Business Associate Agreement').length}</div></div>
      </div>
      <div className="card" style={{padding:0}}>
        <table className="tbl" style={{tableLayout:'fixed',width:'100%'}}>
          <thead><tr><th style={{width:'28%'}}>Contract / agreement</th><th style={{width:'16%'}}>Vendor</th><th style={{width:'16%'}}>Type</th><th style={{width:'11%'}}>Start</th><th style={{width:'11%'}}>Expiry</th><th style={{width:'10%'}}>Status</th><th style={{width:'8%'}}>Actions</th></tr></thead>
          <tbody>
            {shown.map(c=>(
              <tr key={c.id}>
                <td style={{fontWeight:500}}>{c.name}</td>
                <td style={{color:'var(--tx-s)',fontSize:11}}>{c.vendor}</td>
                <td><span style={{fontSize:10,padding:'2px 6px',borderRadius:'var(--r)',background:'var(--bg-s)',color:TYPE_COL[c.type]||'var(--tx-s)'}}>{c.type}</span></td>
                <td style={{color:'var(--tx-t)',fontSize:11}}>{c.start}</td>
                <td style={{color:c.status==='Expired'?'var(--tx-err)':'var(--tx-t)',fontSize:11}}>{c.expiry}</td>
                <td style={{color:sc(c.status),fontSize:11,fontWeight:600}}>{c.status}</td>
                <td style={{display:'flex',gap:4}}><a style={{color:'var(--tx-info)',cursor:'pointer',fontSize:11}}>View</a><UploadBtn label="↑"/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
