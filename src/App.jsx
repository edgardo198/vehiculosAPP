import { Routes, Route, Link, useLocation } from 'react-router-dom';
import VehiclesList from './pages/VehiclesList.jsx';
import VehicleForm from './pages/VehicleForm.jsx';
import MovementsList from './pages/MovementsList.jsx';
import MovementForm from './pages/MovementForm.jsx';

function Nav(){
  const loc = useLocation();
  const active = (p) => loc.pathname.startsWith(p) ? { fontWeight:'700' } : {};
  return (
    <div className="p-3 surface-100 flex gap-3">
      <Link style={active('/vehicles')} to="/vehicles">Vehículos</Link>
      <Link style={active('/movements')} to="/movements">Movimientos</Link>
    </div>
  );
}

export default function App(){
  return (
    <div className="p-3">
      <Nav/>
      <Routes>
        <Route path="/" element={<VehiclesList/>} />
        <Route path="/vehicles" element={<VehiclesList/>} />
        <Route path="/vehicles/new" element={<VehicleForm/>} />
        <Route path="/vehicles/:id" element={<VehicleForm/>} />
        <Route path="/movements" element={<MovementsList/>} />
        <Route path="/movements/new" element={<MovementForm/>} />
      </Routes>
    </div>
  );
}

