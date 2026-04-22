import React, { useState } from 'react';
import { INITIAL_TASKS } from '../data';

export default function Tasks() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [open, setOpen] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({name:'',who:'Site Manager - Bay Parkway',cat:'Fire & Safety',due:'',upload:'yes',notes:''});
  const tog = id => setOpen(p=>({...p,[id]:!p[id]}));
  const done = id => setTasks(p=>p.map(t=>t.id===id?{...t,status:'done'}:t));
  const add = () => {
    if(!form.name) return;
    setTasks(p=>[{id:'t'+Date.now(),name:form.name,who:form.who,cat:form.cat,due:form.due||'TBD',status:'pending',upload:form.upload==='yes',notes:form.notes},...p]);
    setShowModal(false);
    setForm({name:'',who:'Site Manager - Bay Parkway',cat:'Fire & Safety',due:'',upload:'yes',notes:''});
  };
  const cats = [...new Set(tasks.map(t=>t.cat))];
  return (
    <div>
      {showModal && (
        <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal">
            <div className="modal-t">Assign new task</div>
            <div className="fl"><label>Task name</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Task description"/></div>
            <div className="fl"><label>Assign to</label><select value={form.who} onChange={e=>setForm(p=>({...p,who:e.target.value}))}><option>Site Manager - Bay Parkway</option><option>Site Manager - 16th Ave</option><option>Site Manager - Williamsburg</option><option>Site Manager - Rambam</option><option>All Site Managers</option><option>Compliance Officer</option><option>HR Director</option><option>Medical Director</option><option>QI Coordinator</option></select></div>
            <div className="fl"><label>Category</label><select value={form.cat} onChange={e=>setForm(p=>({...p,cat:e.target.value}))}><option>Fire & Safety</option><option>Credentialing</option><option>Regulatory Filing</option><option>Quality</option><option>HR / Onboarding</option><option>Facility</option><option>Other</option></select></div>
            <div className="fl"><label>Due date</label><input type="date" value={form.due} onChange={e=>setForm(p=>({...p,due:e.target.value}))}/></div>
            <div className="fl"><label>Requires upload?</label><select value={form.upload} onChange={e=>setForm(p=>({...p,upload:e.target.value}))}><option value="yes">Yes - document upload required</option><option value="no">No - confirmation only</option></select></div>
            <div className="fl"><label>Notes</label><textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Instructions for assignee..."/></div>
            <div className="fa"><button className="btn" onClick={()=>setShowModal(false)}>Cancel</button><button className="btn pri" onClick={add}>Assign task</button></div>
          </div>
        </div>
      )}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
        <div style={{fontSize:12,color:'var(--tx-s)'}}>Assign tasks — staff mark complete and upload documentation</div>
        <button className="btn pri" onClick={()=>setShowModal(true)}>Assign new task</button>
      </div>
      {cats.map(cat=>(
        <div key={cat} style={{marginBottom:18}}>
          <div className="sec-t">{cat}<span>{tasks.filter(t=>t.cat===cat&&t.status!=='done').length} open</span></div>
          {tasks.filter(t=>t.cat===cat).map(t=>{
            const isDone=t.status==='done'; const isOver=t.status==='overdue';
            return (
              <div key={t.id} style={{background:'var(--bg-p)',border:`0.5px solid ${isOver?'var(--bd-m)':'var(--bd)'}`,borderRadius:'var(--rl)',marginBottom:7,overflow:'hidden'}}>
                <button style={{display:'flex',alignItems:'center',gap:8,padding:'9px 12px',cursor:'pointer',width:'100%',background:'transparent',border:'none',textAlign:'left'}} onClick={()=>tog(t.id)}>
                  <div className={`ck ${isDone?'ok':isOver?'err':'warn'}`}>{isDone?'✓':isOver?'!':'~'}</div>
                  <div style={{flex:1,fontSize:12,fontWeight:600}}>{t.name}</div>
                  <span style={{fontSize:10,color:'var(--tx-t)',marginRight:4}}>{t.who}</span>
                  {isDone?<span className="bdg ok">Complete</span>:isOver?<span className="bdg err">Overdue</span>:<span className="bdg warn">Pending</span>}
                </button>
                {open[t.id] && (
                  <div className="task-body">
                    <div style={{fontSize:12,marginBottom:5}}><span style={{color:'var(--tx-s)'}}>Assigned to: </span>{t.who}</div>
                    <div style={{fontSize:12,marginBottom:5}}><span style={{color:'var(--tx-s)'}}>Due: </span><span style={{color:isOver?'var(--tx-err)':''}}>{t.due}</span></div>
                    <div style={{fontSize:12,marginBottom:8}}><span style={{color:'var(--tx-s)'}}>Notes: </span>{t.notes}</div>
                    {isDone
                      ? <div className="done-banner">✓ Completed{t.upload?' — document on file':''}</div>
                      : <><div style={{display:'flex',gap:6,flexWrap:'wrap'}}><button className="btn suc" onClick={()=>done(t.id)}>Mark complete{t.upload?' & upload':''}</button></div>{t.upload&&<div className="upload-zone" onClick={()=>done(t.id)}>Click to attach document</div>}</>
                    }
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
