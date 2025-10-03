import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom'
import VehiclesList from './pages/VehiclesList.jsx'
import VehicleForm from './pages/VehicleForm.jsx'
import MovementsList from './pages/MovementsList.jsx'
import MovementForm from './pages/MovementForm.jsx'

function Nav() {
  const loc = useLocation()
  const isActive = (path) => loc.pathname.startsWith(path)

  return (
    <nav className="p-3 surface-100 flex gap-3">
      <NavLink
        to="/vehicles"
        style={() => (isActive('/vehicles') ? { fontWeight: '700' } : undefined)}
      >
        Vehículos
      </NavLink>
      <NavLink
        to="/movements"
        style={() => (isActive('/movements') ? { fontWeight: '700' } : undefined)}
      >
        Movimientos
      </NavLink>
    </nav>
  )
}

export default function App() {
  return (
    <div className="p-3">
      <Nav />
      <Routes>
        {/* Home muestra el listado de vehículos como antes */}
        <Route path="/" element={<VehiclesList />} />

        {/* Vehículos */}
        <Route path="/vehicles" element={<VehiclesList />} />
        <Route path="/vehicles/new" element={<VehicleForm />} />
        <Route path="/vehicles/:id" element={<VehicleForm />} />

        {/* Movimientos */}
        <Route path="/movements" element={<MovementsList />} />
        <Route path="/movements/new" element={<MovementForm />} />

        {/* Ruta desconocida -> redirige a /vehicles */}
        <Route path="*" element={<Navigate to="/vehicles" replace />} />
      </Routes>
    </div>
  )
}
