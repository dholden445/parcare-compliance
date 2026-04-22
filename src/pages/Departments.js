import React from 'react';

const depts = [
  {n:'Clinical / Medical',s:'Providers, MAs, nursing',pct:91,col:'#639922',dot:'#639922',staff:7,bg:'var(--bg-info)',ic:'var(--tx-info)',path:'M8 3v4M6 5h4 M2 2 m6 6 a6 6 0 1 0 0-0.01'},
  {n:'Quality Improvement',s:'QI coordinator, PDSA, UDS',pct:85,col:'#639922',dot:'#639922',staff:2,bg:'var(--bg-info)',ic:'var(--tx-info)',path:'M1 11l4-4 3 2 4-5 3 2'},
  {n:'Compliance',s:'Audits, HIPAA, policies',pct:90,col:'#639922',dot:'#639922',staff:2,bg:'var(--bg-suc)',ic:'var(--tx-suc)',path:'M4 8l3 3 5-5M1 1h14v14H1z'},
  {n:'HR / Operations',s:'Onboarding, schedules, HR',pct:62,col:'#A32D2D',dot:'#A32D2D',staff:3,bg:'var(--bg-err)',ic:'var(--tx-err)',path:'M6 2a3 3 0 100 6M1 14c0-3 2-5 5-5s5 2 5 5M12 7v4M10 9h4'},
  {n:'Site Operations',s:'Bay Pkwy · 16th Ave · Wburg · Rambam',pct:75,col:'#BA7517',dot:'#BA7517',staff:4,bg:'var(--bg-warn)',ic:'var(--tx-warn)',path:'M2 7h12v8H2zM5 7V5a3 3 0 016 0v2'},
];

export default function Departments() {
  return (
    <div className="dept-grid">
      {depts.map(d=>(
        <button key={d.n} className="dc">
          <div className="dc-ico" style={{background:d.bg}}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={d.ic} strokeWidth="1.5"><path d={d.path}/></svg>
          </div>
          <div className="dc-n">{d.n}</div>
          <div className="dc-s">{d.s}</div>
          <div style={{marginTop:6}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:3}}><span style={{color:'var(--tx-t)'}}>Compliance</span><span style={{color:d.col,fontWeight:600}}>{d.pct}%</span></div>
            <div className="pb"><div className="pf" style={{width:d.pct+'%',background:d.col}}></div></div>
          </div>
          <div className="dc-st"><div className="dot" style={{background:d.dot}}></div>{d.pct}% · {d.staff} staff</div>
        </button>
      ))}
    </div>
  );
}
