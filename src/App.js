import React, { useState, useCallback } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import TrainingLibrary from './pages/TrainingLibrary';
import TrainingTracker from './pages/TrainingTracker';
import Tasks from './pages/Tasks';
import SiteOperations from './pages/SiteOperations';
import Documents from './pages/Documents';
import Forms from './pages/Forms';
import Policies from './pages/Policies';
import Contracts from './pages/Contracts';
import CompanyInfo from './pages/CompanyInfo';
import Compliance from './pages/Compliance';

const NAV = [
  { section: 'Overview' },
  { id: 'dash', label: 'Dashboard', icon: 'M1 1h6v6H1zM9 1h6v6H9zM1 9h6v6H1zM9 9h6v6H9z' },
  { section: 'HRIS' },
  { id: 'employees', label: 'Employees', icon: 'M6 2a3 3 0 100 6 3 3 0 000-6zM1 14c0-3 2-5 5-5s5 2 5 5M12 3a2 2 0 100 4M14 13c0-2-1-3-2-4' },
  { id: 'depts', label: 'Departments', icon: 'M8 2v4M4 6H2v8h12V6h-2M4 6V4a4 4 0 018 0v2M4 6h8' },
  { section: 'LMS' },
  { id: 'lms', label: 'Training library', icon: 'M2 12L8 3l6 9H2zM8 3v9' },
  { id: 'training', label: 'Training tracker', icon: 'M4 8l3 3 5-5M1 1h14v14H1z' },
  { section: 'Compliance' },
  { id: 'tasks', label: 'Tasks', icon: 'M3 4h10M3 8h7M3 12h5M13 9a2.5 2.5 0 100 5 2.5 2.5 0 000-5z' },
  { id: 'site', label: 'Site trainings & compliance', icon: 'M2 7h12v8H2zM5 7V5a3 3 0 016 0v2' },
  { id: 'comp', label: 'Compliance tracker', icon: 'M4 8l3 3 5-5M2 2h12v12H2z' },
  { section: 'Documents' },
  { id: 'docs', label: 'Documents', icon: 'M4 1h6l3 3v10a1 1 0 01-1 1H4a1 1 0 01-1-1V2a1 1 0 011-1zM10 1v3h3' },
  { id: 'policies', label: 'Policies & Procedures', icon: 'M4 1h6l3 3v10a1 1 0 01-1 1H4a1 1 0 01-1-1V2a1 1 0 011-1zM10 1v3h3M5 7h6M5 10h4' },
  { id: 'forms', label: 'Forms', icon: 'M2 2h12v12H2zM5 5h6M5 8h6M5 11h4' },
  { id: 'contracts', label: 'Contracts & Agreements', icon: 'M3 2h10v12H3zM6 5h4M6 8h4M6 11h2' },
  { id: 'company', label: 'Company information', icon: 'M8 1a4 4 0 100 8 4 4 0 000-8zM2 14c0-3.3 2.7-6 6-6s6 2.7 6 6' },
];

const PAGES = { dash:Dashboard, employees:Employees, depts:Departments, lms:TrainingLibrary, training:TrainingTracker, tasks:Tasks, site:SiteOperations, docs:Documents, policies:Policies, forms:Forms, contracts:Contracts, company:CompanyInfo, comp:Compliance };
const TITLES = { dash:'Dashboard', employees:'Employees', depts:'Departments', lms:'Training library', training:'Training tracker', tasks:'Tasks & assignments', site:'Site trainings & compliance', docs:'Documents', policies:'Policies & Procedures', forms:'Forms', contracts:'Contracts & Agreements', company:'Company information', comp:'Compliance tracker' };

export default function App() {
  const [page, setPage] = useState('dash');
  const navigate = useCallback((id) => setPage(id), []);
  const PageComponent = PAGES[page] || Dashboard;
  return (
    <div className="app">
      <aside className="sb">
        <div className="sb-logo">
          <div className="sb-logo-n">ParCare</div>
          <div className="sb-logo-s">Compliance · LMS · HRIS</div>
        </div>
        {NAV.map((item, i) =>
          item.section
            ? <div key={i} className="nl">{item.section}</div>
            : <button key={item.id} className={'ni'+(page===item.id?' active':'')} onClick={()=>navigate(item.id)}>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14" style={{flexShrink:0}}><path d={item.icon}/></svg>
                {item.label}
              </button>
        )}
        <div style={{flex:1}}/>
        <div className="nl">Account</div>
        <button className="ni"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14" style={{flexShrink:0}}><circle cx="8" cy="8" r="2.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2"/></svg>Settings</button>
      </aside>
      <div className="main">
        <div className="tb">
          <div className="tb-t">{TITLES[page]}</div>
          <div className="tb-r">
            <span className="bdg err">5 overdue</span>
            <span className="bdg warn">8 training incomplete</span>
            <div className="av">AD</div>
          </div>
        </div>
        <div className="cnt"><PageComponent navigate={navigate}/></div>
      </div>
    </div>
  );
}
