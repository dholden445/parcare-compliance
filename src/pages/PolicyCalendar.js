import React, { useState } from 'react';

const INIT_POLICIES = [
  { id:'pr1', name:'CLIN-001 Credentialing & Privileging Policy', cat:'Clinical', owner:'Medical Director', lastReview:'Jan 15, 2026', nextReview:'2027-01-15', freq:'Biennial', status:'current', version:'v1.0', approver:'Medical Director', approvalDate:'Jan 15, 2026', docs:[] },
  { id:'pr2', name:'CLIN-002 Scope of Services & Accessible Hours', cat:'Clinical', owner:'CEO', lastReview:'Feb 1, 2026', nextReview:'2027-02-01', freq:'Annual', status:'current', version:'v1.0', approver:'CEO', approvalDate:'Feb 1, 2026', docs:[] },
  { id:'pr3', name:'CLIN-003 After-Hours & Emergency Coverage', cat:'Clinical', owner:'Medical Director', lastReview:'Feb 1, 2026', nextReview:'2027-02-01', freq:'Annual', status:'current', version:'v1.0', approver:'Medical Director', approvalDate:'Feb 1, 2026', docs:[] },
  { id:'pr4', name:'CLIN-004 Language Access & Cultural Competency', cat:'Clinical', owner:'COO', lastReview:'Feb 15, 2026', nextReview:'2027-02-15', freq:'Annual', status:'current', version:'v1.0', approver:'COO', approvalDate:'Feb 15, 2026', docs:[] },
  { id:'pr5', name:'CLIN-005 Referral Tracking Policy', cat:'Clinical', owner:'Medical Director', lastReview:'Feb 15, 2026', nextReview:'2027-02-15', freq:'Annual', status:'current', version:'v1.0', approver:'Medical Director', approvalDate:'Feb 15, 2026', docs:[] },
  { id:'pr6', name:'CLIN-006 QA/QI Program Policy', cat:'Clinical', owner:'Medical Director', lastReview:'Apr 1, 2025', nextReview:'2026-04-01', freq:'Annual', status:'due', version:'v1.0', approver:'Medical Director', approvalDate:'Apr 1, 2025', docs:[] },
  { id:'pr7', name:'HIPAA Privacy & Security Policy', cat:'Compliance', owner:'Compliance Officer', lastReview:'Jan 1, 2026', nextReview:'2027-01-01', freq:'Annual', status:'current', version:'v2.0', approver:'Compliance Officer', approvalDate:'Jan 1, 2026', docs:[] },
  { id:'pr8', name:'Sliding Fee Discount Program Policy', cat:'Administrative', owner:'CEO', lastReview:'Mar 1, 2025', nextReview:'2026-03-01', freq:'Annual', status:'overdue', version:'v1.0', approver:'Board of Directors', approvalDate:'Mar 1, 2025', docs:[] },
  { id:'pr9', name:'Employee Code of Conduct', cat:'HR', owner:'HR Director', lastReview:'Jan 15, 2026', nextReview:'2027-01-15', freq:'Annual', status:'current', version:'v1.0', approver:'HR Director', approvalDate:'Jan 15, 2026', docs:[] },
  { id:'pr10', name:'Workplace Violence Prevention Policy', cat:'HR', owner:'HR Director', lastReview:'Jan 15, 2026', nextReview:'2027-01-15', freq:'Annual', status:'current', version:'v1.0', approver:'HR Director', approvalDate:'Jan 15, 2026', docs:[] },
  { id:'pr11', name:'Infection Control Policy', cat:'Clinical', owner:'Medical Director', lastReview:'Jan 1, 2026', nextReview:'2026-07-01', freq:'Biannual', status:'upcoming', version:'v1.0', approver:'Medical Director', approvalDate:'Jan 1, 2026', docs:[] },
  { id:'pr12', name:'Patient Rights & Responsibilities Policy', cat:'Administrative', owner:'CEO', lastReview:'Jan 1, 2026', nextReview:'2027-01-01', freq:'Annual', status:'current', version:'v1.0', approver:'CEO', approvalDate:'Jan 1, 2026', docs:[] },
  { id:'pr13', name:'Grievance & Complaint Policy', cat:'Administrative', owner:'Compliance Officer', lastReview:'Jan 1, 2026', nextReview:'2027-01-01', freq:'Annual', status:'current', version:'v1.0', approver:'Compliance Officer', approvalDate:'Jan 1, 2026', docs:[] },
  { id:'pr14', name:'No-Show & Cancellation Policy', cat:'Administrative', owner:'COO', lastReview:'Jan 1, 2026', nextReview:'2027-01-01', freq:'Annual', status:'current', version:'v1.0', approver:'COO', approvalDate:'Jan 1, 2026', docs:[] },
  { id:'pr15', name:'PM-01 Trigger Point & Regenerative Modalities Protocol', cat:'Clinical', owner:'Medical Director', lastReview:'Apr 1, 2026', nextReview:'2027-04-01', freq:'Annual', status:'current', version:'v1.0', approver:'Medical Director', approvalDate:'Apr 1, 2026', docs:[] },
];

const CATS = ['All','Clinical','Administrative','HR','Compliance','Operations'];
const STATUS_CONFIG = {
  current:{ col:'var(--tx-suc)', bg:'var(--bg-suc)', label:'Current' },
  upcoming:{ col:'var(--tx-info)', bg:'var(--bg-info)', label:'Due soon' },
  due:{ col:'var(--tx-warn)', bg:'var(--bg-warn)', label:'Review due' },
  overdue:{ col:'var(--tx-err)', bg:'var(--bg-err)', label:'Overdue' },
  'in review':{ col:'var(--tx-info)', bg:'var(--bg-info)', label:'In review' },
};

function daysUntil(dateStr) {
  return Math.round((new Date(dateStr) - new Date()) / 86400000);
}

function UploadBtn({ label='Upload', onUpload }) {
  return (
    <label style={{display:'inline-block',cursor:'pointer'}}>
      <input type="file" style={{display:'none'}} onChange={e=>{ if(e.target.files[0]){ const n=e.target.files[0].name; if(onUpload)onUpload(n); }}}/>
      <span className="btn pri" style={{fontSize:10}}>{label}</span>
    </label>
  );
}

export default function PolicyCalendar() {
  const [policies, setPolicies] = useState(INIT_POLICIES);
  const [catFilter, setCatFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('');
  const [open, setOpen] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name:'', cat:'Clinical', owner:'', freq:'Annual', version:'v1.0', approver:'' });

  const tog = id => setOpen(p=>({...p,[id]:!p[id]}));

  const markReviewed = (id) => {
    const today = new Date();
    const nextYear = new Date(today);
    nextYear.setFullYear(today.getFullYear()+1);
    setPolicies(p=>p.map(pol=>pol.id===id?{...pol,status:'current',lastReview:today.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}),nextReview:nextYear.toISOString().split('T')[0],version:'v'+(parseFloat(pol.version.replace('v',''))+0.1).toFixed(1)}:pol));
  };

  const uploadDoc = (id, fn) => setPolicies(p=>p.map(pol=>pol.id===id?{...pol,docs:[...(pol.docs||[]),fn]}:pol));

  const addPolicy = () => {
    if (!form.name) return;
    const today = new Date();
    const next = new Date(today); next.setFullYear(today.getFullYear()+1);
    setPolicies(p=>[...p,{ id:'pr'+Date.now(), ...form, lastReview:today.toLocaleDateString(), nextReview:next.toISOString().split('T')[0], status:'current', approvalDate:today.toLocaleDateString(), docs:[] }]);
    setShowModal(false);
    setForm({ name:'', cat:'Clinical', owner:'', freq:'Annual', version:'v1.0', approver:'' });
  };

  const shown = policies.filter(p=>
    (catFilter==='All'||p.cat===catFilter)&&(!statusFilter||p.status===statusFilter)
  ).sort((a,b)=>new Date(a.nextReview)-new Date(b.nextReview));

  return (
    <div>
      {showModal&&(
        <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal">
            <div className="modal-t">Add policy to review calendar</div>
            <div className="fl"><label>Policy name</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Full policy name"/></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <div className="fl"><label>Category</label><select value={form.cat} onChange={e=>setForm(p=>({...p,cat:e.target.value}))}>{CATS.filter(c=>c!=='All').map(c=><option key={c}>{c}</option>)}</select></div>
              <div className="fl"><label>Review frequency</label><select value={form.freq} onChange={e=>setForm(p=>({...p,freq:e.target.value}))}><option>Annual</option><option>Biennial</option><option>Biannual</option><option>As needed</option></select></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <div className="fl"><label>Policy owner</label><input value={form.owner} onChange={e=>setForm(p=>({...p,owner:e.target.value}))} placeholder="e.g. Medical Director"/></div>
              <div className="fl"><label>Approver</label><input value={form.approver} onChange={e=>setForm(p=>({...p,approver:e.target.value}))} placeholder="e.g. CEO"/></div>
            </div>
            <div className="fl"><label>Current version</label><input value={form.version} onChange={e=>setForm(p=>({...p,version:e.target.value}))} placeholder="e.g. v1.0"/></div>
            <div className="fl"><label>Attach current policy document</label><UploadBtn label="Choose file"/></div>
            <div className="fa"><button className="btn" onClick={()=>setShowModal(false)}>Cancel</button><button className="btn pri" onClick={addPolicy}>Add policy</button></div>
          </div>
        </div>
      )}

      <div className="mets">
        <div className="met"><div className="met-l">Total policies tracked</div><div className="met-v">{policies.length}</div></div>
        <div className="met"><div className="met-l">Current / up to date</div><div className="met-v" style={{color:'#639922'}}>{policies.filter(p=>p.status==='current').length}</div></div>
        <div className="met"><div className="met-l">Due for review</div><div className="met-v" style={{color:'#BA7517'}}>{policies.filter(p=>p.status==='due'||p.status==='upcoming').length}</div></div>
        <div className="met"><div className="met-l">Overdue</div><div className="met-v" style={{color:'#A32D2D'}}>{policies.filter(p=>p.status==='overdue').length}</div></div>
      </div>

      <div style={{background:'var(--bg-info)',borderRadius:'var(--r)',padding:'10px 14px',marginBottom:14,fontSize:12,color:'var(--tx-info)'}}>
        <strong>Policy review calendar</strong> — Policies are sorted by upcoming review date. Policies due within 60 days are flagged. When a review is completed, click "Mark reviewed & approved" to log the new version and auto-schedule the next review date.
      </div>

      <div className="tbar">
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          {CATS.map(c=><button key={c} className={'stab'+(catFilter===c?' active':'')} onClick={()=>setCatFilter(c)} style={{padding:'4px 10px',fontSize:11}}>{c}</button>)}
        </div>
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={{fontSize:12,padding:'5px 8px',border:'0.5px solid var(--bd-m)',borderRadius:'var(--r)',background:'var(--bg-p)',color:'var(--tx-p)'}}>
          <option value="">All statuses</option>
          <option value="overdue">Overdue</option><option value="due">Review due</option><option value="upcoming">Due soon</option><option value="current">Current</option>
        </select>
        <div style={{flex:1}}/>
        <button className="btn pri" onClick={()=>setShowModal(true)}>Add policy</button>
      </div>

      {shown.map(pol=>{
        const sc = STATUS_CONFIG[pol.status]||STATUS_CONFIG.current;
        const days = daysUntil(pol.nextReview);
        const urgent = days<=60 && pol.status!=='current';
        return (
          <div key={pol.id} style={{background:'var(--bg-p)',border:`0.5px solid ${urgent?'#f09595':'var(--bd)'}`,borderRadius:'var(--rl)',marginBottom:8,overflow:'hidden'}}>
            <button style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',width:'100%',background:'transparent',border:'none',textAlign:'left',cursor:'pointer'}} onClick={()=>tog(pol.id)}>
              <div style={{width:6,height:32,borderRadius:3,background:sc.col,flexShrink:0}}></div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600}}>{pol.name}</div>
                <div style={{fontSize:10,color:'var(--tx-t)'}}>{pol.cat} · {pol.freq} review · Owner: {pol.owner} · {pol.version}</div>
              </div>
              <div style={{textAlign:'right',marginRight:8}}>
                <div style={{fontSize:10,color:'var(--tx-t)'}}>Next review</div>
                <div style={{fontSize:11,fontWeight:600,color:days<0?'var(--tx-err)':days<=60?'var(--tx-warn)':'var(--tx-t)'}}>{new Date(pol.nextReview).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</div>
                {days<0&&<div style={{fontSize:10,color:'var(--tx-err)'}}>{'Overdue by '+Math.abs(days)+' days'}</div>}
                {days>=0&&days<=90&&<div style={{fontSize:10,color:'var(--tx-warn)'}}>{days+' days away'}</div>}
              </div>
              <span style={{fontSize:10,padding:'2px 7px',borderRadius:'var(--r)',background:sc.bg,color:sc.col,fontWeight:600}}>{sc.label}</span>
              <span style={{fontSize:11,color:'var(--tx-t)',marginLeft:8}}>{open[pol.id]?'▲':'▼'}</span>
            </button>
            {open[pol.id]&&(
              <div style={{borderTop:'0.5px solid var(--bd)',padding:'14px 16px',background:'var(--bg-s)'}}>
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:14,fontSize:12}}>
                  <div><div style={{fontSize:10,color:'var(--tx-t)',marginBottom:2}}>Category</div><div style={{fontWeight:500}}>{pol.cat}</div></div>
                  <div><div style={{fontSize:10,color:'var(--tx-t)',marginBottom:2}}>Policy owner</div><div style={{fontWeight:500}}>{pol.owner}</div></div>
                  <div><div style={{fontSize:10,color:'var(--tx-t)',marginBottom:2}}>Last reviewed</div><div style={{fontWeight:500}}>{pol.lastReview}</div></div>
                  <div><div style={{fontSize:10,color:'var(--tx-t)',marginBottom:2}}>Approver</div><div style={{fontWeight:500}}>{pol.approver}</div></div>
                </div>
                {pol.docs&&pol.docs.length>0&&(
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:11,fontWeight:600,color:'var(--tx-s)',marginBottom:6}}>Policy documents on file</div>
                    {pol.docs.map((d,i)=>(
                      <div key={i} style={{display:'flex',alignItems:'center',gap:8,fontSize:11,padding:'4px 0',color:'var(--tx-info)'}}><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="12" height="12"><path d="M4 1h6l3 3v10a1 1 0 01-1 1H4a1 1 0 01-1-1V2a1 1 0 011-1zM10 1v3h3"/></svg>{d}</div>
                    ))}
                  </div>
                )}
                <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
                  {pol.status!=='current'&&<button className="btn suc" onClick={()=>markReviewed(pol.id)}>✓ Mark reviewed & approved — auto-schedule next review</button>}
                  <UploadBtn label="Upload policy document" onUpload={fn=>uploadDoc(pol.id,fn)}/>
                  <UploadBtn label="Upload approval memo" onUpload={fn=>uploadDoc(pol.id,fn)}/>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
