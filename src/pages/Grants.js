import React, { useState } from 'react';

const INIT_GRANTS = [
  { id:'g1', name:'HRSA Health Center Program Grant', funder:'HRSA', type:'Federal', amount:1850000, period:'Jan 1, 2026 – Dec 31, 2026', status:'active', projectOfficer:'John Rivera', grantNum:'H80CS12345', nextReport:'Jul 31, 2026', reportFreq:'Semi-annual', deliverables:['UDS submission','Semi-annual progress report','Financial report'], docs:['hrsa_noa_2026.pdf'] },
  { id:'g2', name:'NYS DOH Community Health Improvement Grant', funder:'NYS DOH', type:'State', amount:325000, period:'Apr 1, 2025 – Mar 31, 2027', status:'active', projectOfficer:'Maria Santos (DOH)', grantNum:'DOH-2025-CHI-0042', nextReport:'Oct 1, 2026', reportFreq:'Annual', deliverables:['Annual progress report','Financial audit','Program evaluation'], docs:[] },
  { id:'g3', name:'FTCA Medical Malpractice Coverage', funder:'HRSA / FTCA', type:'Federal', amount:0, period:'Jan 1, 2026 – Dec 31, 2026', status:'active', projectOfficer:'HRSA FTCA Program', grantNum:'FTCA-2026-123', nextReport:'Oct 1, 2026', reportFreq:'Annual', deliverables:['FTCA deeming application renewal'], docs:['ftca_2026.pdf'] },
  { id:'g4', name:'PCMH Recognition — NCQA', funder:'NCQA', type:'Accreditation', amount:0, period:'2024 – 2027', status:'active', projectOfficer:'N/A', grantNum:'PCMH-2024-9876', nextReport:'2027-01-01', reportFreq:'Triennial', deliverables:['PCMH renewal application','Clinical quality data submission'], docs:['pcmh_cert.pdf'] },
  { id:'g5', name:'COVID-19 Uninsured Program — closeout', funder:'HRSA', type:'Federal', amount:47500, period:'2021 – 2023', status:'closed', projectOfficer:'HRSA Closeout', grantNum:'C19-HRSA-2021', nextReport:'N/A', reportFreq:'N/A', deliverables:[], docs:['closeout_report.pdf'] },
];

function UploadBtn({ label='Upload', onUpload }) {
  return (
    <label style={{display:'inline-block',cursor:'pointer'}}>
      <input type="file" style={{display:'none'}} onChange={e=>{ if(e.target.files[0]){ const n=e.target.files[0].name; if(onUpload)onUpload(n); }}}/>
      <span className="btn pri" style={{fontSize:10}}>{label}</span>
    </label>
  );
}

export default function Grants() {
  const [grants, setGrants] = useState(INIT_GRANTS);
  const [open, setOpen] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({name:'',funder:'',type:'Federal',amount:'',period:'',grantNum:'',projectOfficer:'',reportFreq:'Annual',nextReport:''});
  const tog = id => setOpen(p=>({...p,[id]:!p[id]}));
  const uploadDoc = (id,fn)=>setGrants(p=>p.map(g=>g.id===id?{...g,docs:[...(g.docs||[]),fn]}:g));

  const addGrant=()=>{
    if(!form.name)return;
    setGrants(p=>[...p,{id:'g'+Date.now(),...form,amount:parseFloat(form.amount)||0,status:'active',deliverables:[],docs:[]}]);
    setShowModal(false);
    setForm({name:'',funder:'',type:'Federal',amount:'',period:'',grantNum:'',projectOfficer:'',reportFreq:'Annual',nextReport:''});
  };

  const activeGrants=grants.filter(g=>g.status==='active');
  const totalFunding=activeGrants.reduce((a,g)=>a+g.amount,0);

  return (
    <div>
      {showModal&&(
        <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal">
            <div className="modal-t">Add grant or funding source</div>
            <div className="fl"><label>Grant name</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. HRSA Health Center Program Grant"/></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <div className="fl"><label>Funder</label><input value={form.funder} onChange={e=>setForm(p=>({...p,funder:e.target.value}))} placeholder="e.g. HRSA"/></div>
              <div className="fl"><label>Type</label><select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}><option>Federal</option><option>State</option><option>Local</option><option>Private / foundation</option><option>Accreditation</option></select></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <div className="fl"><label>Award amount ($)</label><input type="number" value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))} placeholder="0"/></div>
              <div className="fl"><label>Grant number</label><input value={form.grantNum} onChange={e=>setForm(p=>({...p,grantNum:e.target.value}))} placeholder="e.g. H80CS12345"/></div>
            </div>
            <div className="fl"><label>Period of performance</label><input value={form.period} onChange={e=>setForm(p=>({...p,period:e.target.value}))} placeholder="e.g. Jan 1, 2026 – Dec 31, 2026"/></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <div className="fl"><label>Project officer</label><input value={form.projectOfficer} onChange={e=>setForm(p=>({...p,projectOfficer:e.target.value}))} placeholder="HRSA contact name"/></div>
              <div className="fl"><label>Report frequency</label><select value={form.reportFreq} onChange={e=>setForm(p=>({...p,reportFreq:e.target.value}))}><option>Annual</option><option>Semi-annual</option><option>Quarterly</option><option>Triennial</option><option>N/A</option></select></div>
            </div>
            <div className="fl"><label>Next report due</label><input type="date" value={form.nextReport} onChange={e=>setForm(p=>({...p,nextReport:e.target.value}))}/></div>
            <div className="fa"><button className="btn" onClick={()=>setShowModal(false)}>Cancel</button><button className="btn pri" onClick={addGrant}>Add grant</button></div>
          </div>
        </div>
      )}

      <div className="mets">
        <div className="met"><div className="met-l">Active grants</div><div className="met-v">{activeGrants.length}</div></div>
        <div className="met"><div className="met-l">Total active funding</div><div className="met-v" style={{fontSize:15}}>${totalFunding.toLocaleString()}</div></div>
        <div className="met"><div className="met-l">Reports due this year</div><div className="met-v" style={{color:'#BA7517'}}>3</div></div>
        <div className="met"><div className="met-l">Closed / completed</div><div className="met-v" style={{color:'var(--tx-t)'}}>{grants.filter(g=>g.status==='closed').length}</div></div>
      </div>

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
        <div style={{fontSize:12,color:'var(--tx-s)'}}>Track all grants, reporting deadlines, deliverables, and award documents</div>
        <button className="btn pri" onClick={()=>setShowModal(true)}>Add grant</button>
      </div>

      {grants.map(g=>(
        <div key={g.id} style={{background:'var(--bg-p)',border:'0.5px solid var(--bd)',borderRadius:'var(--rl)',marginBottom:10,overflow:'hidden',opacity:g.status==='closed'?.75:1}}>
          <button style={{display:'flex',alignItems:'center',gap:10,padding:'12px 14px',width:'100%',background:'transparent',border:'none',textAlign:'left',cursor:'pointer'}} onClick={()=>tog(g.id)}>
            <div style={{flex:1}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:3}}>
                <div style={{fontSize:12,fontWeight:600}}>{g.name}</div>
                <span style={{fontSize:10,padding:'1px 6px',borderRadius:'var(--r)',background:g.type==='Federal'?'var(--bg-info)':g.type==='State'?'var(--bg-suc)':'var(--bg-s)',color:g.type==='Federal'?'var(--tx-info)':g.type==='State'?'var(--tx-suc)':'var(--tx-s)'}}>{g.type}</span>
              </div>
              <div style={{fontSize:10,color:'var(--tx-t)'}}>{g.funder} · {g.grantNum} · {g.period}</div>
            </div>
            {g.amount>0&&<div style={{textAlign:'right',marginRight:10}}><div style={{fontSize:11,color:'var(--tx-t)'}}>Award</div><div style={{fontSize:13,fontWeight:600,color:'var(--tx-suc)'}}>${g.amount.toLocaleString()}</div></div>}
            {g.status==='closed'?<span className="bdg neu">Closed</span>:<span className="bdg ok">Active</span>}
            <span style={{fontSize:11,color:'var(--tx-t)',marginLeft:8}}>{open[g.id]?'▲':'▼'}</span>
          </button>
          {open[g.id]&&(
            <div style={{borderTop:'0.5px solid var(--bd)',padding:'14px',background:'var(--bg-s)'}}>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:12,fontSize:12}}>
                <div><span style={{color:'var(--tx-s)'}}>Project officer: </span>{g.projectOfficer}</div>
                <div><span style={{color:'var(--tx-s)'}}>Reporting: </span>{g.reportFreq}</div>
                <div><span style={{color:'var(--tx-s)'}}>Next report: </span><span style={{color:'var(--tx-warn)',fontWeight:500}}>{g.nextReport}</span></div>
              </div>
              {g.deliverables&&g.deliverables.length>0&&(
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:11,fontWeight:600,color:'var(--tx-s)',marginBottom:6}}>Required deliverables</div>
                  {g.deliverables.map((d,i)=>(
                    <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'5px 0',fontSize:12,borderBottom:'0.5px solid var(--bd)'}}>
                      <div className="ck ok">✓</div><div style={{flex:1}}>{d}</div><UploadBtn label="Upload"/>
                    </div>
                  ))}
                </div>
              )}
              {g.docs&&g.docs.length>0&&(
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:11,fontWeight:600,color:'var(--tx-s)',marginBottom:6}}>Grant documents on file</div>
                  {g.docs.map((d,i)=><div key={i} style={{fontSize:11,color:'var(--tx-info)',padding:'3px 0'}}>{d}</div>)}
                </div>
              )}
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                <UploadBtn label="Upload notice of award" onUpload={fn=>uploadDoc(g.id,fn)}/>
                <UploadBtn label="Upload progress report" onUpload={fn=>uploadDoc(g.id,fn)}/>
                <UploadBtn label="Upload financial report" onUpload={fn=>uploadDoc(g.id,fn)}/>
                <UploadBtn label="Upload other document" onUpload={fn=>uploadDoc(g.id,fn)}/>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
