import { useEffect, useState, useRef } from 'react';
import { listVehicles } from '../services/vehicles';

/**
 * Props:
 *  - value: number | null
 *  - onChange: (id: number | null) => void
 *  - className?: string
 */
export default function VehicleSelect({ value, onChange, className }) {
  const [opts, setOpts] = useState([]);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    (async () => {
      try {
        const data = await listVehicles();
        if (!alive.current) return;
        setOpts(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('VehicleSelect listVehicles error:', e);
        if (alive.current) setOpts([]);
      }
    })();
    return () => { alive.current = false; };
  }, []);

  const handleChange = (e) => {
    const raw = e.target.value;
    const newVal = raw === '' ? null : Number(raw);
    // evita bucles: sólo notifica si el valor realmente cambió
    const current = value ?? null;
    if (newVal !== current) onChange?.(newVal);
  };

  return (
    <select
      className={`p-inputtext ${className ?? ''}`}
      value={value ?? ''}      // '' = sin selección visual
      onChange={handleChange}
    >
      <option value="">-- Vehículo --</option>
      {opts.map(v => (
        <option key={v.id} value={v.id}>
          {v.plate} - {v.brand} {v.model}
        </option>
      ))}
    </select>
  );
}
