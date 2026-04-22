import React from 'react';

const rows = [
  {s:'ok',l:'Clinical / Medical',v:'91%',pct:91,col:'#639922'},
  {s:'ok',l:'Quality Improvement',v:'85%',pct:85,col:'#639922'},
  {s:'ok',l:'Compliance',v:'90%',pct:90,col:'#639922'},
  {s:'warn',l:'HR / Operations',v:'62%',pct:62,col:'#BA7517'},
  {s:'warn',l:'Site Operations',v:'75%',pct:75,col:'#BA7517'},
];
const critical = [
  {s:'err',l:'HIPAA training - 2 staff'},
  {s:'err',l:'UDS annual data submission'},
  {s:'err',l:'Medical waste contract renewal'},
  {s:'err',l:'DOH self-inspection form'},
  {s:'err',l:'Active shooter training - 3 staff'},
  {s:'warn',l:'Re-credentialing - 2 providers (Apr 25)'},
  {s:'warn',l:'Q2 fire drills - Bay Pkwy & Rambam'},
  {s:'warn',l:'CLIA certificate renewal - Q3'},
];
const activity = [
  {date:'Apr 21',text:'PM-01 Pain Management Protocol uploaded',who:'Admin',col:'#1b5e20'},
  {date:'Apr 20',text:'16th Ave Q2 fire drill - marked complete',who:'Site Mgr',col:'#1b5e20'},
  {date:'Apr 18',text:'Board meeting minutes - April 2026 uploaded',who:'Admin',col:'#1b5e20'},
  {date:'Apr 15',text:'2 staff HIPAA training still overdue',who:'System',col:'#A32D2D'},
  {date:'Apr 12',text:'CQC meeting minutes - April 2026 uploaded',who:'Admin',col:'#1b5e20'},
  {date:'Apr 10',text:'Patient satisfaction survey Q1 2026 filed',who:'QI Coord',col:'#1b5e20'},
];

export default function Dashboard() {
  return (
    <div>
      <div className="mets">
        <div className="met"><div className="met-l">Overall compliance</div><div className="met-v" style={{color:'#BA7517'}}>76%</div><div className="pb"><div className="pf" style={{width:'76%',background:'#185FA5'}}></div></div></div>
        <div className="met"><div className="met-l">Employees</div><div className="met-v">11</div><div className="met-s">5 departments</div></div>
        <div className="met"><div className="met-l">Trainings overdue</div><div className="met-v" style={{color:'#A32D2D'}}>8</div><div className="met-s">Across all staff</div></div>
        <div className="met"><div className="met-l">Fire drills done</div><div className="met-v" style={{color:'#BA7517'}}>6/16</div><div className="pb" style={{marginTop:6}}><div className="pf" style={{width:'37%',background:'#BA7517'}}></div></div></div>
      </div>
      <div className="g2">
        <div className="card">
          <div className="ch"><div className="ct">Compliance by department</div></div>
          {rows.map(r=>(
            <div key={r.l} style={{marginBottom:8}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:3}}><span>{r.l}</span><span style={{color:r.col}}>{r.v}</span></div>
              <div className="pb"><div className="pf" style={{width:r.pct+'%',background:r.col}}></div></div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="ch"><div className="ct">Action required</div><span className="bdg err">5 overdue</span></div>
          {critical.map((c,i)=>(
            <div key={i} className="row"><div className={`ck ${c.s}`}>{c.s==='err'?'!':'~'}</div><div style={{flex:1}}>{c.l}</div></div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="ch"><div className="ct">Recent activity</div></div>
        {activity.map((a,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:10,fontSize:12,marginBottom:7}}>
            <span style={{color:'var(--tx-t)',minWidth:65}}>{a.date}</span>
            <span style={{flex:1}}>{a.text}</span>
            <span style={{color:a.col}}>{a.who}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
