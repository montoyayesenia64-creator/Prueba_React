import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OperarioDashboard from "./Pages/Operario/Operario.jsx";
function App() {
  return (
    <Router>
      <Routes>
        {/* Aquí defines la ruta donde se verá tu dashboard */}
        <Route path="/operario" element={<OperarioDashboard />} />
        
        {/* Si quieres que sea la página principal al abrir la app: */}
        <Route path="/" element={<OperarioDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;






