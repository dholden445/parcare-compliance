import React, { useState } from 'react';

const INIT_PROVIDERS = [
  { id:'p1', name:'Dr. Sarah Cohen', title:'Medical Director, MD', site:'All sites', npi:'1234567890', specialty:'Internal Medicine',
    license:{ number:'MD-123456', state:'NY', expiry:'2027-06-30', status:'current' },
    dea:{ number:'AC1234567', expiry:'2026-09-30', status:'expiring' },
    board:{ cert:'ABIM Internal Medicine', expiry:'2028-12-31', status:'current' },
    malpractice:{ carrier:'MLMIC', policyNum:'ML-9876', expiry:'2026-12-31', status:'current' },
    cms:{ enrolled:true, enrollmentDate:'2019-01-01', ptan:'A123456' },
    cme:{ required:50, completed:32, period:'2025-2027' },
    docs:{} },
  { id:'p2', name:'Dr. James Okafor', title:'Physician, MD', site:'Bay Parkway', npi:'0987654321', specialty:'Family Medicine',
    license:{ number:'MD-654321', state:'NY', expiry:'2026-11-30', status:'expiring' },
    dea:{ number:'BO9876543', expiry:'2027-03-31', status:'current' },
    board:{ cert:'ABFM Family Medicine', expiry:'2027-06-30', status:'current' },
    malpractice:{ carrier:'MLMIC', policyNum:'ML-1111', expiry:'2026-12-31', status:'current' },
    cms:{ enrolled:true, enrollmentDate:'2021-03-01', ptan:'B654321' },
    cme:{ required:50, completed:48, period:'2025-2027' },
    docs:{} },
  { id:'p3', name:'Maria Santos, NP', title:'Nurse Practitioner', site:'Williamsburg', npi:'1122334455', specialty:'Primary Care',
    license:{ number:'NP-789012', state:'NY', expiry:'2025-12-31', status:'expired' },
    dea:{ number:'BS7654321', expiry:'2026-06-30', status:'current' },
    board:{ cert:'ANCC Family NP', expiry:'2026-08-31', status:'current' },
    malpractice:{ carrier:'MLMIC', policyNum:'ML-2222', expiry:'2026-12-31', status:'current' },
    cms:{ enrolled:true, enrollmentDate:'2022-06-01', ptan:'C789012' },
    cme:{ required:45, completed:45, period:'2025-2026' },
    docs:{} },
];

const STATUS_COLORS = { current:'var(--tx-suc)', expiring:'var(--tx-warn)', expired:'var(--tx-err)' };
const STATUS_BG = { current:'var(--bg-suc)', expiring:'var(--bg-warn)', expired:'var(--bg-err)' };

function daysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.round((new Date(dateStr) - new Date()) / 86400000);
}

function ExpiryBadge({ date, status }) {
  const days = daysUntil(date);
  if (!date) return null;
  const d = new Date(date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
  return (
    <span style={{ fontSize:10, padding:'2px 7px', borderRadius:'var(--r)', background:STATUS_BG[status], color:STATUS_COLORS[status], fontWeight:600 }}>
      {status==='expired'?'Expired: ':status==='expiring'?`⚠ ${days}d: `:'Exp: '}{d}
    </span>
  );
}

function UploadBtn({ label='Upload', onUpload }) {
  return (
    <label style={{display:'inline-block',cursor:'pointer'}}>
      <input type="file" style={{display:'none'}} onChange={e=>{ if(e.target.files[0]){ const n=e.target.files[0].name; if(onUpload)onUpload(n); else alert('"'+n+'" uploaded.'); }}}/>
      <span className="btn pri" style={{fontSize:10}}>{label}</span>
    </label>
  );
}

export default function Credentialing() {
  const [providers, setProviders] = useState(INIT_PROVIDERS);
  const [open, setOpen] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name:'', title:'', site:'All sites', npi:'', specialty:'' });

  const tog = id => setOpen(p=>({...p,[id]:!p[id]}));

  const getAlerts = (p) => {
    const alerts = [];
    const items = [
      { label:'Medical license', date:p.license?.expiry, status:p.license?.status },
      { label:'DEA certificate', date:p.dea?.expiry, status:p.dea?.status },
      { label:'Board certification', date:p.board?.expiry, status:p.board?.status },
      { label:'Malpractice insurance', date:p.malpractice?.expiry, status:p.malpractice?.status },
    ];
    items.forEach(item => {
      if (item.status === 'expired') alerts.push({ level:'err', msg: item.label+' — EXPIRED' });
      else if (item.status === 'expiring') alerts.push({ level:'warn', msg: item.label+' — expiring in '+daysUntil(item.date)+' days' });
    });
    if (p.cme && p.cme.completed < p.cme.required) alerts.push({ level:'warn', msg:`CME: ${p.cme.completed}/${p.cme.required} hours completed` });
    return alerts;
  };

  const addProvider = () => {
    if (!form.name) return;
    setProviders(prev=>[...prev, { id:'p'+Date.now(), ...form,
      license:{number:'',state:'NY',expiry:'',status:'current'},
      dea:{number:'',expiry:'',status:'current'},
      board:{cert:'',expiry:'',status:'current'},
      malpractice:{carrier:'',policyNum:'',expiry:'',status:'current'},
      cms:{enrolled:false,enrollmentDate:'',ptan:''},
      cme:{required:50,completed:0,period:'2025-2027'},
      docs:{} }]);
    setShowModal(false);
    setForm({ name:'', title:'', site:'All sites', npi:'', specialty:'' });
  };

  const expiring = providers.filter(p=>
    p.license?.status==='expired'||p.license?.status==='expiring'||
    p.dea?.status==='expired'||p.dea?.status==='expiring'
  ).length;

  return (
    <div>
      {showModal&&(
        <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal">
            <div className="modal-t">Add provider</div>
            <div className="fl"><label>Full name & credentials</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. Dr. Jane Smith, MD"/></div>
            <div className="fl"><label>Title</label><input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Physician, Nurse Practitioner"/></div>
            <div className="fl"><label>Primary site</label><select value={form.site} onChange={e=>setForm(p=>({...p,site:e.target.value}))}><option>All sites</option><option>Bay Parkway</option><option>16th Ave</option><option>Williamsburg</option><option>Rambam</option></select></div>
            <div className="fl"><label>NPI number</label><input value={form.npi} onChange={e=>setForm(p=>({...p,npi:e.target.value}))} placeholder="10-digit NPI"/></div>
            <div className="fl"><label>Specialty</label><input value={form.specialty} onChange={e=>setForm(p=>({...p,specialty:e.target.value}))} placeholder="e.g. Internal Medicine"/></div>
            <div className="fa"><button className="btn" onClick={()=>setShowModal(false)}>Cancel</button><button className="btn pri" onClick={addProvider}>Add provider</button></div>
          </div>
        </div>
      )}

      <div className="mets">
        <div className="met"><div className="met-l">Total providers</div><div className="met-v">{providers.length}</div></div>
        <div className="met"><div className="met-l">Licenses current</div><div className="met-v" style={{color:'#639922'}}>{providers.filter(p=>p.license?.status==='current').length}</div></div>
        <div className="met"><div className="met-l">Expiring / expired</div><div className="met-v" style={{color:expiring>0?'#A32D2D':'#639922'}}>{expiring}</div><div className="met-s">Needs action</div></div>
        <div className="met"><div className="met-l">OIG/SAM check</div><div className="met-v" style={{color:'#639922'}}>Current</div><div className="met-s">Last run Apr 21, 2026</div></div>
      </div>

      {expiring>0&&(
        <div style={{background:'var(--bg-err)',border:'0.5px solid #f09595',borderRadius:'var(--r)',padding:'10px 14px',marginBottom:14,fontSize:12,color:'var(--tx-err)'}}>
          <strong>⚠ Action required:</strong> {expiring} provider{expiring>1?'s have':'has'} expired or expiring credentials. Review below and renew immediately to protect billing eligibility.
        </div>
      )}

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
        <div style={{fontSize:12,color:'var(--tx-s)'}}>Licenses, DEA, board certifications, malpractice, CME tracking — all in one place</div>
        <button className="btn pri" onClick={()=>setShowModal(true)}>Add provider</button>
      </div>

      {providers.map(p=>{
        const alerts = getAlerts(p);
        return (
          <div key={p.id} style={{background:'var(--bg-p)',border:'0.5px solid var(--bd)',borderRadius:'var(--rl)',marginBottom:10,overflow:'hidden'}}>
            <button style={{display:'flex',alignItems:'center',gap:10,padding:'12px 16px',width:'100%',background:'transparent',border:'none',textAlign:'left',cursor:'pointer'}} onClick={()=>tog(p.id)}>
              <div style={{width:38,height:38,borderRadius:'50%',background:'var(--bg-info)',color:'var(--tx-info)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0}}>
                {p.name.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase()}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600}}>{p.name}</div>
                <div style={{fontSize:11,color:'var(--tx-s)'}}>{p.title} · {p.specialty} · {p.site} · NPI: {p.npi}</div>
              </div>
              {alerts.length>0
                ? <span className="bdg err">{alerts.length} alert{alerts.length>1?'s':''}</span>
                : <span className="bdg ok">All current</span>
              }
              <span style={{fontSize:11,color:'var(--tx-t)',marginLeft:8}}>{open[p.id]?'▲':'▼'}</span>
            </button>

            {open[p.id]&&(
              <div style={{borderTop:'0.5px solid var(--bd)',padding:'16px',background:'var(--bg-s)'}}>
                {alerts.length>0&&(
                  <div style={{marginBottom:14}}>
                    {alerts.map((a,i)=>(
                      <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'6px 10px',background:a.level==='err'?'var(--bg-err)':'var(--bg-warn)',borderRadius:'var(--r)',marginBottom:4,fontSize:12,color:a.level==='err'?'var(--tx-err)':'var(--tx-warn)'}}>
                        <span>{a.level==='err'?'⛔':'⚠'}</span>{a.msg}
                      </div>
                    ))}
                  </div>
                )}

                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
                  {[
                    { label:'Medical license', num:p.license?.number, state:p.license?.state, date:p.license?.expiry, status:p.license?.status, docKey:'license' },
                    { label:'DEA certificate', num:p.dea?.number, date:p.dea?.expiry, status:p.dea?.status, docKey:'dea' },
                    { label:'Board certification', num:p.board?.cert, date:p.board?.expiry, status:p.board?.status, docKey:'board' },
                    { label:'Malpractice insurance', num:p.malpractice?.carrier+' · '+p.malpractice?.policyNum, date:p.malpractice?.expiry, status:p.malpractice?.status, docKey:'malpractice' },
                  ].map(item=>(
                    <div key={item.label} style={{background:'var(--bg-p)',borderRadius:'var(--r)',padding:'10px 12px',border:'0.5px solid var(--bd)'}}>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
                        <div style={{fontSize:11,fontWeight:600,color:'var(--tx-s)'}}>{item.label}</div>
                        <ExpiryBadge date={item.date} status={item.status}/>
                      </div>
                      <div style={{fontSize:11,color:'var(--tx-t)',marginBottom:8}}>{item.num}{item.state?' ('+item.state+')':''}</div>
                      <div style={{display:'flex',gap:6}}><UploadBtn label="Upload document"/><button className="btn sm">Set expiry</button></div>
                    </div>
                  ))}
                </div>

                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
                  <div style={{background:'var(--bg-p)',borderRadius:'var(--r)',padding:'10px 12px',border:'0.5px solid var(--bd)'}}>
                    <div style={{fontSize:11,fontWeight:600,color:'var(--tx-s)',marginBottom:6}}>CMS enrollment</div>
                    <div style={{fontSize:11,color:'var(--tx-t)',marginBottom:4}}>PTAN: {p.cms?.ptan||'Not entered'}</div>
                    <div style={{fontSize:11,color:'var(--tx-t)',marginBottom:8}}>Enrolled: {p.cms?.enrollmentDate||'—'}</div>
                    <UploadBtn label="Upload CMS docs"/>
                  </div>
                  <div style={{background:'var(--bg-p)',borderRadius:'var(--r)',padding:'10px 12px',border:'0.5px solid var(--bd)'}}>
                    <div style={{fontSize:11,fontWeight:600,color:'var(--tx-s)',marginBottom:6}}>CME tracking — {p.cme?.period}</div>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:4}}>
                      <span>{p.cme?.completed} / {p.cme?.required} hours</span>
                      <span style={{color:p.cme?.completed>=p.cme?.required?'var(--tx-suc)':'var(--tx-warn)',fontWeight:600}}>{Math.round(p.cme?.completed/p.cme?.required*100)}%</span>
                    </div>
                    <div className="pb" style={{marginBottom:8}}><div className="pf" style={{width:Math.min(100,Math.round(p.cme?.completed/p.cme?.required*100))+'%',background:p.cme?.completed>=p.cme?.required?'#639922':'#BA7517'}}></div></div>
                    <UploadBtn label="Upload CME certificate"/>
                  </div>
                </div>

                <div style={{paddingTop:10,borderTop:'0.5px solid var(--bd)'}}>
                  <div style={{fontSize:11,fontWeight:600,color:'var(--tx-s)',marginBottom:8}}>Provider documents</div>
                  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                    <UploadBtn label="Upload license copy"/>
                    <UploadBtn label="Upload DEA certificate"/>
                    <UploadBtn label="Upload board cert"/>
                    <UploadBtn label="Upload CV / resume"/>
                    <UploadBtn label="Upload other document"/>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
