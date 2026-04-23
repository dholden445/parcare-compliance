import React, { useState } from 'react';

const INIT_INCIDENTS = [
  { id:'i1', type:'Patient complaint', title:'Patient reported long wait time and rude front desk interaction', date:'Apr 5, 2026', site:'Bay Parkway', reporter:'N. Ramos', severity:'low', status:'under review', assignee:'Compliance Officer', dueDate:'Apr 19, 2026', notes:'Patient called to report experience. Spoke with front desk supervisor.', resolution:'', docs:[] },
  { id:'i2', type:'HIPAA breach', title:'Patient chart accessed by unauthorized staff member', date:'Mar 22, 2026', site:'Williamsburg', reporter:'Compliance Officer', severity:'high', status:'open', assignee:'Compliance Officer', dueDate:'Apr 5, 2026', notes:'Discovered during routine audit. Staff member counseled. Breach assessment completed.', resolution:'', docs:[] },
  { id:'i3', type:'Staff incident', title:'Staff member slipped on wet floor — no injury', date:'Mar 12, 2026', site:'16th Ave', reporter:'Site Mgr - 16th Ave', severity:'medium', status:'closed', assignee:'HR Director', dueDate:'Mar 26, 2026', notes:'Wet floor sign was not posted. No injury sustained.', resolution:'Wet floor signs purchased and placed at all mop closets. Staff reminded of safety protocols.', docs:['incident_report_031226.pdf'] },
  { id:'i4', type:'Near miss', title:'Medication nearly administered to wrong patient — caught by MA', date:'Apr 10, 2026', site:'Rambam', reporter:'Daisy (MA Lead)', severity:'high', status:'open', assignee:'Medical Director', dueDate:'Apr 24, 2026', notes:'Two patients with similar names scheduled same time. MA caught error before administration.', resolution:'', docs:[] },
];

const TYPES = ['Patient complaint','HIPAA breach','Staff incident','Near miss','Medication error','Equipment failure','Facility / safety','Security incident','Workplace violence','Other'];
const SEVERITIES = [{v:'low',label:'Low',col:'var(--tx-suc)',bg:'var(--bg-suc)'},{v:'medium',label:'Medium',col:'var(--tx-warn)',bg:'var(--bg-warn)'},{v:'high',label:'High',col:'var(--tx-err)',bg:'var(--bg-err)'}];
const STATUSES = ['open','under review','pending review','closed'];

function UploadBtn({ label='Upload', onUpload }) {
  return (
    <label style={{display:'inline-block',cursor:'pointer'}}>
      <input type="file" style={{display:'none'}} onChange={e=>{ if(e.target.files[0]){ const n=e.target.files[0].name; if(onUpload)onUpload(n); }}}/>
      <span className="btn pri" style={{fontSize:10}}>{label}</span>
    </label>
  );
}

export default function Incidents() {
  const [incidents, setIncidents] = useState(INIT_INCIDENTS);
  const [open, setOpen] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [form, setForm] = useState({ type:'Patient complaint', title:'', date:'', site:'Bay Parkway', reporter:'', severity:'medium', assignee:'', dueDate:'', notes:'' });

  const tog = id => setOpen(p=>({...p,[id]:!p[id]}));
  const updateStatus = (id, status) => setIncidents(p=>p.map(i=>i.id===id?{...i,status}:i));
  const addResolution = (id, res) => setIncidents(p=>p.map(i=>i.id===id?{...i,resolution:res,status:'closed'}:i));
  const uploadDoc = (id, fn) => setIncidents(p=>p.map(i=>i.id===id?{...i,docs:[...(i.docs||[]),fn]}:i));

  const addIncident = () => {
    if (!form.title) return;
    setIncidents(p=>[{id:'i'+Date.now(),...form,status:'open',resolution:'',docs:[]},...p]);
    setShowModal(false);
    setForm({ type:'Patient complaint', title:'', date:'', site:'Bay Parkway', reporter:'', severity:'medium', assignee:'', dueDate:'', notes:'' });
  };

  const shown = incidents.filter(i=>
    (!filterStatus||i.status===filterStatus)&&(!filterSeverity||i.severity===filterSeverity)
  );

  const sev = v => SEVERITIES.find(s=>s.v===v)||SEVERITIES[0];
  const statCol = s => s==='closed'?'var(--tx-suc)':s==='open'?'var(--tx-err)':'var(--tx-warn)';
  const statBg = s => s==='closed'?'var(--bg-suc)':s==='open'?'var(--bg-err)':'var(--bg-warn)';

  return (
    <div>
      {showModal&&(
        <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal">
            <div className="modal-t">Report new incident</div>
            <div className="fl"><label>Incident type</label><select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}>{TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
            <div className="fl"><label>Title / brief description</label><input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="Brief summary of what happened"/></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <div className="fl"><label>Date of incident</label><input type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))}/></div>
              <div className="fl"><label>Site</label><select value={form.site} onChange={e=>setForm(p=>({...p,site:e.target.value}))}><option>Bay Parkway</option><option>16th Ave</option><option>Williamsburg</option><option>Rambam</option></select></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <div className="fl"><label>Reported by</label><input value={form.reporter} onChange={e=>setForm(p=>({...p,reporter:e.target.value}))} placeholder="Your name"/></div>
              <div className="fl"><label>Severity</label><select value={form.severity} onChange={e=>setForm(p=>({...p,severity:e.target.value}))}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <div className="fl"><label>Assign to</label><input value={form.assignee} onChange={e=>setForm(p=>({...p,assignee:e.target.value}))} placeholder="Responsible person"/></div>
              <div className="fl"><label>Follow-up due date</label><input type="date" value={form.dueDate} onChange={e=>setForm(p=>({...p,dueDate:e.target.value}))}/></div>
            </div>
            <div className="fl"><label>Detailed notes</label><textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Full description of what happened, who was involved, immediate actions taken..."/></div>
            <div className="fa"><button className="btn" onClick={()=>setShowModal(false)}>Cancel</button><button className="btn pri" onClick={addIncident}>Submit incident report</button></div>
          </div>
        </div>
      )}

      <div className="mets">
        <div className="met"><div className="met-l">Total incidents</div><div className="met-v">{incidents.length}</div><div className="met-s">YTD 2026</div></div>
        <div className="met"><div className="met-l">Open</div><div className="met-v" style={{color:'#A32D2D'}}>{incidents.filter(i=>i.status==='open').length}</div></div>
        <div className="met"><div className="met-l">High severity</div><div className="met-v" style={{color:'#A32D2D'}}>{incidents.filter(i=>i.severity==='high').length}</div></div>
        <div className="met"><div className="met-l">Closed</div><div className="met-v" style={{color:'#639922'}}>{incidents.filter(i=>i.status==='closed').length}</div></div>
      </div>

      <div className="tbar">
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{fontSize:12,padding:'5px 8px',border:'0.5px solid var(--bd-m)',borderRadius:'var(--r)',background:'var(--bg-p)',color:'var(--tx-p)'}}>
          <option value="">All statuses</option>{STATUSES.map(s=><option key={s}>{s}</option>)}
        </select>
        <select value={filterSeverity} onChange={e=>setFilterSeverity(e.target.value)} style={{fontSize:12,padding:'5px 8px',border:'0.5px solid var(--bd-m)',borderRadius:'var(--r)',background:'var(--bg-p)',color:'var(--tx-p)'}}>
          <option value="">All severities</option>{SEVERITIES.map(s=><option key={s.v} value={s.v}>{s.label}</option>)}
        </select>
        <div style={{flex:1}}/>
        <button className="btn pri" onClick={()=>setShowModal(true)}>Report incident</button>
      </div>

      {shown.map(inc=>{
        const s = sev(inc.severity);
        const [resText, setResText] = useState('');
        return (
          <div key={inc.id} style={{background:'var(--bg-p)',border:'0.5px solid var(--bd)',borderRadius:'var(--rl)',marginBottom:10,overflow:'hidden'}}>
            <button style={{display:'flex',alignItems:'center',gap:10,padding:'11px 14px',width:'100%',background:'transparent',border:'none',textAlign:'left',cursor:'pointer'}} onClick={()=>tog(inc.id)}>
              <div style={{width:8,height:8,borderRadius:'50%',background:s.col,flexShrink:0}}></div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600}}>{inc.title}</div>
                <div style={{fontSize:10,color:'var(--tx-t)'}}>{inc.type} · {inc.site} · {inc.date} · Assigned to: {inc.assignee}</div>
              </div>
              <span style={{fontSize:10,padding:'2px 7px',borderRadius:'var(--r)',background:s.bg,color:s.col,fontWeight:600,marginRight:4}}>{s.label}</span>
              <span style={{fontSize:10,padding:'2px 7px',borderRadius:'var(--r)',background:statBg(inc.status),color:statCol(inc.status),fontWeight:600}}>{inc.status}</span>
              <span style={{fontSize:11,color:'var(--tx-t)',marginLeft:8}}>{open[inc.id]?'▲':'▼'}</span>
            </button>
            {open[inc.id]&&(
              <div style={{borderTop:'0.5px solid var(--bd)',padding:'14px 16px',background:'var(--bg-s)'}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:12,fontSize:12}}>
                  <div><span style={{color:'var(--tx-s)'}}>Site: </span>{inc.site}</div>
                  <div><span style={{color:'var(--tx-s)'}}>Reported by: </span>{inc.reporter}</div>
                  <div><span style={{color:'var(--tx-s)'}}>Due: </span><span style={{color:inc.status!=='closed'&&new Date(inc.dueDate)<new Date()?'var(--tx-err)':''}}>{inc.dueDate}</span></div>
                </div>
                <div style={{fontSize:12,marginBottom:12,padding:'10px',background:'var(--bg-p)',borderRadius:'var(--r)',border:'0.5px solid var(--bd)'}}>
                  <div style={{fontSize:11,fontWeight:600,color:'var(--tx-s)',marginBottom:4}}>Incident notes</div>
                  {inc.notes}
                </div>
                {inc.resolution&&(
                  <div style={{fontSize:12,marginBottom:12,padding:'10px',background:'var(--bg-suc)',borderRadius:'var(--r)',border:'0.5px solid #c0dd97'}}>
                    <div style={{fontSize:11,fontWeight:600,color:'var(--tx-suc)',marginBottom:4}}>Resolution</div>
                    {inc.resolution}
                  </div>
                )}
                {inc.docs&&inc.docs.length>0&&(
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:11,fontWeight:600,color:'var(--tx-s)',marginBottom:6}}>Attached documents</div>
                    {inc.docs.map((d,i)=>(
                      <div key={i} style={{display:'flex',alignItems:'center',gap:8,fontSize:11,padding:'4px 0'}}>
                        <svg viewBox="0 0 16 16" fill="none" stroke="var(--tx-info)" strokeWidth="1.5" width="12" height="12"><path d="M4 1h6l3 3v10a1 1 0 01-1 1H4a1 1 0 01-1-1V2a1 1 0 011-1zM10 1v3h3"/></svg>
                        <span style={{color:'var(--tx-info)'}}>{d}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:inc.status!=='closed'?12:0}}>
                  <UploadBtn label="Attach document" onUpload={fn=>uploadDoc(inc.id,fn)}/>
                  {inc.status!=='closed'&&STATUSES.filter(s=>s!==inc.status).map(s=>(
                    <button key={s} className="btn sm" onClick={()=>updateStatus(inc.id,s)}>Mark as: {s}</button>
                  ))}
                </div>
                {inc.status!=='closed'&&(
                  <div>
                    <div style={{fontSize:11,fontWeight:600,color:'var(--tx-s)',marginBottom:6}}>Add resolution & close</div>
                    <textarea value={resText} onChange={e=>setResText(e.target.value)} placeholder="Describe how this was resolved..." style={{width:'100%',padding:'8px',fontSize:12,border:'0.5px solid var(--bd-m)',borderRadius:'var(--r)',background:'var(--bg-p)',color:'var(--tx-p)',minHeight:60,fontFamily:'inherit',resize:'vertical',marginBottom:8}}/>
                    <button className="btn suc" onClick={()=>{ if(resText) addResolution(inc.id,resText); }}>Close incident with resolution</button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
