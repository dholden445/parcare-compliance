import React, { useState } from 'react';

const ALERTS = [
  { id:'a1', level:'err', cat:'Credentialing', title:'Medical license EXPIRED — Maria Santos, NP', detail:'License NP-789012 expired Dec 31, 2025. Provider cannot bill until renewed. Contact NY State Education Department immediately.', assignee:'HR Director', due:'Immediate', page:'credentials', action:'Go to Credentialing' },
  { id:'a2', level:'err', cat:'Training', title:'HIPAA training overdue — 2 staff members', detail:'Daisy (MA Lead) and Site Mgr - Rambam have not completed their annual HIPAA training. Compliance deadline was Jan 1, 2026.', assignee:'HR Director', due:'Immediate', page:'training', action:'Go to Training tracker' },
  { id:'a3', level:'err', cat:'Compliance', title:'UDS annual data submission overdue', detail:'UDS data submission to HRSA EHB portal was due March 31, 2026. Failure to submit may impact grant funding.', assignee:'QI Coordinator', due:'Immediate', page:'comp', action:'Go to Compliance tracker' },
  { id:'a4', level:'err', cat:'Contracts', title:'Medical waste disposal contract expired', detail:'Contract with BioMedical Systems expired Dec 31, 2025. Operating without a valid medical waste contract is an Article 28 violation.', assignee:'Operations', due:'Immediate', page:'contracts', action:'Go to Contracts' },
  { id:'a5', level:'err', cat:'Compliance', title:'DOH annual self-inspection form overdue', detail:'Annual DOH self-inspection form submission was due. This is required for Article 28 compliance and must be submitted immediately.', assignee:'CEO', due:'Immediate', page:'comp', action:'Go to Compliance tracker' },
  { id:'a6', level:'warn', cat:'Credentialing', title:'DEA certificate expiring in 159 days — Dr. Cohen', detail:'DEA certificate AC1234567 expires September 30, 2026. Begin renewal process at least 60 days before expiration.', assignee:'HR Director', due:'Sep 30, 2026', page:'credentials', action:'Go to Credentialing' },
  { id:'a7', level:'warn', cat:'Credentialing', title:'Medical license expiring in 219 days — Dr. Okafor', detail:'License MD-654321 expires November 30, 2026. Submit renewal application to NY State at least 90 days before expiration.', assignee:'HR Director', due:'Nov 30, 2026', page:'credentials', action:'Go to Credentialing' },
  { id:'a8', level:'warn', cat:'Compliance', title:'Sliding fee scale — Board approval required by Apr 30', detail:'Updated sliding fee scale has not received Board approval. Required for HRSA compliance. Board meeting is scheduled for April 30.', assignee:'CEO / Board', due:'Apr 30, 2026', page:'comp', action:'Go to Compliance tracker' },
  { id:'a9', level:'warn', cat:'Fire safety', title:'Q2 fire drills pending — Bay Parkway & Rambam', detail:'Quarterly fire drills for Q2 2026 have not been completed at Bay Parkway and Rambam. Due by June 30, 2026.', assignee:'Site Managers', due:'Jun 30, 2026', page:'site', action:'Go to Site trainings' },
  { id:'a10', level:'warn', cat:'Policy review', title:'CLIN-006 QA/QI Policy — review overdue', detail:'CLIN-006 was due for annual review on April 1, 2026. Policy owner (Medical Director) must review, update if needed, and obtain re-approval.', assignee:'Medical Director', due:'Overdue', page:'policies', action:'Go to Policy calendar' },
  { id:'a11', level:'warn', cat:'Policy review', title:'Sliding Fee Discount Program Policy — review overdue', detail:'Policy was due for annual review March 1, 2026. Board approval required for any changes.', assignee:'CEO', due:'Overdue', page:'policies', action:'Go to Policy calendar' },
  { id:'a12', level:'warn', cat:'Site records', title:'QC log missing — Rambam April 2026', detail:'April 2026 QC log has not been submitted for Rambam. Required monthly for CLIA compliance.', assignee:'Site Mgr - Rambam', due:'May 1, 2026', page:'site', action:'Go to Site trainings' },
  { id:'a13', level:'warn', cat:'Site records', title:'Temperature log missing — Rambam April 2026', detail:'April 2026 temperature log has not been uploaded for Rambam. Required monthly for medication storage compliance.', assignee:'Site Mgr - Rambam', due:'May 1, 2026', page:'site', action:'Go to Site trainings' },
  { id:'a14', level:'info', cat:'Training renewal', title:'Training renewals due in 30 days — notify staff', detail:'Active Shooter Response and Workplace Violence trainings for 3 staff members are due for annual renewal by May 31, 2026. Automatic reminders sent to HR and employees.', assignee:'HR Director', due:'May 31, 2026', page:'training', action:'Go to Training tracker' },
  { id:'a15', level:'info', cat:'CLIA', title:'CLIA certificate renewal due Q3 2026 — all sites', detail:'All four site CLIA certificates are due for renewal in Q3 2026. Begin the renewal process 60 days before expiration date.', assignee:'Compliance Officer', due:'Jul 1, 2026', page:'comp', action:'Go to Compliance tracker' },
  { id:'a16', level:'info', cat:'Security risk', title:'Annual Security Risk Assessment due May 15', detail:'HIPAA requires an annual Security Risk Assessment (SRA). Due date is May 15, 2026. Assign to IT/Compliance for completion.', assignee:'IT / Compliance', due:'May 15, 2026', page:'comp', action:'Go to Compliance tracker' },
];

const LEVEL_CONFIG = {
  err:{ label:'Critical', col:'var(--tx-err)', bg:'var(--bg-err)', border:'#f09595', icon:'⛔' },
  warn:{ label:'Action required', col:'var(--tx-warn)', bg:'var(--bg-warn)', border:'#fac775', icon:'⚠' },
  info:{ label:'Upcoming', col:'var(--tx-info)', bg:'var(--bg-info)', border:'#b5d4f4', icon:'ℹ' },
};

const CATS = ['All','Credentialing','Training','Compliance','Contracts','Fire safety','Policy review','Site records','CLIA','Security risk','Training renewal'];

export default function AlertsCenter({ navigate }) {
  const [alerts, setAlerts] = useState(ALERTS.map(a=>({...a, dismissed:false, snoozed:false})));
  const [catFilter, setCatFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('');
  const [showDismissed, setShowDismissed] = useState(false);

  const dismiss = id => setAlerts(p=>p.map(a=>a.id===id?{...a,dismissed:true}:a));
  const snooze = id => setAlerts(p=>p.map(a=>a.id===id?{...a,snoozed:true}:a));
  const restore = id => setAlerts(p=>p.map(a=>a.id===id?{...a,dismissed:false,snoozed:false}:a));

  const shown = alerts.filter(a=>
    (showDismissed ? a.dismissed : !a.dismissed && !a.snoozed) &&
    (catFilter==='All'||a.cat===catFilter) &&
    (!levelFilter||a.level===levelFilter)
  );

  const critical = alerts.filter(a=>!a.dismissed&&!a.snoozed&&a.level==='err').length;
  const warning = alerts.filter(a=>!a.dismissed&&!a.snoozed&&a.level==='warn').length;
  const info = alerts.filter(a=>!a.dismissed&&!a.snoozed&&a.level==='info').length;

  return (
    <div>
      <div className="mets">
        <div className="met"><div className="met-l">Critical — act now</div><div className="met-v" style={{color:'#A32D2D'}}>{critical}</div><div className="met-s">Expired / overdue items</div></div>
        <div className="met"><div className="met-l">Action required</div><div className="met-v" style={{color:'#BA7517'}}>{warning}</div><div className="met-s">Coming due soon</div></div>
        <div className="met"><div className="met-l">Upcoming</div><div className="met-v" style={{color:'#185FA5'}}>{info}</div><div className="met-s">Plan ahead</div></div>
        <div className="met"><div className="met-l">Dismissed</div><div className="met-v" style={{color:'var(--tx-t)'}}>{alerts.filter(a=>a.dismissed).length}</div><div className="met-s" style={{cursor:'pointer',textDecoration:'underline'}} onClick={()=>setShowDismissed(!showDismissed)}>{showDismissed?'Hide':'Show dismissed'}</div></div>
      </div>

      <div style={{background:'var(--bg-warn)',borderRadius:'var(--r)',padding:'10px 14px',marginBottom:14,fontSize:12,color:'var(--tx-warn)'}}>
        <strong>Unified alerts center</strong> — All expiring credentials, overdue trainings, missing documents, policy reviews, and compliance deadlines in one place. Click an alert to take action or navigate directly to the relevant section. Critical items require immediate attention to maintain compliance and billing eligibility.
      </div>

      <div className="tbar" style={{flexWrap:'wrap',gap:6}}>
        <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
          {['All',...new Set(ALERTS.map(a=>a.cat))].filter((v,i,a)=>a.indexOf(v)===i).slice(0,7).map(c=>(
            <button key={c} className={'stab'+(catFilter===c?' active':'')} onClick={()=>setCatFilter(c)} style={{padding:'3px 8px',fontSize:10}}>{c}</button>
          ))}
        </div>
        <select value={levelFilter} onChange={e=>setLevelFilter(e.target.value)} style={{fontSize:12,padding:'5px 8px',border:'0.5px solid var(--bd-m)',borderRadius:'var(--r)',background:'var(--bg-p)',color:'var(--tx-p)'}}>
          <option value="">All levels</option>
          <option value="err">Critical only</option>
          <option value="warn">Action required</option>
          <option value="info">Upcoming only</option>
        </select>
      </div>

      {shown.length===0&&(
        <div style={{textAlign:'center',padding:'40px 20px',color:'var(--tx-t)',fontSize:13}}>
          {showDismissed?'No dismissed alerts in this category.':'No active alerts in this category. ✓'}
        </div>
      )}

      {['err','warn','info'].map(level=>{
        const group = shown.filter(a=>a.level===level);
        if (!group.length) return null;
        const lc = LEVEL_CONFIG[level];
        return (
          <div key={level} style={{marginBottom:20}}>
            <div className="sec-t" style={{color:lc.col}}>
              {lc.icon} {lc.label}
              <span>{group.length} item{group.length>1?'s':''}</span>
            </div>
            {group.map(a=>(
              <div key={a.id} style={{background:'var(--bg-p)',border:`0.5px solid ${lc.border}`,borderRadius:'var(--rl)',marginBottom:8,overflow:'hidden'}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:10,padding:'12px 14px'}}>
                  <div style={{width:6,minHeight:40,borderRadius:3,background:lc.col,flexShrink:0,marginTop:2}}></div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:600,marginBottom:4}}>{a.title}</div>
                    <div style={{fontSize:11,color:'var(--tx-s)',marginBottom:8,lineHeight:1.5}}>{a.detail}</div>
                    <div style={{display:'flex',alignItems:'center',gap:16,fontSize:11,color:'var(--tx-t)'}}>
                      <span>Assigned to: <strong style={{color:'var(--tx-p)'}}>{a.assignee}</strong></span>
                      <span>Due: <strong style={{color:a.due==='Immediate'||a.due==='Overdue'?lc.col:'var(--tx-p)'}}>{a.due}</strong></span>
                      <span style={{background:'var(--bg-s)',padding:'1px 6px',borderRadius:'var(--r)'}}>{a.cat}</span>
                    </div>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:5,flexShrink:0}}>
                    {navigate&&<button className="btn pri" style={{fontSize:10}} onClick={()=>navigate(a.page)}>{a.action} →</button>}
                    {!showDismissed&&<button className="btn sm" style={{fontSize:10}} onClick={()=>snooze(a.id)}>Snooze</button>}
                    {!showDismissed&&<button className="btn sm" style={{fontSize:10,color:'var(--tx-t)'}} onClick={()=>dismiss(a.id)}>Dismiss</button>}
                    {showDismissed&&<button className="btn sm" style={{fontSize:10}} onClick={()=>restore(a.id)}>Restore</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
