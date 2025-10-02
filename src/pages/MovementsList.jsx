
import { useEffect, useState, useCallback } from 'react';
import { listMovements } from '../services/movements';
import { Link } from 'react-router-dom';
import VehicleSelect from '../components/VehicleSelect';
import { Button } from 'primereact/button';

// Formateador determinista (evita mismatches por locale/zone)
const fmtHN = new Intl.DateTimeFormat('es-HN', {
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit',
  hour12: false,
  timeZone: 'America/Tegucigalpa'
});

export default function MovementsList() {
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    vehicleId: '',
    driver: '',
    from: '',
    to: '',
  });

  const [data, setData] = useState({
    items: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });

  const load = useCallback(async () => {
    try {
      const p = { ...params };
      if (!p.vehicleId) delete p.vehicleId;
      if (!p.driver) delete p.driver;
      if (!p.from) delete p.from;
      if (!p.to) delete p.to;

      const res = await listMovements(p);
      setData({
        items: Array.isArray(res.items) ? res.items : [],
        total: Number(res.total ?? 0),
        page: Number(res.page ?? 1),
        pageSize: Number(res.pageSize ?? params.pageSize),
      });
    } catch (e) {
      console.error('Error listMovements:', e);
      alert('No se pudieron cargar los movimientos. Revisa la consola.');
      setData((d) => ({ ...d, items: [], total: 0 }));
    }
  }, [params]);

  useEffect(() => {
    load();
  }, [load]);

  const applyFilters = () => setParams((p) => ({ ...p, page: 1 }));
  const clearFilters = () =>
    setParams({ page: 1, pageSize: 10, vehicleId: '', driver: '', from: '', to: '' });

  const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));
  const atStart = params.page <= 1;
  const atEnd = params.page >= totalPages;

  const prevPage = () => setParams((p) => ({ ...p, page: Math.max(1, p.page - 1) }));
  const nextPage = () => setParams((p) => ({ ...p, page: p.page + 1 }));

  return (
    <div className="p-3">
      <div className="flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Movimientos</h2>
        <Link className="p-button" to="/movements/new">Nuevo</Link>
      </div>

      {/* Filtros */}
      <div className="grid surface-card border-round p-3 mb-3">
        <div className="col-12 md:col-3">
          <label>Vehículo</label>
          <VehicleSelect
            value={params.vehicleId}
            onChange={(v) => setParams((p) => ({ ...p, vehicleId: v || '', page: 1 }))}
          />
        </div>

        <div className="col-12 md:col-3">
          <label>Motorista</label>
          <input
            className="p-inputtext w-full"
            value={params.driver}
            onChange={(e) => setParams((p) => ({ ...p, driver: e.target.value, page: 1 }))}
            placeholder="Nombre del motorista"
          />
        </div>

        <div className="col-6 md:col-3">
          <label>Desde</label>
          <input
            type="date"
            className="p-inputtext w-full"
            value={params.from}
            onChange={(e) => setParams((p) => ({ ...p, from: e.target.value, page: 1 }))}
          />
        </div>

        <div className="col-6 md:col-3">
          <label>Hasta</label>
          <input
            type="date"
            className="p-inputtext w-full"
            value={params.to}
            onChange={(e) => setParams((p) => ({ ...p, to: e.target.value, page: 1 }))}
          />
        </div>

        <div className="col-12">
          <Button label="Aplicar filtros" onClick={applyFilters} />
          <Button className="p-button-text ml-2" label="Limpiar" onClick={clearFilters} />
        </div>
      </div>

      {/* Lista */}
      <div className="surface-card border-round p-3">
        {data.items.length > 0 ? (
          data.items.map((m) => {
            const when = fmtHN.format(new Date(m.dateTime));
            return (
              <div key={m.id} className="py-2 border-bottom-1 surface-border">
                <div className="flex justify-content-between">
                  <div>
                    <strong>{m.type}</strong> — {when}
                    <div className="text-700">
                      {m.vehicle?.plate} · {m.driverName} · {m.odometerKm} km
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No hay movimientos.</p>
        )}

        {/* Paginación */}
        <div className="flex justify-content-end align-items-center gap-2 mt-3">
          <Button label="«" disabled={atStart} onClick={prevPage} />
          <span>Página {data.page} de {totalPages}</span>
          <Button label="»" disabled={atEnd} onClick={nextPage} />
        </div>
      </div>
    </div>
  );
}

