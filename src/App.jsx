import Administrador from "./Pages/Administrador/Administrador.jsx";
import { HashRouter } from 'react-router-dom';
import AppProvider from './context/AppProvider';

function App() {
  return <HashRouter><AppProvider><Administrador /></AppProvider></HashRouter>;
}

export default App;
