import React, { useState } from 'react';
import { DOCS, DOC_FOLDERS } from '../data';

function UploadBtn({label='Upload'}) {
  return (
    <label style={{display:'inline-block',cursor:'pointer'}}>
      <input type="file" style={{display:'none'}} onChange={e=>{ if(e.target.files[0]) alert('File "'+e.target.files[0].name+'" selected. In the full version this will be saved to storage.'); }}/>
      <span className="btn pri" style={{fontSize:11}}>{label}</span>
    </label>
  );
}

const sc = s => s==='Current'?'var(--tx-suc)':s==='Expired'||s==='Overdue'||s==='Missing'||s==='Incomplete'?'var(--tx-err)':s==='Open'?'var(--tx-warn)':'var(--tx-t)';

export default function Documents() {
  const [docs, setDocs] = useState(DOCS);
  const [search, setSearch] = useState('');
  const [folder, setFolder] = useState('');

  const shown = docs.filter(d=>{
    const q=search.toLowerCase();
    return (!folder||d.folder===folder)&&(!q||d.name.toLowerCase().includes(q));
  });

  return (
    <div>
      <div className="tbar">
        <input placeholder="Search documents..." value={search} onChange={e=>setSearch(e.target.value)}/>
        <select value={folder} onChange={e=>setFolder(e.target.value)} style={{fontSize:12,padding:'5px 8px',border:'0.5px solid var(--bd-m)',borderRadius:'var(--r)',background:'var(--bg-p)',color:'var(--tx-p)'}}>
          <option value="">All folders</option>
          {DOC_FOLDERS.map(f=><option key={f.name}>{f.name}</option>)}
        </select>
        <UploadBtn label="Upload document"/>
      </div>
      <div className="folder-panel">
        <div className="folder-sb">
          <div className="sec-t" style={{marginBottom:8}}>Folders</div>
          <button className={`folder-row${!folder?' active':''}`} onClick={()=>setFolder('')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M2 4h4l2 2h6a1 1 0 011 1v7a1 1 0 01-1 1H2a1 1 0 01-1-1V5a1 1 0 011-1z"/></svg>
            <span style={{flex:1}}>All</span><span style={{fontSize:10,color:'var(--tx-t)'}}>{docs.length}</span>
          </button>
          {DOC_FOLDERS.map(f=>(
            <button key={f.name} className={`folder-row${folder===f.name?' active':''}`} onClick={()=>setFolder(f.name)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={folder===f.name?'currentColor':f.col} strokeWidth="1.2"><path d="M2 4h4l2 2h6a1 1 0 011 1v7a1 1 0 01-1 1H2a1 1 0 01-1-1V5a1 1 0 011-1z"/></svg>
              <span style={{flex:1,fontSize:11}}>{f.name}</span>
              <span style={{fontSize:10,color:'var(--tx-t)'}}>{docs.filter(d=>d.folder===f.name).length}</span>
            </button>
          ))}
        </div>
        <div className="folder-main">
          <div style={{display:'flex',justifyContent:'flex-end',marginBottom:8}}>
            <UploadBtn label="+ Upload to this folder"/>
          </div>
          <div className="card" style={{padding:0}}>
            <table className="tbl" style={{tableLayout:'fixed',width:'100%'}}>
              <thead><tr><th style={{width:'38%'}}>Document</th><th style={{width:'20%'}}>Folder</th><th style={{width:'14%'}}>Updated</th><th style={{width:'14%'}}>Status</th><th style={{width:'14%'}}>Actions</th></tr></thead>
              <tbody>
                {shown.map((d,i)=>(
                  <tr key={i}>
                    <td style={{fontWeight:500}}>{d.name}</td>
                    <td style={{color:'var(--tx-s)',fontSize:11}}>{d.folder}</td>
                    <td style={{color:'var(--tx-t)',fontSize:11}}>{d.updated}</td>
                    <td style={{color:sc(d.status),fontSize:11}}>{d.status}</td>
                    <td style={{display:'flex',gap:6,alignItems:'center'}}>
                      <a style={{color:'var(--tx-info)',cursor:'pointer',fontSize:11}}>View</a>
                      <UploadBtn label="Replace"/>
                    </td>
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
