import React, { useState } from 'react';

const SITES = ['Bay Parkway','16th Ave','Williamsburg','Rambam'];
const QS = ['Q1 2026','Q2 2026','Q3 2026','Q4 2026'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const SITE_TRAININGS = [
  {id:'fire_safety',name:'Fire Safety & Evacuation Procedures',freq:'Annual',desc:'Site-specific fire evacuation routes, extinguisher locations, assembly points. All staff at this site must complete. Site supervisor conducts and documents.'},
  {id:'emergency_resp',name:'Emergency Response Protocols — Site Specific',freq:'Annual',desc:'Site-specific emergency contacts, code procedures, AED locations, and lockdown protocols.'},
  {id:'infection_site',name:'Infection Control — Site Walk-Through',freq:'Annual',desc:'Site-specific infection control inspection and staff acknowledgment of PPE locations and protocols.'},
  {id:'hipaa_site',name:'HIPAA & Privacy Walk-Through — Site Specific',freq:'Annual',desc:'Review of site-specific privacy areas, sign-in sheet protocols, and patient confidentiality measures.'},
  {id:'workplace_safety',name:'Workplace Safety & Hazard Communication',freq:'Annual',desc:'Site-specific hazard review, SDS binder location, sharps disposal, and biohazard waste procedures.'},
];

const initDrills = () => {
  const d = {};
  SITES.forEach(s=>{
    d[s] = {
      'Q1 2026':{status:'done',signInSheet:'Q1_2026_'+s.replace(/\s/g,'_')+'_signin.pdf'},
      'Q2 2026':{status:s==='Bay Parkway'||s==='Rambam'?'pending':'done',signInSheet:s!=='Bay Parkway'&&s!=='Rambam'?'Q2_2026_'+s.replace(/\s/g,'_')+'_signin.pdf':null},
      'Q3 2026':{status:'upcoming',signInSheet:null},
      'Q4 2026':{status:'upcoming',signInSheet:null},
    };
  });
  return d;
};

const initSiteTrainings = () => {
  const t = {};
  SITES.forEach(s=>{
    t[s]={};
    SITE_TRAININGS.forEach(tr=>{
      t[s][tr.id]={status:tr.id==='fire_safety'||tr.id==='infection_site'?'done':'pending',signInSheet:tr.id==='fire_safety'?'fire_safety_signin_'+s.replace(/\s/g,'_')+'.pdf':null,completedDate:tr.id==='fire_safety'||tr.id==='infection_site'?'Jan 15, 2026':null};
    });
  });
  return t;
};

const initTempLogs = () => {
  const t={};
  SITES.forEach(s=>{
    t[s]={};
    MONTHS.forEach(m=>{
      t[s][m]={status:m==='Jan'||m==='Feb'||m==='Mar'?'done':m==='Apr'?'pending':'upcoming',file:m==='Jan'||m==='Feb'||m==='Mar'?'temp_log_'+m+'_'+s.replace(/\s/g,'_')+'.pdf':null};
    });
  });
  return t;
};

function UploadBtn({label='Upload',onUpload}) {
  return (
    <label style={{display:'inline-block',cursor:'pointer'}}>
      <input type="file" style={{display:'none'}} onChange={e=>{
        if(e.target.files[0]){const n=e.target.files[0].name;if(onUpload)onUpload(n);else alert('"'+n+'" selected.');}
      }}/>
      <span className="btn suc" style={{fontSize:11}}>{label}</span>
    </label>
  );
}

function SignInViewer({fileName}) {
  if(!fileName) return null;
  return (
    <div style={{display:'flex',alignItems:'center',gap:6,padding:'6px 10px',background:'var(--bg-suc)',borderRadius:'var(--r)',fontSize:11,color:'var(--tx-suc)',marginTop:6}}>
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="12" height="12"><path d="M4 1h6l3 3v10a1 1 0 01-1 1H4a1 1 0 01-1-1V2a1 1 0 011-1zM10 1v3h3"/></svg>
      <span>Sign-in sheet on file: <strong>{fileName}</strong></span>
      <button className="btn sm" style={{fontSize:10,marginLeft:4}}>View</button>
    </div>
  );
}

export default function SiteOperations() {
  const [activeSite,setActiveSite]=useState('All sites');
  const [activeTab,setActiveTab]=useState('trainings');
  const [drills,setDrills]=useState(initDrills);
  const [siteTrainings,setSiteTrainings]=useState(initSiteTrainings);
  const [tempLogs,setTempLogs]=useState(initTempLogs);
  const [openItems,setOpenItems]=useState({});

  const tog=id=>setOpenItems(p=>({...p,[id]:!p[id]}));

  const markDrill=(site,q,file)=>{
    setDrills(p=>({...p,[site]:{...p[site],[q]:{status:'done',signInSheet:file||('Q'+q[1]+'_signin.pdf')}}}));
  };

  const markSiteTraining=(site,tid,file)=>{
    setSiteTrainings(p=>({...p,[site]:{...p[site],[tid]:{status:'done',signInSheet:file||'signin.pdf',completedDate:new Date().toLocaleDateString()}}}));
  };

  const markTemp=(site,month,file)=>{
    setTempLogs(p=>({...p,[site]:{...p[site],[month]:{status:'done',file:file||('temp_log_'+month+'.pdf')}}}));
  };

  const sites=activeSite==='All sites'?SITES:[activeSite];
  const totalDrills=SITES.length*QS.length;
  const doneDrills=SITES.reduce((a,s)=>a+QS.filter(q=>drills[s]&&drills[s][q]&&drills[s][q].status==='done').length,0);

  return (
    <div>
      <div style={{marginBottom:8}}>
        <div style={{fontSize:11,color:'var(--tx-s)',padding:'8px 12px',background:'var(--bg-info)',borderRadius:'var(--r)',marginBottom:12}}>
          Site-specific trainings, fire drills, and temperature logs — all require supervisor sign-off and document upload. Sign-in sheets are stored per event and viewable below.
        </div>
      </div>

      <div className="mets" style={{gridTemplateColumns:'repeat(3,minmax(0,1fr))'}}>
        <div className="met"><div className="met-l">Fire drills complete</div><div className="met-v" style={{color:'#BA7517'}}>{doneDrills}/{totalDrills}</div><div className="pb" style={{marginTop:6}}><div className="pf" style={{width:Math.round(doneDrills/totalDrills*100)+'%',background:'#BA7517'}}></div></div></div>
        <div className="met"><div className="met-l">Temp logs — April</div><div className="met-v" style={{color:'#A32D2D'}}>3/4 sites</div><div className="met-s">Rambam pending</div></div>
        <div className="met"><div className="met-l">Site compliance</div><div className="met-v" style={{color:'#BA7517'}}>75%</div></div>
      </div>

      <div className="site-tabs" style={{marginBottom:10}}>
        {['All sites',...SITES].map(s=><button key={s} className={'stab'+(activeSite===s?' active':'')} onClick={()=>setActiveSite(s)}>{s}</button>)}
      </div>

      <div className="site-tabs" style={{marginBottom:16}}>
        {[{id:'trainings',label:'Site trainings'},{id:'drills',label:'Fire drills'},{id:'temperature',label:'Temperature logs'}].map(t=>(
          <button key={t.id} className={'stab'+(activeTab===t.id?' active':'')} onClick={()=>setActiveTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* SITE TRAININGS */}
      {activeTab==='trainings'&&sites.map(site=>(
        <div key={site} style={{marginBottom:20}}>
          {activeSite==='All sites'&&<div className="sec-t">{site}<span>{SITE_TRAININGS.filter(t=>siteTrainings[site]&&siteTrainings[site][t.id]&&siteTrainings[site][t.id].status==='done').length}/{SITE_TRAININGS.length} complete</span></div>}
          {SITE_TRAININGS.map(tr=>{
            const info=(siteTrainings[site]&&siteTrainings[site][tr.id])||{status:'pending',signInSheet:null};
            const isDone=info.status==='done';
            const id='str_'+site+'_'+tr.id;
            return (
              <div key={tr.id} style={{background:'var(--bg-p)',border:'0.5px solid var(--bd)',borderRadius:'var(--rl)',marginBottom:8,overflow:'hidden'}}>
                <button style={{display:'flex',alignItems:'center',gap:8,padding:'10px 14px',width:'100%',background:'transparent',border:'none',textAlign:'left',cursor:'pointer'}} onClick={()=>tog(id)}>
                  <div className={`ck ${isDone?'ok':'warn'}`}>{isDone?'✓':'~'}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:600}}>{tr.name}</div>
                    <div style={{fontSize:10,color:'var(--tx-t)'}}>{tr.freq} · {activeSite==='All sites'?site:''}{info.completedDate?' · Completed: '+info.completedDate:''}</div>
                  </div>
                  {isDone?<span className="bdg ok">Complete</span>:<span className="bdg warn">Pending</span>}
                  <span style={{fontSize:11,color:'var(--tx-t)',marginLeft:4}}>{openItems[id]?'▲':'▼'}</span>
                </button>
                {openItems[id]&&(
                  <div className="task-body">
                    <div style={{fontSize:12,marginBottom:8,color:'var(--tx-s)'}}>{tr.desc}</div>
                    {isDone&&info.signInSheet
                      ? <SignInViewer fileName={info.signInSheet}/>
                      : <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center',marginTop:6}}>
                          <button className="btn suc" onClick={()=>markSiteTraining(site,tr.id)}>Mark complete</button>
                          <UploadBtn label="Mark complete & upload sign-in sheet" onUpload={fn=>markSiteTraining(site,tr.id,fn)}/>
                        </div>
                    }
                    {isDone&&<div style={{marginTop:8,display:'flex',gap:8}}><UploadBtn label="Replace sign-in sheet" onUpload={fn=>markSiteTraining(site,tr.id,fn)}/></div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {/* FIRE DRILLS */}
      {activeTab==='drills'&&(
        <div>
          {activeSite==='All sites'&&(
            <div className="drill-grid" style={{marginBottom:16}}>
              {SITES.map(s=>(
                <div key={s} className="drill-cell">
                  <div className="drill-site">{s}</div>
                  {QS.map(q=>{
                    const info=(drills[s]&&drills[s][q])||{status:'',signInSheet:null};
                    return (
                      <div key={q} className="drill-q">
                        <div className={`ck ${info.status==='done'?'ok':info.status==='pending'?'warn':'em'}`}>{info.status==='done'?'✓':info.status==='pending'?'~':''}</div>
                        <div className="drill-ql" style={{fontSize:11}}>{q}</div>
                        {info.status==='pending'&&<button className="btn sm" style={{fontSize:9}} onClick={()=>markDrill(s,q)}>Done</button>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
          {sites.map(site=>(
            <div key={site} style={{marginBottom:20}}>
              {activeSite==='All sites'&&<div className="sec-t">{site} — fire drill detail<span>{QS.filter(q=>drills[site]&&drills[site][q]&&drills[site][q].status==='done').length}/4 complete</span></div>}
              {QS.map(q=>{
                const info=(drills[site]&&drills[site][q])||{status:'upcoming',signInSheet:null};
                const isDone=info.status==='done';
                const isPend=info.status==='pending';
                const id='drill_'+site+'_'+q.replace(/\s/g,'_');
                return (
                  <div key={q} style={{background:'var(--bg-p)',border:'0.5px solid var(--bd)',borderRadius:'var(--rl)',marginBottom:8,overflow:'hidden'}}>
                    <button style={{display:'flex',alignItems:'center',gap:8,padding:'10px 14px',width:'100%',background:'transparent',border:'none',textAlign:'left',cursor:'pointer'}} onClick={()=>tog(id)}>
                      <div className={`ck ${isDone?'ok':isPend?'warn':'em'}`}>{isDone?'✓':isPend?'~':''}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:12,fontWeight:600}}>Fire drill — {site} — {q}</div>
                        {isDone&&<div style={{fontSize:10,color:'var(--tx-suc)'}}>Completed · Sign-in sheet on file</div>}
                      </div>
                      {isDone?<span className="bdg ok">Complete</span>:isPend?<span className="bdg warn">Pending</span>:<span className="bdg neu">Upcoming</span>}
                      <span style={{fontSize:11,color:'var(--tx-t)',marginLeft:4}}>{openItems[id]?'▲':'▼'}</span>
                    </button>
                    {openItems[id]&&(
                      <div className="task-body">
                        <div style={{fontSize:12,marginBottom:8}}>
                          <span style={{color:'var(--tx-s)'}}>Required: </span>Full facility evacuation drill — all staff must participate. Site supervisor documents start time, end time, staff count, and any issues.
                        </div>
                        {isDone&&info.signInSheet
                          ? <>
                              <SignInViewer fileName={info.signInSheet}/>
                              <div style={{marginTop:8}}><UploadBtn label="Replace sign-in sheet" onUpload={fn=>markDrill(site,q,fn)}/></div>
                            </>
                          : <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
                              <button className="btn suc" onClick={()=>markDrill(site,q)}>Mark complete</button>
                              <UploadBtn label="Mark complete & upload sign-in sheet" onUpload={fn=>markDrill(site,q,fn)}/>
                            </div>
                        }
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* TEMPERATURE LOGS */}
      {activeTab==='temperature'&&sites.map(site=>(
        <div key={site} style={{marginBottom:20}}>
          {activeSite==='All sites'&&<div className="sec-t">{site} — monthly temperature logs<span>{MONTHS.filter(m=>tempLogs[site]&&tempLogs[site][m]&&tempLogs[site][m].status==='done').length}/12 complete</span></div>}
          <div className="card">
            <div style={{fontSize:11,color:'var(--tx-s)',marginBottom:12}}>Refrigerator & medication storage temperature logs — required monthly by site supervisor. Upload completed log for each month.</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:8}}>
              {MONTHS.map(m=>{
                const info=(tempLogs[site]&&tempLogs[site][m])||{status:'upcoming',file:null};
                const isDone=info.status==='done';
                const isPend=info.status==='pending';
                const id='temp_'+site+'_'+m;
                return (
                  <div key={m} style={{textAlign:'center',padding:'8px 4px',borderRadius:'var(--r)',background:isDone?'var(--bg-suc)':isPend?'var(--bg-warn)':'var(--bg-s)',border:'0.5px solid var(--bd)',cursor:'pointer'}} onClick={()=>tog(id)}>
                    <div style={{fontSize:12,fontWeight:600,color:isDone?'var(--tx-suc)':isPend?'var(--tx-warn)':'var(--tx-t)',marginBottom:3}}>{m}</div>
                    <div style={{fontSize:10,color:isDone?'var(--tx-suc)':isPend?'var(--tx-warn)':'var(--tx-t)',marginBottom:6}}>{isDone?'Done':isPend?'Pending':'—'}</div>
                    {info.file&&<div style={{fontSize:9,color:'var(--tx-suc)',marginBottom:4,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{info.file}</div>}
                    {openItems[id]&&(
                      <div style={{marginTop:6}}>
                        {isPend&&<button className="btn sm" style={{fontSize:9,marginBottom:4,width:'100%'}} onClick={e=>{e.stopPropagation();markTemp(site,m);}}>Mark done</button>}
                        <label style={{display:'block',cursor:'pointer'}} onClick={e=>e.stopPropagation()}>
                          <input type="file" style={{display:'none'}} onChange={ev=>{if(ev.target.files[0])markTemp(site,m,ev.target.files[0].name);}}/>
                          <span className="btn sm" style={{fontSize:9,background:'var(--bg-info)',color:'var(--tx-info)',border:'none',display:'block'}}>{isDone?'Replace':'Upload log'}</span>
                        </label>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
