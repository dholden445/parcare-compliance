import React, { useState } from 'react';
import { INITIAL_EMPLOYEES } from '../data';

const DEPT_CONFIG = [
  {id:'Clinical',label:'Clinical',desc:'Physicians, NPs, PAs, Medical Assistants, Nursing',color:'#0C447C',bg:'#E6F1FB'},
  {id:'Non-Clinical',label:'Non-Clinical',desc:'Front desk, patient services, scheduling, registration',color:'#26215C',bg:'#EEEDFE'},
  {id:'QA/QI',label:'QA / Quality Improvement',desc:'QI coordinator, data analysts, PDSA, UDS reporting',color:'#27500A',bg:'#EAF3DE'},
  {id:'Compliance',label:'Compliance',desc:'Compliance officer, HIPAA, audits, policy management',color:'#791F1F',bg:'#FFEBEE'},
  {id:'HR',label:'HR',desc:'Human resources, onboarding, benefits, credentialing',color:'#633806',bg:'#FAEEDA'},
  {id:'Operations',label:'Operations',desc:'Site managers, facilities, IT, administration',color:'#3B6D11',bg:'#EAF3DE'},
];

function UploadBtn({label='Upload'}) {
  return (
    <label style={{display:'inline-block',cursor:'pointer'}}>
      <input type="file" style={{display:'none'}} onChange={e=>{if(e.target.files[0])alert('"'+e.target.files[0].name+'" selected.');}}/>
      <span className="btn pri" style={{fontSize:11}}>{label}</span>
    </label>
  );
}

const ini = n => n.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();

export default function Departments() {
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES.map(e=>({
    ...e,
    dept: e.dept==='Clinical / Medical'?'Clinical':e.dept==='Quality Improvement'?'QA/QI':e.dept==='HR / Operations'?'HR':e.dept==='Site Operations'?'Operations':e.dept,
  })));
  const [openDept, setOpenDept] = useState({});
  const [showAddModal, setShowAddModal] = useState(null);
  const [selectedEmp, setSelectedEmp] = useState('');

  const togDept = id => setOpenDept(p=>({...p,[id]:!p[id]}));

  const addToDept = (deptId) => {
    if(!selectedEmp) return;
    setEmployees(p=>p.map(e=>e.id===selectedEmp?{...e,dept:deptId}:e));
    setShowAddModal(null);
    setSelectedEmp('');
  };

  const removeFromDept = (empId, deptId) => {
    if(window.confirm('Remove this employee from '+deptId+'?')) {
      setEmployees(p=>p.map(e=>e.id===empId?{...e,dept:''}:e));
    }
  };

  return (
    <div>
      {showAddModal && (
        <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&setShowAddModal(null)}>
          <div className="modal">
            <div className="modal-t">Add employee to {showAddModal}</div>
            <div className="fl">
              <label>Select employee</label>
              <select value={selectedEmp} onChange={e=>setSelectedEmp(e.target.value)}>
                <option value="">Choose employee...</option>
                {employees.filter(e=>e.dept!==showAddModal).map(e=>(
                  <option key={e.id} value={e.id}>{e.name} — {e.dept||'Unassigned'}</option>
                ))}
              </select>
            </div>
            <div style={{fontSize:11,color:'var(--tx-s)',marginBottom:10}}>This will move the selected employee into the {showAddModal} department.</div>
            <div className="fa">
              <button className="btn" onClick={()=>setShowAddModal(null)}>Cancel</button>
              <button className="btn pri" onClick={()=>addToDept(showAddModal)}>Add to department</button>
            </div>
          </div>
        </div>
      )}

      {DEPT_CONFIG.map(dept=>{
        const members = employees.filter(e=>e.dept===dept.id);
        const trainingPct = members.length>0
          ? Math.round(members.reduce((a,e)=>{
              const done=Object.values(e.tr||{}).filter(v=>v==='done').length;
              return a+(done/11*100);
            },0)/members.length)
          : 0;

        return (
          <div key={dept.id} style={{background:'var(--bg-p)',border:'0.5px solid var(--bd)',borderRadius:'var(--rl)',marginBottom:12,overflow:'hidden'}}>
            <button style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',width:'100%',background:'transparent',border:'none',textAlign:'left',cursor:'pointer'}} onClick={()=>togDept(dept.id)}>
              <div style={{width:38,height:38,borderRadius:'var(--r)',background:dept.bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <svg viewBox="0 0 16 16" fill="none" stroke={dept.color} strokeWidth="1.5" width="16" height="16"><path d="M8 2v4M4 6H2v8h12V6h-2M4 6V4a4 4 0 018 0v2M4 6h8"/></svg>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600}}>{dept.label}</div>
                <div style={{fontSize:11,color:'var(--tx-s)',marginTop:2}}>{dept.desc}</div>
              </div>
              <div style={{textAlign:'right',marginRight:12}}>
                <div style={{fontSize:12,fontWeight:600,color:dept.color}}>{members.length} staff</div>
                <div style={{fontSize:10,color:'var(--tx-t)'}}>{trainingPct}% training complete</div>
              </div>
              <div className="pb" style={{width:80}}>
                <div className="pf" style={{width:trainingPct+'%',background:trainingPct>=80?'#639922':trainingPct>=60?'#BA7517':'#A32D2D'}}></div>
              </div>
              <span style={{fontSize:12,color:'var(--tx-t)',marginLeft:8}}>{openDept[dept.id]?'▲':'▼'}</span>
            </button>

            {openDept[dept.id]&&(
              <div style={{borderTop:'0.5px solid var(--bd)',padding:'14px 16px',background:'var(--bg-s)'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
                  <div style={{fontSize:11,fontWeight:600,color:'var(--tx-s)'}}>{dept.label} department — {members.length} member{members.length!==1?'s':''}</div>
                  <div style={{display:'flex',gap:8}}>
                    <UploadBtn label="Upload dept document"/>
                    <button className="btn pri" onClick={()=>setShowAddModal(dept.id)}>+ Add employee</button>
                  </div>
                </div>

                {members.length===0?(
                  <div style={{fontSize:12,color:'var(--tx-t)',padding:'16px',textAlign:'center',background:'var(--bg-p)',borderRadius:'var(--r)',border:'0.5px dashed var(--bd-m)'}}>
                    No employees assigned to this department yet. Click "+ Add employee" to assign staff.
                  </div>
                ):(
                  <div>
                    {members.map(emp=>{
                      const done=Object.values(emp.tr||{}).filter(v=>v==='done').length;
                      const pct=Math.round(done/11*100);
                      const col=pct===100?'#639922':pct>=80?'#185FA5':'#A32D2D';
                      return (
                        <div key={emp.id} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 10px',background:'var(--bg-p)',borderRadius:'var(--r)',marginBottom:6,border:'0.5px solid var(--bd)'}}>
                          <div style={{width:32,height:32,borderRadius:'50%',background:dept.bg,color:dept.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:600,flexShrink:0}}>{ini(emp.name)}</div>
                          <div style={{flex:1}}>
                            <div style={{fontSize:12,fontWeight:600}}>{emp.name}</div>
                            <div style={{fontSize:10,color:'var(--tx-s)'}}>{emp.title} · {emp.site}</div>
                          </div>
                          <span className="rb">{emp.role}</span>
                          <div style={{display:'flex',alignItems:'center',gap:6,minWidth:120}}>
                            <div className="pb" style={{width:60}}><div className="pf" style={{width:pct+'%',background:col}}></div></div>
                            <span style={{fontSize:10,color:col,fontWeight:600}}>{pct}%</span>
                          </div>
                          {pct<100?<span className="bdg err" style={{fontSize:10}}>{11-done} training{11-done!==1?'s':''} missing</span>:<span className="bdg ok" style={{fontSize:10}}>Fully trained</span>}
                          <button className="btn sm" style={{fontSize:10,color:'var(--tx-err)',borderColor:'var(--tx-err)'}} onClick={()=>removeFromDept(emp.id,dept.id)}>Remove</button>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div style={{marginTop:12,paddingTop:12,borderTop:'0.5px solid var(--bd)'}}>
                  <div style={{fontSize:11,fontWeight:600,color:'var(--tx-s)',marginBottom:8}}>Department documents</div>
                  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                    <UploadBtn label="Upload department policy"/>
                    <UploadBtn label="Upload SOPs"/>
                    <UploadBtn label="Upload org chart"/>
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
