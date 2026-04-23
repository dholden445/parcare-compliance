import React, { useState } from 'react';
import { INITIAL_EMPLOYEES, TRS, TRF } from '../data';

const DBGC = {"Clinical":"#0C447C","Non-Clinical":"#26215C","QA/QI":"#27500A","Compliance":"#791F1F","HR":"#633806","Operations":"#3B6D11"};
const DBBG = {"Clinical":"#E6F1FB","Non-Clinical":"#E6F1FB","QA/QI":"#EAF3DE","Compliance":"#FFEBEE","HR":"#FAEEDA","Operations":"#E8F5E9"};
const ini = n => n.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();
const DEPTS = ['Clinical','Non-Clinical','QA/QI','Compliance','HR','Operations'];
const EMP_FOLDERS = [
  {id:'trainings',label:'Trainings',icon:'M2 12L8 3l6 9H2zM8 3v9'},
  {id:'onboarding',label:'Onboarding documents',icon:'M4 1h6l3 3v10a1 1 0 01-1 1H4a1 1 0 01-1-1V2a1 1 0 011-1zM10 1v3h3'},
  {id:'hr',label:'HR & personnel',icon:'M6 2a3 3 0 100 6M1 14c0-3 2-5 5-5s5 2 5 5'},
  {id:'credentials',label:'Credentials & licenses',icon:'M8 1l2 3 3 .5-2.2 2.1.5 3.4L8 8.5l-3.3 1.5.5-3.4L3 4.5 6 4z'},
  {id:'performance',label:'Performance & reviews',icon:'M1 11l4-4 3 2 4-5 3 2'},
];
const ONBOARDING_DOCS = ['I-9 Employment Eligibility Verification','Signed offer letter','Job description — signed','W-4 Federal Tax Form','Direct deposit authorization','Emergency contact form','Photo ID (copy)','Education certificates & diplomas','Professional licenses & certifications','Background check authorization','HIPAA acknowledgment — signed','Employee handbook acknowledgment','Confidentiality agreement'];
const HR_DOCS = ['Schedule change requests','Disciplinary notices','Commendations / awards','Leave of absence requests','FMLA documentation','Workers compensation claims','Termination / separation documents'];
const CRED_DOCS = ['Medical / professional license','DEA certificate','Board certification','CPR / BLS certification','ACLS / PALS certification','NPI registration','Malpractice insurance certificate','Continuing education certificates'];
const PERF_DOCS = ['Annual performance review — 2025','Annual performance review — 2024','90-day probationary review','Mid-year check-in — 2026','Performance improvement plan (if applicable)','Peer / 360 feedback review'];

function UploadBtn({label='Upload',onUpload}) {
  return (
    <label style={{display:'inline-block',cursor:'pointer'}}>
      <input type="file" style={{display:'none'}} onChange={e=>{
        if(e.target.files[0]){const n=e.target.files[0].name;if(onUpload)onUpload(n);else alert('"'+n+'" selected.');}
      }}/>
      <span className="btn pri" style={{fontSize:11}}>{label}</span>
    </label>
  );
}

function DocRow({doc,filed,onUpload}) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:8,padding:'7px 8px',borderBottom:'0.5px solid var(--bd)',fontSize:12}}>
      <div className={`ck ${filed?'ok':'em'}`}>{filed?'✓':''}</div>
      <div style={{flex:1}}>{doc}</div>
      {filed&&<span style={{fontSize:10,color:'var(--tx-suc)',maxWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{filed}</span>}
      <UploadBtn label={filed?'Replace':'Upload'} onUpload={onUpload}/>
    </div>
  );
}

export default function Employees() {
  const [employees,setEmployees] = useState(INITIAL_EMPLOYEES.map(e=>({
    ...e,
    dept: e.dept==='Clinical / Medical'?'Clinical':e.dept==='Quality Improvement'?'QA/QI':e.dept==='HR / Operations'?'HR':e.dept==='Site Operations'?'Operations':e.dept,
    onboardingDocs:{},hrDocs:{},credentialDocs:{},performanceDocs:{},trainingAcks:{},
  })));
  const [search,setSearch]=useState('');
  const [deptFilter,setDeptFilter]=useState('');
  const [openEmps,setOpenEmps]=useState({});
  const [activeFolder,setActiveFolder]=useState({});
  const [showModal,setShowModal]=useState(false);
  const [form,setForm]=useState({fn:'',ln:'',title:'',dept:'Clinical',site:'All sites',role:'Staff',start:'',email:''});

  const togEmp=id=>setOpenEmps(p=>({...p,[id]:!p[id]}));
  const setFolder=(eid,fid)=>setActiveFolder(p=>({...p,[eid]:fid}));
  const markDone=(eid,t)=>setEmployees(p=>p.map(e=>e.id===eid?{...e,tr:{...e.tr,[t]:'done'}}:e));
  const handleAck=(eid,trf)=>{
    const trs=TRS[TRF.indexOf(trf)];
    const today=new Date().toLocaleDateString();
    setEmployees(p=>p.map(e=>e.id===eid?{...e,tr:{...e.tr,[trs]:'done'},trainingAcks:{...e.trainingAcks,[trf]:today}}:e));
  };
  const uploadDoc=(eid,folder,doc,fn)=>setEmployees(p=>p.map(e=>{
    if(e.id!==eid)return e;
    const key=folder+'Docs';
    return{...e,[key]:{...e[key],[doc]:fn}};
  }));
  const addEmp=()=>{
    if(!form.fn&&!form.ln)return;
    const tr={};TRS.forEach(t=>tr[t]='missing');
    setEmployees(p=>[...p,{id:'e'+Date.now(),name:form.fn+' '+form.ln,title:form.title,dept:form.dept,site:form.site,role:form.role,start:form.start||'2026',email:form.email,tr,onboardingDocs:{},hrDocs:{},credentialDocs:{},performanceDocs:{},trainingAcks:{}}]);
    setShowModal(false);
    setForm({fn:'',ln:'',title:'',dept:'Clinical',site:'All sites',role:'Staff',start:'',email:''});
  };

  const shown=employees.filter(e=>{
    const q=search.toLowerCase();
    return(!deptFilter||e.dept===deptFilter)&&(!q||e.name.toLowerCase().includes(q)||e.title.toLowerCase().includes(q));
  });

  return (
    <div>
      {showModal&&(
        <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal">
            <div className="modal-t">Add employee</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <div className="fl"><label>First name</label><input value={form.fn} onChange={e=>setForm(p=>({...p,fn:e.target.value}))} placeholder="First"/></div>
              <div className="fl"><label>Last name</label><input value={form.ln} onChange={e=>setForm(p=>({...p,ln:e.target.value}))} placeholder="Last"/></div>
            </div>
            <div className="fl"><label>Job title</label><input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Medical Assistant"/></div>
            <div className="fl"><label>Department</label><select value={form.dept} onChange={e=>setForm(p=>({...p,dept:e.target.value}))}>{DEPTS.map(d=><option key={d}>{d}</option>)}</select></div>
            <div className="fl"><label>Site</label><select value={form.site} onChange={e=>setForm(p=>({...p,site:e.target.value}))}><option>All sites</option><option>Bay Parkway</option><option>16th Ave</option><option>Williamsburg</option><option>Rambam</option></select></div>
            <div className="fl"><label>Role</label><select value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))}><option>Staff</option><option>Clinical Staff</option><option>Provider</option><option>Site Manager</option><option>Manager</option><option>HR</option><option>Compliance</option><option>QI Staff</option><option>Admin</option></select></div>
            <div className="fl"><label>Start date</label><input type="date" value={form.start} onChange={e=>setForm(p=>({...p,start:e.target.value}))}/></div>
            <div className="fl"><label>Email</label><input value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="employee@parcare.org"/></div>
            <div className="fa"><button className="btn" onClick={()=>setShowModal(false)}>Cancel</button><button className="btn pri" onClick={addEmp}>Add employee</button></div>
          </div>
        </div>
      )}
      <div className="tbar">
        <input placeholder="Search employees..." value={search} onChange={e=>setSearch(e.target.value)} style={{maxWidth:200}}/>
        <select value={deptFilter} onChange={e=>setDeptFilter(e.target.value)} style={{fontSize:12,padding:'5px 8px',border:'0.5px solid var(--bd-m)',borderRadius:'var(--r)',background:'var(--bg-p)',color:'var(--tx-p)'}}>
          <option value="">All departments</option>{DEPTS.map(d=><option key={d}>{d}</option>)}
        </select>
        <button className="btn pri" onClick={()=>setShowModal(true)}>Add employee</button>
      </div>
      {shown.map(e=>{
        const done=TRS.filter(t=>e.tr[t]==='done').length;
        const pct=Math.round(done/TRS.length*100);
        const col=pct===100?'#639922':pct>=80?'#185FA5':'#A32D2D';
        const miss=TRS.filter(t=>e.tr[t]==='missing');
        const curFolder=activeFolder[e.id]||'trainings';
        return (
          <div key={e.id} className="emp-card">
            <button className="emp-hd" onClick={()=>togEmp(e.id)}>
              <div className="emp-av" style={{background:DBBG[e.dept]||'var(--bg-s)',color:DBGC[e.dept]||'var(--tx-s)'}}>{ini(e.name)}</div>
              <div className="emp-info"><div className="emp-name">{e.name}</div><div className="emp-role">{e.title} · {e.dept} · {e.site}</div></div>
              <span className="rb">{e.role}</span>
              <div style={{textAlign:'right',minWidth:80}}>
                <div style={{fontSize:11,fontWeight:600,color:col}}>{pct}% trained</div>
                <div className="pb" style={{width:80,marginTop:3}}><div className="pf" style={{width:pct+'%',background:col}}></div></div>
              </div>
              {miss.length>0?<span className="bdg err">{miss.length} missing</span>:<span className="bdg ok">All done</span>}
            </button>
            {openEmps[e.id]&&(
              <div className="emp-body">
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:14,fontSize:12,padding:'10px 0',borderBottom:'0.5px solid var(--bd)'}}>
                  <div><span style={{color:'var(--tx-s)'}}>Email: </span>{e.email}</div>
                  <div><span style={{color:'var(--tx-s)'}}>Start: </span>{e.start}</div>
                  <div><span style={{color:'var(--tx-s)'}}>Site: </span>{e.site}</div>
                </div>
                {/* Folder tabs */}
                <div style={{display:'flex',gap:6,marginBottom:14,flexWrap:'wrap'}}>
                  {EMP_FOLDERS.map(f=>(
                    <button key={f.id} onClick={()=>setFolder(e.id,f.id)} style={{display:'flex',alignItems:'center',gap:5,padding:'5px 10px',fontSize:11,fontWeight:curFolder===f.id?600:400,border:'0.5px solid var(--bd-m)',borderRadius:'var(--r)',background:curFolder===f.id?'var(--bg-info)':'var(--bg-p)',color:curFolder===f.id?'var(--tx-info)':'var(--tx-s)',cursor:'pointer'}}>
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="12" height="12"><path d={f.icon}/></svg>
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* TRAININGS */}
                {curFolder==='trainings'&&(
                  <div>
                    <div style={{fontSize:11,color:'var(--tx-info)',marginBottom:10,padding:'8px 10px',background:'var(--bg-info)',borderRadius:'var(--r)'}}>
                      Staff complete each training and sign the electronic acknowledgment. Acknowledgments are automatically filed here and update the compliance tracker. Annual trainings auto-renew — HR and the employee are notified 30 days before the renewal date.
                    </div>
                    {TRS.map((t,i)=>{
                      const isDone=e.tr[t]==='done';
                      const ackDate=e.trainingAcks&&e.trainingAcks[TRF[i]];
                      const renewalDue=ackDate?new Date(new Date(ackDate).setFullYear(new Date(ackDate).getFullYear()+1)).toLocaleDateString():'';
                      const daysUntil=ackDate?Math.round((new Date(renewalDue)-new Date())/86400000):null;
                      const renewSoon=daysUntil!==null&&daysUntil<=30&&daysUntil>0;
                      return (
                        <div key={t} style={{display:'flex',alignItems:'center',gap:8,padding:'8px',borderBottom:'0.5px solid var(--bd)',fontSize:12}}>
                          <div className={`ck ${isDone?'ok':'err'}`}>{isDone?'✓':'✗'}</div>
                          <div style={{flex:1}}>
                            <div style={{fontWeight:500}}>{TRF[i]}</div>
                            {ackDate&&<div style={{fontSize:10,color:renewSoon?'var(--tx-warn)':'var(--tx-t)'}}>Acknowledged: {ackDate} · Renewal due: {renewalDue}{renewSoon?' — ⚠ Due in '+daysUntil+' days':''}</div>}
                          </div>
                          {!isDone&&<button className="btn sm" onClick={()=>markDone(e.id,t)}>Mark done</button>}
                          {isDone&&!ackDate&&(
                            <button className="btn sm" style={{background:'var(--bg-warn)',color:'var(--tx-warn)',border:'none',fontSize:10}}
                              onClick={()=>{if(window.confirm('By clicking OK you electronically acknowledge completing: "'+TRF[i]+'". This will be recorded in your file and the compliance tracker updated.'))handleAck(e.id,TRF[i]);}}>
                              Sign acknowledgment
                            </button>
                          )}
                          {ackDate&&<span className="bdg ok" style={{fontSize:10}}>Signed ✓</span>}
                          <UploadBtn label="Upload cert" onUpload={fn=>uploadDoc(e.id,'onboarding','Training cert: '+TRF[i],fn)}/>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ONBOARDING */}
                {curFolder==='onboarding'&&(
                  <div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                      <div style={{fontSize:11,color:'var(--tx-s)'}}>Onboarding & hiring documents for {e.name}</div>
                      <UploadBtn label="Upload document" onUpload={fn=>uploadDoc(e.id,'onboarding',fn,fn)}/>
                    </div>
                    {ONBOARDING_DOCS.map(doc=><DocRow key={doc} doc={doc} filed={e.onboardingDocs&&e.onboardingDocs[doc]} onUpload={fn=>uploadDoc(e.id,'onboarding',doc,fn)}/>)}
                  </div>
                )}

                {/* HR */}
                {curFolder==='hr'&&(
                  <div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                      <div style={{fontSize:11,color:'var(--tx-s)'}}>HR & personnel records</div>
                      <UploadBtn label="Upload document" onUpload={fn=>uploadDoc(e.id,'hr',fn,fn)}/>
                    </div>
                    {HR_DOCS.map(doc=><DocRow key={doc} doc={doc} filed={e.hrDocs&&e.hrDocs[doc]} onUpload={fn=>uploadDoc(e.id,'hr',doc,fn)}/>)}
                  </div>
                )}

                {/* CREDENTIALS */}
                {curFolder==='credentials'&&(
                  <div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                      <div style={{fontSize:11,color:'var(--tx-s)'}}>Professional credentials, licenses & certifications</div>
                      <UploadBtn label="Upload credential" onUpload={fn=>uploadDoc(e.id,'credential',fn,fn)}/>
                    </div>
                    {CRED_DOCS.map(doc=><DocRow key={doc} doc={doc} filed={e.credentialDocs&&e.credentialDocs[doc]} onUpload={fn=>uploadDoc(e.id,'credential',doc,fn)}/>)}
                  </div>
                )}

                {/* PERFORMANCE */}
                {curFolder==='performance'&&(
                  <div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                      <div style={{fontSize:11,color:'var(--tx-s)'}}>Performance reviews & evaluations</div>
                      <UploadBtn label="Upload review" onUpload={fn=>uploadDoc(e.id,'performance',fn,fn)}/>
                    </div>
                    {PERF_DOCS.map(doc=><DocRow key={doc} doc={doc} filed={e.performanceDocs&&e.performanceDocs[doc]} onUpload={fn=>uploadDoc(e.id,'performance',doc,fn)}/>)}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
