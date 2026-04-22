import React, { useState } from 'react';
import { FORMS_DATA } from '../data';

const POLICY_CATS = ['Clinical Policies','Administrative Policies','HR Policies'];
const POL_COL = {'Clinical Policies':'#0C447C','Administrative Policies':'#26215C','HR Policies':'#791F1F'};

function UploadBtn({label='Upload'}) {
  return (
    <label style={{display:'inline-block',cursor:'pointer'}}>
      <input type="file" style={{display:'none'}} onChange={e=>{ if(e.target.files[0]) alert('File "'+e.target.files[0].name+'" selected. In the full version this will be saved to storage.'); }}/>
      <span className="btn pri" style={{fontSize:11}}>{label}</span>
    </label>
  );
}

export default function Policies() {
  const [policies, setPolicies] = useState(FORMS_DATA.filter(f=>POLICY_CATS.includes(f.cat)));
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newPol, setNewPol] = useState({name:'',cat:'Clinical Policies',version:'',approver:'',freq:'Annual'});

  const shown = policies.filter(f=>{
    const q=search.toLowerCase();
    return (!catFilter||f.cat===catFilter)&&(!q||f.name.toLowerCase().includes(q));
  });

  const add = () => {
    if(!newPol.name) return;
    setPolicies(p=>[{id:'p'+Date.now(),...newPol,status:'Current'},...p]);
    setShowModal(false);
    setNewPol({name:'',cat:'Clinical Policies',version:'',approver:'',freq:'Annual'});
  };

  return (
    <div>
      {showModal && (
        <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal">
            <div className="modal-t">Add policy or procedure</div>
            <div className="fl"><label>Policy name</label><input value={newPol.name} onChange={e=>setNewPol(p=>({...p,name:e.target.value}))} placeholder="e.g. Infection Control Policy"/></div>
            <div className="fl"><label>Category</label><select value={newPol.cat} onChange={e=>setNewPol(p=>({...p,cat:e.target.value}))}>{POLICY_CATS.map(c=><option key={c}>{c}</option>)}</select></div>
            <div className="fl"><label>Version / effective date</label><input value={newPol.version} onChange={e=>setNewPol(p=>({...p,version:e.target.value}))} placeholder="e.g. v1.0 - Jan 2026"/></div>
            <div className="fl"><label>Approved by</label><input value={newPol.approver} onChange={e=>setNewPol(p=>({...p,approver:e.target.value}))} placeholder="e.g. Medical Director"/></div>
            <div className="fl"><label>Review frequency</label><select value={newPol.freq} onChange={e=>setNewPol(p=>({...p,freq:e.target.value}))}><option>Annual</option><option>Biennial (every 2 years)</option><option>As needed</option></select></div>
            <div className="fl"><label>Attach policy document</label><UploadBtn label="Choose file"/></div>
            <div className="fa"><button className="btn" onClick={()=>setShowModal(false)}>Cancel</button><button className="btn pri" onClick={add}>Add policy</button></div>
          </div>
        </div>
      )}
      <div className="tbar">
        <input placeholder="Search policies..." value={search} onChange={e=>setSearch(e.target.value)}/>
        <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={{fontSize:12,padding:'5px 8px',border:'0.5px solid var(--bd-m)',borderRadius:'var(--r)',background:'var(--bg-p)',color:'var(--tx-p)'}}>
          <option value="">All categories</option>
          {POLICY_CATS.map(c=><option key={c}>{c}</option>)}
        </select>
        <button className="btn pri" onClick={()=>setShowModal(true)}>Add policy / procedure</button>
      </div>
      <div className="folder-panel">
        <div className="folder-sb">
          <div className="sec-t" style={{marginBottom:8}}>Categories</div>
          <button className={`folder-row${!catFilter?' active':''}`} onClick={()=>setCatFilter('')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M4 1h6l3 3v10a1 1 0 01-1 1H4a1 1 0 01-1-1V2a1 1 0 011-1zM10 1v3h3"/></svg>
            <span style={{flex:1}}>All policies</span><span style={{fontSize:10,color:'var(--tx-t)'}}>{policies.length}</span>
          </button>
          {POLICY_CATS.map(c=>(
            <button key={c} className={`folder-row${catFilter===c?' active':''}`} onClick={()=>setCatFilter(c)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={catFilter===c?'currentColor':POL_COL[c]||'#555'} strokeWidth="1.2"><path d="M4 1h6l3 3v10a1 1 0 01-1 1H4a1 1 0 01-1-1V2a1 1 0 011-1zM10 1v3h3"/></svg>
              <span style={{flex:1,fontSize:11}}>{c}</span>
              <span style={{fontSize:10,color:'var(--tx-t)'}}>{policies.filter(f=>f.cat===c).length}</span>
            </button>
          ))}
        </div>
        <div className="folder-main">
          <div style={{marginBottom:8,fontSize:12,color:'var(--tx-s)'}}>All active policies and procedures — click the upload button to attach or replace a document for any item.</div>
          <div className="card" style={{padding:0}}>
            <table className="tbl" style={{tableLayout:'fixed',width:'100%'}}>
              <thead><tr><th style={{width:'34%'}}>Policy / procedure name</th><th style={{width:'18%'}}>Category</th><th style={{width:'14%'}}>Version</th><th style={{width:'12%'}}>Approved by</th><th style={{width:'10%'}}>Review</th><th style={{width:'8%'}}>Status</th><th style={{width:'4%'}}></th></tr></thead>
              <tbody>
                {shown.map(f=>(
                  <tr key={f.id}>
                    <td style={{fontWeight:500}}>{f.name}</td>
                    <td style={{color:'var(--tx-s)',fontSize:11}}>{f.cat}</td>
                    <td style={{color:'var(--tx-t)',fontSize:11}}>{f.version}</td>
                    <td style={{color:'var(--tx-t)',fontSize:11}}>{f.approver}</td>
                    <td style={{color:'var(--tx-t)',fontSize:11}}>{f.freq}</td>
                    <td style={{color:f.status==='Current'?'var(--tx-suc)':'var(--tx-err)',fontSize:11}}>{f.status}</td>
                    <td><UploadBtn label="↑"/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
