import React, { useState } from 'react';
import { TRF, INITIAL_EMPLOYEES } from '../data';

const LMS = [
  {tr:"HIPAA Privacy & Security",method:"Online video",done:9,total:11},
  {tr:"Active Shooter Response",method:"In-person",done:8,total:11},
  {tr:"HIV Informed Consent",method:"Online video",done:7,total:9},
  {tr:"Infection Control / OSHA",method:"Online video",done:11,total:11},
  {tr:"Workplace Violence Prevention",method:"Online video",done:9,total:11},
  {tr:"Fraud, Waste & Abuse",method:"Online video",done:10,total:11},
  {tr:"Sexual Harassment Prevention",method:"Online video",done:9,total:11},
  {tr:"Emergency Preparedness",method:"In-person",done:11,total:11},
  {tr:"Patient Rights / Cultural Competency",method:"Online video",done:11,total:11},
  {tr:"Human Trafficking Recognition",method:"Online video",done:11,total:11},
  {tr:"Mandated Reporter",method:"Read & sign",done:9,total:11},
];

export default function TrainingLibrary() {
  const [open, setOpen] = useState({});
  const [showModal, setShowModal] = useState(false);
  const tog = id => setOpen(p=>({...p,[id]:!p[id]}));
  return (
    <div>
      {showModal && (
        <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal">
            <div className="modal-t">Assign training</div>
            <div className="fl"><label>Training</label><select>{TRF.map(t=><option key={t}>{t}</option>)}</select></div>
            <div className="fl"><label>Assign to</label><select><option>All staff</option><option>Clinical / Medical</option><option>Quality Improvement</option><option>HR / Operations</option><option>Compliance</option><option>Site Operations</option></select></div>
            <div className="fl"><label>Due date</label><input type="date"/></div>
            <div className="fl"><label>Delivery method</label><select><option>Online video (self-paced)</option><option>In-person session</option><option>Live webinar</option><option>Document read & sign</option></select></div>
            <div className="fa"><button className="btn" onClick={()=>setShowModal(false)}>Cancel</button><button className="btn pri" onClick={()=>setShowModal(false)}>Assign</button></div>
          </div>
        </div>
      )}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
        <div style={{fontSize:12,color:'var(--tx-s)'}}>Assign and track all required annual trainings</div>
        <button className="btn pri" onClick={()=>setShowModal(true)}>Assign training</button>
      </div>
      {LMS.map((a,i)=>{
        const pct = Math.round(a.done/a.total*100);
        const col = pct===100?'#639922':pct>=80?'#185FA5':'#A32D2D';
        const id = 'lms'+i;
        return (
          <div key={id} className="lms-card">
            <button className="lms-hd" onClick={()=>tog(id)}>
              <div className={`ck ${pct===100?'ok':pct>=80?'warn':'err'}`}>{pct===100?'✓':pct>=80?'~':'!'}</div>
              <div className="lms-title">{a.tr}</div>
              <span className="rb" style={{marginRight:4}}>{a.method}</span>
              <div style={{minWidth:90,textAlign:'right'}}>
                <div style={{fontSize:11,fontWeight:600,color:col}}>{a.done}/{a.total} complete</div>
                <div className="pb" style={{marginTop:2}}><div className="pf" style={{width:pct+'%',background:col}}></div></div>
              </div>
            </button>
            {open[id] && (
              <div style={{borderTop:'0.5px solid var(--bd)',padding:'10px 12px',background:'var(--bg-s)'}}>
                <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:8}}>
                  <button className="btn sm pri" onClick={()=>setShowModal(true)}>Re-assign</button>
                  <button className="btn sm">Send reminder</button>
                </div>
                <div className="upload-zone">Click to upload completion certificates or sign-in sheets</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
