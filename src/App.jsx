import { Routes, Route, Navigate } from 'react-router-dom';
import ComingSoon from './pages/ComingSoon';
import { Toaster } from 'sonner'; 
import './App.css';

import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <div className="min-h-screen bg-[#050505]">
      
      <Analytics/>
      {/* Notification Layer */}
      <Toaster theme="dark" position="bottom-right" closeButton />

      <main className="relative">
        <Routes>
          {/* THE ONLY ACTIVE ROUTE */}
          <Route path="/" element={<ComingSoon />} />
        

          {/* CATCH-ALL REDIRECT: Sends all other paths to root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
      </main>
    </div>
  );
}

export default App;