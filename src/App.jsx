import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuditProvider } from './context/AuditContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import BeliefAudit from './pages/BeliefAudit';
import OriginMap from './pages/OriginMap';
import CriticalGym from './pages/CriticalGym';
import ClarityScore from './pages/ClarityScore';

function App() {
  return (
    <AuditProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/audit" element={<BeliefAudit />} />
            <Route path="/map" element={<OriginMap />} />
            <Route path="/gym" element={<CriticalGym />} />
            <Route path="/score" element={<ClarityScore />} />
          </Routes>
        </Layout>
      </Router>
    </AuditProvider>
  );
}

export default App;
