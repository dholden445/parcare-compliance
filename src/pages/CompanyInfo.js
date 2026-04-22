import React, { useState } from 'react';

const SECTIONS = [
  {
    id:'governance',title:'Corporate governance & legal',color:'#0C447C',
    docs:[
      {name:'Certificate of Incorporation / Articles of Organization',status:'Current',updated:'2010'},
      {name:'IRS Tax-Exempt Determination Letter (501c3)',status:'Current',updated:'2012'},
      {name:'Federal Tax ID / EIN Documentation',status:'Current',updated:'2010'},
      {name:'NPI Registry Certificate — Organization',status:'Current',updated:'2024'},
      {name:'Board of Directors Member List — Current',status:'Current',updated:'Apr 2026'},
      {name:'Board Bylaws',status:'Current',updated:'Jan 2024'},
      {name:'FQHC Look-Alike Designation Letter',status:'Current',updated:'2023'},
    ]
  },
  {
    id:'licenses',title:'Licenses & operating certificates',color:'#27500A',
    docs:[
      {name:'NYS DOH Article 28 Operating Certificate — Bay Parkway',status:'Current',updated:'Jan 2026'},
      {name:'NYS DOH Article 28 Operating Certificate — 16th Ave',status:'Current',updated:'Jan 2026'},
      {name:'NYS DOH Article 28 Operating Certificate — Williamsburg',status:'Current',updated:'Jan 2026'},
      {name:'NYS DOH Article 28 Operating Certificate — Rambam',status:'Current',updated:'Jan 2026'},
      {name:'Certificate of Occupancy — Bay Parkway',status:'Current',updated:'2019'},
      {name:'Certificate of Occupancy — 16th Ave',status:'Current',updated:'2020'},
      {name:'Certificate of Occupancy — Williamsburg',status:'Current',updated:'2021'},
      {name:'Certificate of Occupancy — Rambam',status:'Current',updated:'2018'},
      {name:'DEA Registration Certificate',status:'Current',updated:'Jan 2026'},
      {name:'Medicaid Provider Agreement — NYS',status:'Current',updated:'Jan 2026'},
      {name:'Medicare Provider Agreement',status:'Current',updated:'Jan 2026'},
    ]
  },
  {
    id:'org',title:'Organizational structure',color:'#26215C',
    docs:[
      {name:'Organizational Chart — Current',status:'Current',updated:'Apr 2026'},
      {name:'Leadership & Key Personnel Directory',status:'Current',updated:'Apr 2026'},
      {name:'Staffing Plan — FY 2026',status:'Current',updated:'Jan 2026'},
      {name:'Site Map — All Locations',status:'Current',updated:'Jan 2026'},
    ]
  },
  {
    id:'accreditation',title:'Accreditation & compliance filings',color:'#791F1F',
    docs:[
      {name:'HRSA Health Center Program Annual Report (UDS)',status:'Review due',updated:'2025'},
      {name:'HRSA Notice of Award — Current Grant Year',status:'Current',updated:'Jan 2026'},
      {name:'FTCA Deeming Application — Current Year',status:'Current',updated:'Jan 2026'},
      {name:'PCMH Recognition Certificate (if applicable)',status:'Current',updated:'2024'},
      {name:'CLIA Certificate of Compliance — Bay Parkway',status:'Current',updated:'Jan 2026'},
      {name:'CLIA Certificate of Compliance — 16th Ave',status:'Current',updated:'Jan 2026'},
      {name:'CLIA Certificate of Compliance — Williamsburg',status:'Current',updated:'Jan 2026'},
      {name:'CLIA Certificate of Compliance — Rambam',status:'Current',updated:'Jan 2026'},
    ]
  },
  {
    id:'insurance',title:'Insurance certificates',color:'#633806',
    docs:[
      {name:'General Liability Insurance Certificate',status:'Current',updated:'Jan 2026'},
      {name:'Professional Liability / Malpractice Certificate',status:'Current',updated:'Jan 2026'},
      {name:'Workers Compensation Certificate',status:'Current',updated:'Jan 2026'},
      {name:'Directors & Officers (D&O) Insurance',status:'Current',updated:'Jan 2026'},
      {name:'Cyber Liability Insurance Certificate',status:'Current',updated:'Jan 2026'},
    ]
  },
];

function UploadBtn({label='Upload'}) {
  return (
    <label style={{display:'inline-block',cursor:'pointer'}}>
      <input type="file" style={{display:'none'}} onChange={e=>{ if(e.target.files[0]) alert('File "'+e.target.files[0].name+'" selected. In the full version this will be saved to storage.'); }}/>
      <span className="btn pri" style={{fontSize:11}}>{label}</span>
    </label>
  );
}

export default function CompanyInfo() {
  const [openSections, setOpenSections] = useState({'governance':true,'licenses':true,'org':true,'accreditation':true,'insurance':true});
  const tog = id => setOpenSections(p=>({...p,[id]:!p[id]}));

  const totalDocs = SECTIONS.reduce((a,s)=>a+s.docs.length,0);
  const currentDocs = SECTIONS.reduce((a,s)=>a+s.docs.filter(d=>d.status==='Current').length,0);

  return (
    <div>
      <div className="mets" style={{gridTemplateColumns:'repeat(4,minmax(0,1fr))'}}>
        <div className="met"><div className="met-l">Total documents</div><div className="met-v">{totalDocs}</div></div>
        <div className="met"><div className="met-l">Current / on file</div><div className="met-v" style={{color:'#639922'}}>{currentDocs}</div></div>
        <div className="met"><div className="met-l">Review due</div><div className="met-v" style={{color:'#BA7517'}}>{totalDocs-currentDocs}</div></div>
        <div className="met"><div className="met-l">Sites covered</div><div className="met-v">4</div><div className="met-s">Bay Pkwy · 16th · Wburg · Rambam</div></div>
      </div>

      <div style={{marginBottom:12,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{fontSize:12,color:'var(--tx-s)'}}>Corporate, legal, licensing, and accreditation documents for ParCare Community Health Network</div>
        <UploadBtn label="Upload new document"/>
      </div>

      {SECTIONS.map(s=>(
        <div key={s.id} style={{marginBottom:14}}>
          <button
            style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%',background:'transparent',border:'none',cursor:'pointer',padding:'8px 0',borderBottom:'0.5px solid var(--bd)',marginBottom:openSections[s.id]?10:0}}
            onClick={()=>tog(s.id)}
          >
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:10,height:10,borderRadius:'50%',background:s.color,flexShrink:0}}></div>
              <span style={{fontSize:12,fontWeight:600,color:'var(--tx-p)'}}>{s.title}</span>
              <span style={{fontSize:11,color:'var(--tx-t)'}}>{s.docs.length} documents</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <UploadBtn label="Upload"/>
              <span style={{fontSize:12,color:'var(--tx-t)'}}>{openSections[s.id]?'▲':'▼'}</span>
            </div>
          </button>
          {openSections[s.id] && (
            <div className="card" style={{padding:0}}>
              <table className="tbl" style={{tableLayout:'fixed',width:'100%'}}>
                <thead><tr><th style={{width:'55%'}}>Document</th><th style={{width:'15%'}}>Last updated</th><th style={{width:'15%'}}>Status</th><th style={{width:'15%'}}>Actions</th></tr></thead>
                <tbody>
                  {s.docs.map((d,i)=>(
                    <tr key={i}>
                      <td style={{fontWeight:500}}>{d.name}</td>
                      <td style={{color:'var(--tx-t)',fontSize:11}}>{d.updated}</td>
                      <td style={{color:d.status==='Current'?'var(--tx-suc)':'var(--tx-warn)',fontSize:11,fontWeight:600}}>{d.status}</td>
                      <td style={{display:'flex',gap:6,alignItems:'center'}}>
                        <a style={{color:'var(--tx-info)',cursor:'pointer',fontSize:11}}>View</a>
                        <UploadBtn label="Replace"/>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
