import React, { useState } from 'react';
import { INITIAL_EMPLOYEES, TRS, TRF } from '../data';

export default function TrainingTracker() {
  const [employees] = useState(INITIAL_EMPLOYEES);
  const [search, setSearch] = useState('');
  const [colFilter, setColFilter] = useState('');
  const cols = colFilter ? [colFilter] : TRS;
  const shown = employees.filter(e=>!search||e.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
        <div style={{fontSize:12,color:'var(--tx-s)'}}>Staff training completion matrix — all required annual trainings</div>
        <button className="btn pri">Send reminders</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:8,marginBottom:16}}>
        {TRS.map((t,i)=>{
          const done = employees.filter(e=>e.tr[t]==='done').length;
          const pct = Math.round(done/employees.length*100);
          const col = pct===100?'#639922':pct>=80?'#185FA5':'#A32D2D';
          return <div key={t} className="met"><div className="met-l" style={{fontSize:10}}>{TRF[i].split('/')[0].trim().substring(0,18)}</div><div className="met-v" style={{fontSize:16,color:col}}>{pct}%</div><div className="pb"><div className="pf" style={{width:pct+'%',background:col}}></div></div></div>;
        })}
      </div>
      <div className="card">
        <div className="tbar">
          <input placeholder="Search staff..." value={search} onChange={e=>setSearch(e.target.value)} style={{maxWidth:180}}/>
          <select value={colFilter} onChange={e=>setColFilter(e.target.value)} style={{fontSize:12,padding:'5px 8px',border:'0.5px solid var(--bd-m)',borderRadius:'var(--r)',background:'var(--bg-p)',color:'var(--tx-p)'}}>
            <option value="">All trainings</option>
            {TRS.map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
        <div style={{overflowX:'auto'}}>
          <table className="tbl" style={{minWidth:500,tableLayout:'auto'}}>
            <thead><tr><th style={{minWidth:110}}>Name</th><th>Dept</th>{cols.map(c=><th key={c} style={{minWidth:60,fontSize:9}}>{c}</th>)}</tr></thead>
            <tbody>
              {shown.map(e=>(
                <tr key={e.id}>
                  <td style={{fontWeight:600}}>{e.name}</td>
                  <td style={{color:'var(--tx-t)',fontSize:11}}>{e.dept.split('/')[0].trim()}</td>
                  {cols.map(t=><td key={t} style={{textAlign:'center'}}>{e.tr[t]==='done'?<span style={{color:'var(--tx-suc)'}}>✓</span>:<span style={{color:'var(--tx-err)'}}>✗</span>}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
