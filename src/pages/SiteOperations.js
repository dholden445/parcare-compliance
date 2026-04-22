import React, { useState } from 'react';

const SITES = ['Bay Parkway','16th Ave','Williamsburg','Rambam'];
const QS = ['Q1 2026','Q2 2026','Q3 2026','Q4 2026'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const initDrills = () => {
  const d = {};
  SITES.forEach(s => { d[s] = {'Q1 2026':'done','Q2 2026':s==='Bay Parkway'||s==='Rambam'?'pending':'done','Q3 2026':'','Q4 2026':''}; });
  return d;
};

const initTempLogs = () => {
  const t = {};
  SITES.forEach(s => { t[s] = {}; MONTHS.forEach(m => { t[s][m] = m==='Jan'||m==='Feb'||m==='Mar'?'done':m==='Apr'?'pending':''; }); });
  return t;
};

const SAFETY = {
  'Bay Parkway':[{id:'bp1',name:'AED inspection & battery check',cat:'Emergency Equipment',due:'May 1, 2026',status:'pending',upload:true},{id:'bp2',name:'Exit signage & emergency lighting test',cat:'Fire & Safety',due:'Apr 30, 2026',status:'pending',upload:false},{id:'bp3',name:'Fire extinguisher annual inspection',cat:'Fire & Safety',due:'Mar 31, 2026',status:'overdue',upload:true}],
  '16th Ave':[{id:'161',name:'AED inspection & battery check',cat:'Emergency Equipment',due:'May 1, 2026',status:'done',upload:true},{id:'162',name:'Evacuation route map posted',cat:'Fire & Safety',due:'Apr 15, 2026',status:'done',upload:false},{id:'163',name:'Biohazard waste container review',cat:'Facility',due:'May 15, 2026',status:'pending',upload:false}],
  'Williamsburg':[{id:'wb1',name:'Emergency contact list updated',cat:'Fire & Safety',due:'Apr 25, 2026',status:'pending',upload:false},{id:'wb2',name:'Fire extinguisher annual inspection',cat:'Fire & Safety',due:'Apr 1, 2026',status:'overdue',upload:true},{id:'wb3',name:'AED inspection & battery check',cat:'Emergency Equipment',due:'May 1, 2026',status:'pending',upload:true}],
  'Rambam':[{id:'rm1',name:'AED inspection & battery check',cat:'Emergency Equipment',due:'May 1, 2026',status:'pending',upload:true},{id:'rm2',name:'Exit signage & emergency lighting test',cat:'Fire & Safety',due:'Apr 30, 2026',status:'pending',upload:false},{id:'rm3',name:'Evacuation route map posted',cat:'Fire & Safety',due:'Apr 15, 2026',status:'pending',upload:false}],
};

function UploadBtn({label='Upload document'}) {
  return (
    <label style={{display:'inline-block',cursor:'pointer'}}>
      <input type="file" style={{display:'none'}} onChange={e=>{ if(e.target.files[0]) alert('File "'+e.target.files[0].name+'" selected. In the full version this will be saved to storage.'); }}/>
      <span className="btn sm" style={{background:'var(--bg-info)',color:'var(--tx-info)',border:'none'}}>{label}</span>
    </label>
  );
}

export default function SiteOperations() {
  const [activeSite, setActiveSite] = useState('All sites');
  const [drills, setDrills] = useState(initDrills);
  const [tempLogs, setTempLogs] = useState(initTempLogs);
  const [safety, setSafety] = useState(SAFETY);
  const [openItems, setOpenItems] = useState({});
  const [activeTab, setActiveTab] = useState('drills');

  const tog = id => setOpenItems(p=>({...p,[id]:!p[id]}));
  const markDrill = (site,q) => setDrills(p=>({...p,[site]:{...p[site],[q]:'done'}}));
  const markTemp = (site,m) => setTempLogs(p=>({...p,[site]:{...p[site],[m]:'done'}}));
  const markSafety = (site,id) => setSafety(p=>({...p,[site]:p[site].map(t=>t.id===id?{...t,status:'done'}:t)}));

  const sites = activeSite==='All sites' ? SITES : [activeSite];
  const totalDrills = SITES.length*QS.length;
  const doneDrills = SITES.reduce((a,s)=>a+QS.filter(q=>drills[s][q]==='done').length,0);

  return (
    <div>
      <div className="mets" style={{gridTemplateColumns:'repeat(3,minmax(0,1fr))'}}>
        <div className="met"><div className="met-l">Fire drills completed</div><div className="met-v" style={{color:'#BA7517'}}>{doneDrills}/{totalDrills}</div><div className="pb" style={{marginTop:6}}><div className="pf" style={{width:Math.round(doneDrills/totalDrills*100)+'%',background:'#BA7517'}}></div></div></div>
        <div className="met"><div className="met-l">Temp logs current</div><div className="met-v" style={{color:'#185FA5'}}>3/4 sites</div><div className="met-s">April pending — Rambam</div></div>
        <div className="met"><div className="met-l">Site compliance</div><div className="met-v" style={{color:'#BA7517'}}>75%</div><div className="pb" style={{marginTop:6}}><div className="pf" style={{width:'75%',background:'#BA7517'}}></div></div></div>
      </div>

      <div className="site-tabs" style={{marginBottom:10}}>
        {['All sites',...SITES].map(s=><button key={s} className={`stab${activeSite===s?' active':''}`} onClick={()=>setActiveSite(s)}>{s}</button>)}
      </div>

      <div className="site-tabs" style={{marginBottom:14}}>
        {['drills','temperature','safety'].map(t=><button key={t} className={`stab${activeTab===t?' active':''}`} onClick={()=>setActiveTab(t)}>{t==='drills'?'Fire drills':t==='temperature'?'Temperature logs':'Safety tasks'}</button>)}
      </div>

      {activeTab==='drills' && (
        <div>
          <div className="sec-t" style={{marginBottom:12}}>Quarterly fire drills — {activeSite}<span style={{color:'#BA7517'}}>{doneDrills}/{totalDrills} complete</span></div>
          {activeSite==='All sites' && (
            <div className="drill-grid">
              {SITES.map(s=>(
                <div key={s} className="drill-cell">
                  <div className="drill-site">{s}</div>
                  {QS.map(q=>(
                    <div key={q} className="drill-q">
                      <div className={`ck ${drills[s][q]==='done'?'ok':drills[s][q]==='pending'?'warn':'em'}`}>{drills[s][q]==='done'?'✓':drills[s][q]==='pending'?'~':''}</div>
                      <div className="drill-ql" style={{fontSize:11}}>{q}</div>
                      {drills[s][q]==='pending'&&<button className="btn sm" onClick={()=>markDrill(s,q)}>Done</button>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          {sites.map(s=>(
            <div key={s} style={{marginBottom:16}}>
              {activeSite==='All sites'&&<div className="sec-t" style={{marginTop:8}}>{s} — drill tasks</div>}
              {QS.map(q=>{
                const st=drills[s][q]; const isDone=st==='done'; const isPend=st==='pending';
                const id=`drill_${s}_${q}`;
                return (
                  <div key={q} style={{background:'var(--bg-p)',border:'0.5px solid var(--bd)',borderRadius:'var(--rl)',marginBottom:7,overflow:'hidden'}}>
                    <button style={{display:'flex',alignItems:'center',gap:8,padding:'9px 12px',width:'100%',background:'transparent',border:'none',textAlign:'left',cursor:'pointer'}} onClick={()=>tog(id)}>
                      <div className={`ck ${isDone?'ok':isPend?'warn':'em'}`}>{isDone?'✓':isPend?'~':''}</div>
                      <div style={{flex:1,fontSize:12,fontWeight:600}}>Fire drill — {s} — {q}</div>
                      {isDone?<span className="bdg ok">Complete</span>:isPend?<span className="bdg warn">Pending</span>:<span className="bdg neu">Upcoming</span>}
                    </button>
                    {openItems[id] && (
                      <div className="task-body">
                        <div style={{fontSize:12,marginBottom:6}}><span style={{color:'var(--tx-s)'}}>Required: </span>Signed staff participation sign-in sheet</div>
                        {isDone
                          ? <div className="done-banner">✓ Completed — sign-in sheet on file</div>
                          : <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
                              <button className="btn suc" onClick={()=>markDrill(s,q)}>Mark complete</button>
                              <UploadBtn label="Upload sign-in sheet"/>
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

      {activeTab==='temperature' && (
        <div>
          <div className="sec-t" style={{marginBottom:12}}>Monthly temperature logs — required by site supervisors<span style={{color:'var(--tx-s)'}}>Refrigerator & medication storage</span></div>
          {sites.map(s=>(
            <div key={s} style={{marginBottom:20}}>
              <div className="sec-t">{s}<span><UploadBtn label="Upload log"/></span></div>
              <div className="card">
                <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:8}}>
                  {MONTHS.map(m=>{
                    const st=tempLogs[s][m];
                    const isDone=st==='done'; const isPend=st==='pending';
                    return (
                      <div key={m} style={{textAlign:'center',padding:'8px 4px',borderRadius:'var(--r)',background:isDone?'var(--bg-suc)':isPend?'var(--bg-warn)':'var(--bg-s)',border:'0.5px solid var(--bd)'}}>
                        <div style={{fontSize:11,fontWeight:600,color:isDone?'var(--tx-suc)':isPend?'var(--tx-warn)':'var(--tx-t)',marginBottom:4}}>{m}</div>
                        <div style={{fontSize:10,color:isDone?'var(--tx-suc)':isPend?'var(--tx-warn)':'var(--tx-t)',marginBottom:6}}>{isDone?'Done':isPend?'Pending':'—'}</div>
                        {isPend&&<button className="btn sm" style={{fontSize:9}} onClick={()=>markTemp(s,m)}>Mark done</button>}
                        {isDone&&<UploadBtn label="Re-upload"/>}
                      </div>
                    );
                  })}
                </div>
                <div style={{marginTop:10,paddingTop:10,borderTop:'0.5px solid var(--bd)',fontSize:11,color:'var(--tx-s)'}}>
                  Temperature logs must be completed monthly by the site supervisor and uploaded to this system. Required for CLIA compliance and NYS Article 28 inspection readiness.
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab==='safety' && (
        <div>
          <div className="sec-t" style={{marginBottom:12}}>Safety & facility tasks — {activeSite}</div>
          {sites.map(s=>(
            <div key={s} style={{marginBottom:16}}>
              {activeSite==='All sites'&&<div className="sec-t">{s}</div>}
              {(safety[s]||[]).map(t=>{
                const isDone=t.status==='done'; const isOver=t.status==='overdue';
                const id=`st_${s}_${t.id}`;
                return (
                  <div key={t.id} style={{background:'var(--bg-p)',border:`0.5px solid ${isOver?'#f09595':'var(--bd)'}`,borderRadius:'var(--rl)',marginBottom:7,overflow:'hidden'}}>
                    <button style={{display:'flex',alignItems:'center',gap:8,padding:'9px 12px',width:'100%',background:'transparent',border:'none',textAlign:'left',cursor:'pointer'}} onClick={()=>tog(id)}>
                      <div className={`ck ${isDone?'ok':isOver?'err':'warn'}`}>{isDone?'✓':isOver?'!':'~'}</div>
                      <div style={{flex:1,fontSize:12,fontWeight:600}}>{t.name}</div>
                      <span style={{fontSize:10,color:'var(--tx-t)',marginRight:4}}>{t.cat}</span>
                      {isDone?<span className="bdg ok">Complete</span>:isOver?<span className="bdg err">Overdue</span>:<span className="bdg warn">Pending</span>}
                    </button>
                    {openItems[id] && (
                      <div className="task-body">
                        <div style={{fontSize:12,marginBottom:5}}><span style={{color:'var(--tx-s)'}}>Due: </span><span style={{color:isOver?'var(--tx-err)':''}}>{t.due}</span></div>
                        {isDone
                          ? <div className="done-banner">✓ Completed</div>
                          : <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
                              <button className="btn suc" onClick={()=>markSafety(s,t.id)}>Mark complete</button>
                              {t.upload&&<UploadBtn label="Upload document"/>}
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
    </div>
  );
}
