import React, { useState } from 'react';
import { FORMS_DATA, FORM_CATS } from '../data';

const FORM_ONLY_CATS = ['Patient Forms','Staff Forms','Compliance Forms','Site Operations Forms'];
const FORM_COL = {'Patient Forms':'#27500A','Staff Forms':'#633806','Compliance Forms':'#A32D2D','Site Operations Forms':'#3B6D11'};

function UploadBtn({label='Upload'}) {
  return (
    <label style={{display:'inline-block',cursor:'pointer'}}>
      <input type="file" style={{display:'none'}} onChange={e=>{ if(e.target.files[0]) alert('File "'+e.target.files[0].name+'" selected. In the full version this will be saved to storage.'); }}/>
      <span className="btn pri" style={{fontSize:11}}>{label}</span>
    </label>
  );
}

export default function Forms() {
  const [forms, setForms] = useState(FORMS_DATA.filter(f=>FORM_ONLY_CATS.includes(f.cat)));
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newForm, setNewForm] = useState({name:'',cat:'Patient Forms',version:'',approver:'',freq:'As needed'});

  const shown = forms.filter(f=>{
    const q=search.toLowerCase();
    return (!catFilter||f.cat===catFilter)&&(!q||f.name.toLowerCase().includes(q));
  });

  const add = () => {
    if(!newForm.name) return;
    setForms(p=>[{id:'f'+Date.now(),...newForm,status:'Current'},...p]);
    setShowModal(false);
    setNewForm({name:'',cat:'Patient Forms',version:'',approver:'',freq:'As needed'});
  };

  return (
    <div>
      {showModal && (
        <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal">
            <div className="modal-t">Upload new form</div>
            <div className="fl"><label>Form name</label><input value={newForm.name} onChange={e=>setNewForm(p=>({...p,name:e.target.value}))} placeholder="e.g. Patient Intake Form"/></div>
            <div className="fl"><label>Category</label><select value={newForm.cat} onChange={e=>setNewForm(p=>({...p,cat:e.target.value}))}>{FORM_ONLY_CATS.map(c=><option key={c}>{c}</option>)}</select></div>
            <div className="fl"><label>Version / revision date</label><input value={newForm.version} onChange={e=>setNewForm(p=>({...p,version:e.target.value}))} placeholder="e.g. v1.0 - April 2026"/></div>
            <div className="fl"><label>Approved by</label><input value={newForm.approver} onChange={e=>setNewForm(p=>({...p,approver:e.target.value}))} placeholder="e.g. Medical Director"/></div>
            <div className="fl"><label>Review frequency</label><select value={newForm.freq} onChange={e=>setNewForm(p=>({...p,freq:e.target.value}))}><option>Annual</option><option>Quarterly</option><option>As needed</option></select></div>
            <div className="fl"><label>Attach file</label><UploadBtn label="Choose file"/></div>
            <div className="fa"><button className="btn" onClick={()=>setShowModal(false)}>Cancel</button><button className="btn pri" onClick={add}>Upload form</button></div>
          </div>
        </div>
      )}
      <div className="tbar">
        <input placeholder="Search forms..." value={search} onChange={e=>setSearch(e.target.value)}/>
        <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={{fontSize:12,padding:'5px 8px',border:'0.5px solid var(--bd-m)',borderRadius:'var(--r)',background:'var(--bg-p)',color:'var(--tx-p)'}}>
          <option value="">All categories</option>
          {FORM_ONLY_CATS.map(c=><option key={c}>{c}</option>)}
        </select>
        <button className="btn pri" onClick={()=>setShowModal(true)}>Upload new form</button>
      </div>
      <div className="folder-panel">
        <div className="folder-sb">
          <div className="sec-t" style={{marginBottom:8}}>Categories</div>
          <button className={`folder-row${!catFilter?' active':''}`} onClick={()=>setCatFilter('')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M2 2h12v12H2zM5 5h6M5 8h6M5 11h4"/></svg>
            <span style={{flex:1}}>All forms</span><span style={{fontSize:10,color:'var(--tx-t)'}}>{forms.length}</span>
          </button>
          {FORM_ONLY_CATS.map(c=>(
            <button key={c} className={`folder-row${catFilter===c?' active':''}`} onClick={()=>setCatFilter(c)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={catFilter===c?'currentColor':FORM_COL[c]||'#555'} strokeWidth="1.2"><path d="M2 2h12v12H2zM5 5h6M5 8h6M5 11h4"/></svg>
              <span style={{flex:1,fontSize:11}}>{c}</span>
              <span style={{fontSize:10,color:'var(--tx-t)'}}>{forms.filter(f=>f.cat===c).length}</span>
            </button>
          ))}
        </div>
        <div className="folder-main">
          <div className="card" style={{padding:0}}>
            <table className="tbl" style={{tableLayout:'fixed',width:'100%'}}>
              <thead><tr><th style={{width:'34%'}}>Form name</th><th style={{width:'18%'}}>Category</th><th style={{width:'14%'}}>Version</th><th style={{width:'12%'}}>Approved by</th><th style={{width:'10%'}}>Review</th><th style={{width:'8%'}}>Status</th><th style={{width:'4%'}}></th></tr></thead>
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
