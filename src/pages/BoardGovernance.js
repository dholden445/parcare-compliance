import React, { useState } from 'react';

const INIT_MEMBERS = [
  { id:'b1', name:'Dr. Patricia Williams', role:'Board Chair', term:'Jan 2024 – Dec 2026', termExpiry:'2026-12-31', committee:'Executive', email:'pwilliams@board.parcare.org', coi:true, coiDate:'Jan 15, 2026', training:'done', docs:{} },
  { id:'b2', name:'Robert Chen, CPA', role:'Treasurer', term:'Jan 2023 – Dec 2025', termExpiry:'2025-12-31', committee:'Finance', email:'rchen@board.parcare.org', coi:true, coiDate:'Jan 15, 2026', training:'done', docs:{} },
  { id:'b3', name:'Angela Morales', role:'Secretary', term:'Jan 2025 – Dec 2027', termExpiry:'2027-12-31', committee:'Executive', email:'amorales@board.parcare.org', coi:true, coiDate:'Jan 15, 2026', training:'done', docs:{} },
  { id:'b4', name:'James Thompson, MD', role:'Board Member', term:'Jan 2025 – Dec 2027', termExpiry:'2027-12-31', committee:'Quality', email:'jthompson@board.parcare.org', coi:false, coiDate:'', training:'missing', docs:{} },
  { id:'b5', name:'Sarah Okonkwo', role:'Board Member — Patient Rep', term:'Jan 2026 – Dec 2028', termExpiry:'2028-12-31', committee:'Community', email:'sokonkwo@board.parcare.org', coi:true, coiDate:'Jan 20, 2026', training:'done', docs:{} },
  { id:'b6', name:'Michael Park, Esq.', role:'Board Member', term:'Jan 2024 – Dec 2026', termExpiry:'2026-12-31', committee:'Executive', email:'mpark@board.parcare.org', coi:true, coiDate:'Jan 15, 2026', training:'done', docs:{} },
  { id:'b7', name:'Dr. Fatima Hassan', role:'Board Member', term:'Jan 2026 – Dec 2028', termExpiry:'2028-12-31', committee:'Quality', email:'fhassan@board.parcare.org', coi:false, coiDate:'', training:'missing', docs:{} },
];

const INIT_MEETINGS = [
  { id:'m1', date:'Apr 18, 2026', type:'Regular board meeting', quorum:true, attendees:6, notes:'Approved FY2027 budget. Reviewed Q1 quality metrics. Tabled sliding fee scale update.', mins:'board_minutes_apr_2026.pdf', docs:[] },
  { id:'m2', date:'Mar 21, 2026', type:'Regular board meeting', quorum:true, attendees:7, notes:'Reviewed annual compliance report. Approved credentialing re-verification policy.', mins:'board_minutes_mar_2026.pdf', docs:[] },
  { id:'m3', date:'Feb 21, 2026', type:'Regular board meeting', quorum:true, attendees:6, notes:'Reviewed HRSA grant renewal. Approved new site manager hires at all four sites.', mins:'board_minutes_feb_2026.pdf', docs:[] },
  { id:'m4', date:'May 16, 2026', type:'Regular board meeting', quorum:false, attendees:0, notes:'', mins:'', docs:[] },
  { id:'m5', date:'Jun 20, 2026', type:'Annual meeting', quorum:false, attendees:0, notes:'', mins:'', docs:[] },
];

function UploadBtn({ label='Upload', onUpload }) {
  return (
    <label style={{display:'inline-block',cursor:'pointer'}}>
      <input type="file" style={{display:'none'}} onChange={e=>{ if(e.target.files[0]){ const n=e.target.files[0].name; if(onUpload)onUpload(n); }}}/>
      <span className="btn pri" style={{fontSize:10}}>{label}</span>
    </label>
  );
}

function daysUntil(d) { return Math.round((new Date(d)-new Date())/86400000); }

export default function BoardGovernance() {
  const [members, setMembers] = useState(INIT_MEMBERS);
  const [meetings, setMeetings] = useState(INIT_MEETINGS);
  const [activeTab, setActiveTab] = useState('members');
  const [open, setOpen] = useState({});
  const tog = id => setOpen(p=>({...p,[id]:!p[id]}));

  const uploadMins = (id, fn) => setMeetings(p=>p.map(m=>m.id===id?{...m,mins:fn}:m));
  const markCOI = (id) => setMembers(p=>p.map(m=>m.id===id?{...m,coi:true,coiDate:new Date().toLocaleDateString()}:m));

  const missingCOI = members.filter(m=>!m.coi).length;
  const missingTraining = members.filter(m=>m.training==='missing').length;
  const expiring = members.filter(m=>{ const d=daysUntil(m.termExpiry); return d>=0&&d<=180; }).length;

  return (
    <div>
      <div className="mets">
        <div className="met"><div className="met-l">Board members</div><div className="met-v">{members.length}</div></div>
        <div className="met"><div className="met-l">COI forms missing</div><div className="met-v" style={{color:missingCOI>0?'#A32D2D':'#639922'}}>{missingCOI}</div></div>
        <div className="met"><div className="met-l">Training incomplete</div><div className="met-v" style={{color:missingTraining>0?'#BA7517':'#639922'}}>{missingTraining}</div></div>
        <div className="met"><div className="met-l">Terms expiring (180d)</div><div className="met-v" style={{color:expiring>0?'#BA7517':'#639922'}}>{expiring}</div></div>
      </div>

      <div className="site-tabs" style={{marginBottom:14}}>
        {[{id:'members',label:'Board members'},{id:'meetings',label:'Meeting minutes'},{id:'docs',label:'Governance documents'}].map(t=>(
          <button key={t.id} className={'stab'+(activeTab===t.id?' active':'')} onClick={()=>setActiveTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {activeTab==='members'&&(
        <div>
          <div style={{display:'flex',justifyContent:'flex-end',marginBottom:12}}>
            <button className="btn pri">Add board member</button>
          </div>
          {members.map(m=>{
            const days=daysUntil(m.termExpiry);
            const termAlert=days>=0&&days<=180;
            return (
              <div key={m.id} style={{background:'var(--bg-p)',border:'0.5px solid var(--bd)',borderRadius:'var(--rl)',marginBottom:8,overflow:'hidden'}}>
                <button style={{display:'flex',alignItems:'center',gap:10,padding:'11px 14px',width:'100%',background:'transparent',border:'none',textAlign:'left',cursor:'pointer'}} onClick={()=>tog(m.id)}>
                  <div style={{width:36,height:36,borderRadius:'50%',background:'var(--bg-info)',color:'var(--tx-info)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,flexShrink:0}}>
                    {m.name.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase()}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:600}}>{m.name}</div>
                    <div style={{fontSize:10,color:'var(--tx-t)'}}>{m.role} · {m.committee} committee · {m.term}</div>
                  </div>
                  {!m.coi&&<span className="bdg err" style={{fontSize:10}}>COI missing</span>}
                  {m.training==='missing'&&<span className="bdg warn" style={{fontSize:10}}>Training missing</span>}
                  {termAlert&&<span className="bdg warn" style={{fontSize:10}}>Term expires {days}d</span>}
                  {m.coi&&m.training==='done'&&!termAlert&&<span className="bdg ok" style={{fontSize:10}}>Compliant</span>}
                  <span style={{fontSize:11,color:'var(--tx-t)',marginLeft:8}}>{open[m.id]?'▲':'▼'}</span>
                </button>
                {open[m.id]&&(
                  <div style={{borderTop:'0.5px solid var(--bd)',padding:'14px',background:'var(--bg-s)'}}>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:12,fontSize:12}}>
                      <div><span style={{color:'var(--tx-s)'}}>Email: </span>{m.email}</div>
                      <div><span style={{color:'var(--tx-s)'}}>Committee: </span>{m.committee}</div>
                      <div><span style={{color:'var(--tx-s)'}}>Term: </span>{m.term}</div>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
                      <div style={{background:'var(--bg-p)',borderRadius:'var(--r)',padding:'10px 12px',border:`0.5px solid ${m.coi?'var(--bd)':'#f09595'}`}}>
                        <div style={{fontSize:11,fontWeight:600,marginBottom:6}}>Conflict of interest disclosure</div>
                        {m.coi
                          ? <><div style={{fontSize:11,color:'var(--tx-suc)',marginBottom:6}}>✓ Filed: {m.coiDate}</div><UploadBtn label="Replace COI form"/></>
                          : <><div style={{fontSize:11,color:'var(--tx-err)',marginBottom:6}}>⚠ Not yet filed for 2026</div><div style={{display:'flex',gap:6}}><button className="btn sm" onClick={()=>markCOI(m.id)}>Mark filed</button><UploadBtn label="Upload COI form"/></div></>
                        }
                      </div>
                      <div style={{background:'var(--bg-p)',borderRadius:'var(--r)',padding:'10px 12px',border:`0.5px solid ${m.training==='done'?'var(--bd)':'#fac775'}`}}>
                        <div style={{fontSize:11,fontWeight:600,marginBottom:6}}>Board governance training</div>
                        {m.training==='done'
                          ? <div style={{fontSize:11,color:'var(--tx-suc)'}}>✓ Completed</div>
                          : <><div style={{fontSize:11,color:'var(--tx-warn)',marginBottom:6}}>Not yet completed</div><button className="btn sm" onClick={()=>setMembers(p=>p.map(bm=>bm.id===m.id?{...bm,training:'done'}:bm))}>Mark complete</button></>
                        }
                      </div>
                    </div>
                    <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                      <UploadBtn label="Upload board member agreement"/>
                      <UploadBtn label="Upload COI form"/>
                      <UploadBtn label="Upload other document"/>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab==='meetings'&&(
        <div>
          <div style={{display:'flex',justifyContent:'flex-end',marginBottom:12}}>
            <button className="btn pri">Schedule meeting</button>
          </div>
          {meetings.map(m=>(
            <div key={m.id} style={{background:'var(--bg-p)',border:'0.5px solid var(--bd)',borderRadius:'var(--rl)',marginBottom:8,padding:'12px 14px'}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:m.mins?8:0}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:600}}>{m.date} — {m.type}</div>
                  {m.quorum&&<div style={{fontSize:10,color:'var(--tx-t)',marginTop:2}}>Quorum met · {m.attendees} members present</div>}
                  {!m.quorum&&<div style={{fontSize:10,color:'var(--tx-warn)',marginTop:2}}>Upcoming — minutes not yet available</div>}
                  {m.notes&&<div style={{fontSize:11,color:'var(--tx-s)',marginTop:4}}>{m.notes}</div>}
                </div>
                {m.mins
                  ? <div style={{display:'flex',gap:6,alignItems:'center'}}>
                      <div style={{fontSize:10,color:'var(--tx-suc)',display:'flex',alignItems:'center',gap:4}}><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="11" height="11"><path d="M4 1h6l3 3v10a1 1 0 01-1 1H4a1 1 0 01-1-1V2a1 1 0 011-1zM10 1v3h3"/></svg>{m.mins}</div>
                      <UploadBtn label="Replace" onUpload={fn=>uploadMins(m.id,fn)}/>
                    </div>
                  : m.quorum&&<UploadBtn label="Upload minutes" onUpload={fn=>uploadMins(m.id,fn)}/>
                }
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab==='docs'&&(
        <div>
          <div style={{display:'flex',justifyContent:'flex-end',marginBottom:12}}>
            <UploadBtn label="Upload governance document"/>
          </div>
          {[
            {name:'Board bylaws',status:'Current',updated:'Jan 2024'},
            {name:'Board member roster — current',status:'Current',updated:'Apr 2026'},
            {name:'Conflict of interest policy',status:'Current',updated:'Jan 2026'},
            {name:'Board conflict of interest disclosures — 2026',status:'Partial — 2 missing',updated:'Jan 2026'},
            {name:'Board training completion log — 2026',status:'Incomplete',updated:'Jan 2026'},
            {name:'Board committee charters',status:'Current',updated:'Jan 2024'},
            {name:'Executive compensation policy',status:'Current',updated:'Jan 2025'},
            {name:'Whistleblower protection policy',status:'Current',updated:'Jan 2024'},
            {name:'Document retention policy',status:'Current',updated:'Jan 2024'},
          ].map((d,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',background:'var(--bg-p)',borderRadius:'var(--r)',marginBottom:6,border:'0.5px solid var(--bd)'}}>
              <div style={{flex:1,fontSize:12,fontWeight:500}}>{d.name}</div>
              <div style={{fontSize:11,color:'var(--tx-t)'}}>{d.updated}</div>
              <div style={{fontSize:11,color:d.status==='Current'?'var(--tx-suc)':'var(--tx-warn)',fontWeight:600}}>{d.status}</div>
              <UploadBtn label="Upload"/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
