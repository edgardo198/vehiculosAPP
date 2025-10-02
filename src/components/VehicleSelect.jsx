import { useEffect, useState } from 'react';
import { listVehicles } from '../services/vehicles';

export default function VehicleSelect({ value, onChange }){
  const [opts,setOpts]=useState([]);
  useEffect(()=>{ listVehicles().then(setOpts); },[]);
  return (
    <select className="p-inputtext" value={value ?? ''} onChange={e=>onChange?.(Number(e.target.value)||'')}>
      <option value="">-- Vehículo --</option>
      {opts.map(v => (
        <option key={v.id} value={v.id}>{v.plate} - {v.brand} {v.model}</option>
      ))}
    </select>
  );
}
