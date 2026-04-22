import React, { useState } from 'react';

function UploadBtn({label='Upload'}) {
  return (
    <label style={{display:'inline-block',cursor:'pointer'}}>
      <input type="file" style={{display:'none'}} onChange={e=>{ if(e.target.files[0]) alert('File "'+e.target.files[0].name+'" selected.'); }}/>
      <span className="btn sm" style={{background:'var(--bg-info)',color:'var(--tx-info)',border:'none'}}>{label}</span>
    </label>
  );
}

const COMP_DATA = [
  {cat:"HRSA chapter requirements",score:"6/8",items:[
    {s:"ok",l:"CLIN-001 Credentialing & Privileging Policy",who:"Med Director",due:"Complete"},
    {s:"ok",l:"CLIN-002 Scope of Services & Accessible Hours",who:"CEO",due:"Complete"},
    {s:"ok",l:"CLIN-003 After-Hours & Emergency Coverage",who:"Med Director",due:"Complete"},
    {s:"ok",l:"CLIN-004 Language Access & Cultural Competency",who:"COO",due:"Complete"},
    {s:"ok",l:"CLIN-005 Referral Tracking Policy",who:"Med Director",due:"Complete"},
    {s:"ok",l:"CLIN-006 QA/QI Program Policy",who:"Med Director",due:"Complete"},
    {s:"warn",l:"Sliding fee scale — Board approval",who:"CEO / Board",due:"Apr 30"},
    {s:"err",l:"UDS annual data submission",who:"QI Coordinator",due:"Overdue"},
  ]},
  {cat:"NYS Article 28 — DOH requirements",score:"4/7",items:[
    {s:"ok",l:"Operating certificate current and posted",who:"CEO",due:"Current"},
    {s:"ok",l:"Infection control plan reviewed",who:"Med Director",due:"Complete"},
    {s:"ok",l:"Patient rights notice posted at all sites",who:"COO",due:"Complete"},
    {s:"ok",l:"Incident reporting log maintained",who:"Compliance Officer",due:"Complete"},
    {s:"warn",l:"Fire safety drill documentation — all sites",who:"Site Managers",due:"Ongoing"},
    {s:"err",l:"Medical waste disposal contract renewal",who:"Operations",due:"Overdue"},
    {s:"err",l:"Annual DOH self-inspection form submission",who:"CEO",due:"Overdue"},
  ]},
  {cat:"Quality & governance",score:"4/6",items:[
    {s:"ok",l:"Board meeting minutes — filed monthly",who:"Board Secretary",due:"Current"},
    {s:"ok",l:"CQC compliance & quality meeting minutes",who:"Director of Ops",due:"Current"},
    {s:"ok",l:"Patient satisfaction survey — Q1 2026",who:"QI Coordinator",due:"Filed"},
    {s:"warn",l:"Patient satisfaction survey — Q2 2026",who:"QI Coordinator",due:"Jun 30"},
    {s:"warn",l:"Accident / incident reports — open item",who:"Compliance Officer",due:"Apr 5 open"},
    {s:"warn",l:"QI project dashboard — monthly updates",who:"QI Coordinator",due:"Current"},
  ]},
  {cat:"CLIA & laboratory",score:"4/5",items:[
    {s:"ok",l:"CLIA certificate — Bay Parkway",who:"Site Manager",due:"Current"},
    {s:"ok",l:"CLIA certificate — 16th Ave",who:"Site Manager",due:"Current"},
    {s:"ok",l:"CLIA certificate — Williamsburg",who:"Site Manager",due:"Current"},
    {s:"ok",l:"CLIA certificate — Rambam",who:"Site Manager",due:"Current"},
    {s:"warn",l:"CLIA renewal tracking — all sites (due Q3)",who:"Compliance Officer",due:"Jul 1"},
  ]},
  {cat:"Temperature logs — all sites",score:"3/4",items:[
    {s:"ok",l:"Temperature log — Bay Parkway (current)",who:"Site Manager",due:"Current"},
    {s:"ok",l:"Temperature log — 16th Ave (current)",who:"Site Manager",due:"Current"},
    {s:"ok",l:"Temperature log — Williamsburg (current)",who:"Site Manager",due:"Current"},
    {s:"err",l:"Temperature log — Rambam (April missing)",who:"Site Mgr — Rambam",due:"Overdue"},
  ]},
  {cat:"Site operations records",score:"3/6",items:[
    {s:"ok",l:"QC logs — Bay Parkway (current)",who:"Site Manager",due:"Current"},
    {s:"ok",l:"QC logs — 16th Ave (current)",who:"Site Manager",due:"Current"},
    {s:"ok",l:"QC logs — Williamsburg (current)",who:"Site Manager",due:"Current"},
    {s:"err",l:"QC logs — Rambam (April missing)",who:"Site Mgr — Rambam",due:"Overdue"},
    {s:"ok",l:"Medication logs — Bay Pkwy, 16th, Wburg",who:"Site Managers",due:"Current"},
    {s:"err",l:"Medication log — Rambam (overdue)",who:"Site Mgr — Rambam",due:"Overdue"},
  ]},
  {cat:"Contracts & vendor agreements",score:"4/5",items:[
    {s:"ok",l:"Vendor contract — eClinicalWorks EHR",who:"Operations",due:"Current"},
    {s:"ok",l:"Vendor contract — Lab services (Quest)",who:"Operations",due:"Current"},
    {s:"ok",l:"Vendor contract — Healthix HIE",who:"Compliance Officer",due:"Current"},
    {s:"ok",l:"BAA — all covered vendors on file",who:"Compliance Officer",due:"Current"},
    {s:"err",l:"Medical waste disposal contract — expired",who:"Operations",due:"Overdue"},
  ]},
  {cat:"HIPAA & privacy",score:"3/5",items:[
    {s:"ok",l:"HIPAA Privacy & Security policies current",who:"Compliance Officer",due:"Complete"},
    {s:"ok",l:"Business Associate Agreements — all vendors",who:"Compliance Officer",due:"Complete"},
    {s:"ok",l:"Healthix HIE consent workflow live",who:"Front Desk",due:"Complete"},
    {s:"err",l:"Annual staff HIPAA training — 2 staff incomplete",who:"All staff",due:"Overdue"},
    {s:"warn",l:"Annual Security Risk Assessment (SRA)",who:"IT / Compliance",due:"May 15"},
  ]},
  {cat:"Annual trainings — all staff",score:"Varies",items:[
    {s:"warn",l:"HIPAA — 2 staff incomplete",who:"All staff",due:"Annual"},
    {s:"warn",l:"Active Shooter — 3 staff incomplete",who:"All staff",due:"Annual"},
    {s:"ok",l:"Infection Control / OSHA — 100% complete",who:"All staff",due:"Done"},
    {s:"warn",l:"Workplace Violence — 3 staff incomplete",who:"All staff",due:"Annual"},
    {s:"ok",l:"Emergency Preparedness — 100% complete",who:"All staff",due:"Done"},
    {s:"ok",l:"Patient Rights / Cultural Competency — 100%",who:"All staff",due:"Done"},
    {s:"ok",l:"Human Trafficking — 100% complete",who:"All staff",due:"Done"},
    {s:"warn",l:"Sexual Harassment — 2 staff incomplete",who:"All staff",due:"Annual"},
    {s:"warn",l:"Fraud, Waste & Abuse — 1 incomplete",who:"All staff",due:"Annual"},
  ]},
  {cat:"HR & credentialing",score:"2/4",items:[
    {s:"ok",l:"All provider licenses current — verified in Modio",who:"HR / Credentialing",due:"Current"},
    {s:"ok",l:"OIG/SAM exclusion monitoring — monthly",who:"Credentialing",due:"Apr 21"},
    {s:"warn",l:"Re-credentialing — 2 providers due",who:"HR / Med Director",due:"Apr 25"},
    {s:"warn",l:"New staff orientation checklist — 1 pending",who:"HR",due:"Apr 28"},
  ]},
];

const dueColor = due => due==='Overdue'||due==='Expired'?'var(--tx-err)':due==='Complete'||due==='Current'||due==='Done'||due==='Filed'?'var(--tx-suc)':'var(--tx-warn)';

export default function Compliance() {
  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
        <div style={{fontSize:12,color:'var(--tx-s)'}}>Article 28 NYS DOH · HRSA · HIPAA — full compliance checklist</div>
        <button className="btn">Export report</button>
      </div>
      {COMP_DATA.map(sec=>(
        <div key={sec.cat} style={{marginBottom:18}}>
          <div className="sec-t">{sec.cat}<span>{sec.score}</span></div>
          {sec.items.map((item,i)=>(
            <div key={i} className="row">
              <div className={`ck ${item.s}`}>{item.s==='ok'?'✓':item.s==='err'?'!':'~'}</div>
              <div style={{flex:1,fontSize:12}}>{item.l}</div>
              <div style={{fontSize:11,color:'var(--tx-t)',minWidth:100,textAlign:'right'}}>{item.who}</div>
              <div style={{fontSize:11,minWidth:65,textAlign:'right',color:dueColor(item.due)}}>{item.due}</div>
              <UploadBtn label="↑"/>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
