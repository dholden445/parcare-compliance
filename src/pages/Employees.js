import React, { useState } from 'react';
import { INITIAL_EMPLOYEES, TRS, TRF } from '../data';

const DBGC = {"Clinical / Medical":"#0C447C","Quality Improvement":"#0C447C","Compliance":"#27500A","HR / Operations":"#791F1F","Site Operations":"#633806"};
const DBBG = {"Clinical / Medical":"#E6F1FB","Quality Improvement":"#E6F1FB","Compliance":"#EAF3DE","HR / Operations":"#FFEBEE","Site Operations":"#FAEEDA"};
const ini = n => n.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();

export default function Employees() {
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [openEmps, setOpenEmps] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({fn:'',ln:'',title:'',dept:'Clinical / Medical',site:'All sites',role:'Staff',start:'',email:''});

  const toggle = id => setOpenEmps(p=>({...p,[id]:!p[id]}));
  const markDone = (eid, t) => setEmployees(prev=>prev.map(e=>e.id===eid?{...e,tr:{...e.tr,[t]:'done'}}:e));
  const addEmp = () => {
    if(!form.fn && !form.ln) return;
    const tr = {}; TRS.forEach(t=>tr[t]='missing');
    setEmployees(prev=>[...prev,{id:'e'+Date.now(),name:form.fn+' '+form.ln,title:form.title,dept:form.dept,site:form.site,role:form.role,start:form.start||'2026',email:form.email,tr}]);
    setShowModal(false);
    setForm({fn:'',ln:'',title:'',dept:'Clinical / Medical',site:'All sites',role:'Staff',start:'',email:''});
  };

  const shown = employees.filter(e=>{
    const q = search.toLowerCase();
    return (!deptFilter||e.dept===deptFilter) && (!q||e.name.toLowerCase().includes(q)||e.title.toLowerCase().includes(q));
  });

  return (
    <div>
      {showModal && (
        <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal">
            <div className="modal-t">Add employee</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <div className="fl"><label>First name</label><input value={form.fn} onChange={e=>setForm(p=>({...p,fn:e.target.value}))} placeholder="First"/></div>
              <div className="fl"><label>Last name</label><input value={form.ln} onChange={e=>setForm(p=>({...p,ln:e.target.value}))} placeholder="Last"/></div>
            </div>
            <div className="fl"><label>Job title</label><input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Medical Assistant"/></div>
            <div className="fl"><label>Department</label><select value={form.dept} onChange={e=>setForm(p=>({...p,dept:e.target.value}))}><option>Clinical / Medical</option><option>Quality Improvement</option><option>HR / Operations</option><option>Compliance</option><option>Site Operations</option></select></div>
            <div className="fl"><label>Site</label><select value={form.site} onChange={e=>setForm(p=>({...p,site:e.target.value}))}><option>All sites</option><option>Bay Parkway</option><option>16th Ave</option><option>Williamsburg</option><option>Rambam</option></select></div>
            <div className="fl"><label>Role</label><select value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))}><option>Staff</option><option>Clinical Staff</option><option>Provider</option><option>Site Manager</option><option>Manager</option><option>HR</option><option>Compliance</option><option>QI Staff</option><option>Admin</option></select></div>
            <div className="fl"><label>Start date</label><input type="date" value={form.start} onChange={e=>setForm(p=>({...p,start:e.target.value}))}/></div>
            <div className="fl"><label>Email</label><input value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="employee@parcare.org"/></div>
            <div className="fa"><button className="btn" onClick={()=>setShowModal(false)}>Cancel</button><button className="btn pri" onClick={addEmp}>Add employee</button></div>
          </div>
        </div>
      )}
      <div className="tbar">
        <input placeholder="Search employees..." value={search} onChange={e=>setSearch(e.target.value)} style={{maxWidth:200}}/>
        <select value={deptFilter} onChange={e=>setDeptFilter(e.target.value)} style={{fontSize:12,padding:'5px 8px',border:'0.5px solid var(--bd-m)',borderRadius:'var(--r)',background:'var(--bg-p)',color:'var(--tx-p)'}}>
          <option value="">All departments</option><option>Clinical / Medical</option><option>Quality Improvement</option><option>HR / Operations</option><option>Compliance</option><option>Site Operations</option>
        </select>
        <button className="btn pri" onClick={()=>setShowModal(true)}>Add employee</button>
      </div>
      {shown.map(e=>{
        const done = TRS.filter(t=>e.tr[t]==='done').length;
        const pct = Math.round(done/TRS.length*100);
        const col = pct===100?'#639922':pct>=80?'#185FA5':'#A32D2D';
        const miss = TRS.filter(t=>e.tr[t]==='missing');
        return (
          <div key={e.id} className="emp-card">
            <button className="emp-hd" onClick={()=>toggle(e.id)}>
              <div className="emp-av" style={{background:DBBG[e.dept]||'var(--bg-s)',color:DBGC[e.dept]||'var(--tx-s)'}}>{ini(e.name)}</div>
              <div className="emp-info"><div className="emp-name">{e.name}</div><div className="emp-role">{e.title} · {e.dept} · {e.site}</div></div>
              <span className="rb">{e.role}</span>
              <div style={{textAlign:'right',minWidth:80}}>
                <div style={{fontSize:11,fontWeight:600,color:col}}>{pct}% trained</div>
                <div className="pb" style={{width:80,marginTop:3}}><div className="pf" style={{width:pct+'%',background:col}}></div></div>
              </div>
              {miss.length>0?<span className="bdg err">{miss.length} missing</span>:<span className="bdg ok">All done</span>}
            </button>
            {openEmps[e.id] && (
              <div className="emp-body">
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12,fontSize:12}}>
                  <div><span style={{color:'var(--tx-s)'}}>Email: </span>{e.email}</div>
                  <div><span style={{color:'var(--tx-s)'}}>Start: </span>{e.start}</div>
                  <div><span style={{color:'var(--tx-s)'}}>Site: </span>{e.site}</div>
                  <div><span style={{color:'var(--tx-s)'}}>Access: </span>{e.role}</div>
                </div>
                <div className="sec-t" style={{marginBottom:8}}>Training status</div>
                {TRS.map((t,i)=>(
                  <div key={t} className="tr-row">
                    <div className={`ck ${e.tr[t]==='done'?'ok':'err'}`}>{e.tr[t]==='done'?'✓':'✗'}</div>
                    <div className="tr-name">{TRF[i]}</div>
                    <div style={{fontSize:11,minWidth:80,textAlign:'right',color:e.tr[t]==='done'?'var(--tx-suc)':'var(--tx-err)'}}>{e.tr[t]==='done'?'Complete':'Incomplete'}</div>
                    {e.tr[t]!=='done'&&<button className="btn sm" onClick={()=>markDone(e.id,t)}>Mark done</button>}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
