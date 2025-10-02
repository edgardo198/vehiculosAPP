import { useEffect, useState } from 'react';
import { listVehicles, deleteVehicle } from '../services/vehicles';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from 'primereact/button';

export default function VehiclesList(){
  const [items,setItems]=useState([]);
  const [loading,setLoading]=useState(true);
  const nav = useNavigate();

  const load = async ()=> {
    setLoading(true);
    try { setItems(await listVehicles()); }
    finally { setLoading(false); }
  };
  useEffect(()=>{ load(); },[]);

  const onDelete = async (id) => {
    if(!confirm('¿Eliminar vehículo?')) return;
    await deleteVehicle(id);
    await load();
  };

  return (
    <div className="p-3">
      <div className="flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Vehículos</h2>
        <Button label="Nuevo" icon="pi pi-plus" onClick={()=>nav('/vehicles/new')} />
      </div>
      {loading ? <p>Cargando…</p> : (
        <div className="grid">
          {items.map(v=>(
            <div key={v.id} className="col-12 md:col-6 lg:col-4">
              <div className="p-3 surface-card border-round shadow-2">
                <div className="text-xl font-bold">{v.brand} {v.model}</div>
                <div className="text-700 mb-3">Placa: {v.plate}</div>
                <div className="flex gap-2">
                  <Link className="p-button p-button-text" to={`/vehicles/${v.id}`}>Editar</Link>
                  <Button className="p-button-text p-button-danger" label="Eliminar" onClick={()=>onDelete(v.id)} />
                </div>
              </div>
            </div>
          ))}
          {items.length===0 && <p>No hay vehículos.</p>}
        </div>
      )}
    </div>
  );
}
