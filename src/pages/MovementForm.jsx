import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import VehicleSelect from '../components/VehicleSelect';
import { createMovement } from '../services/movements';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

const schema = z.object({
  vehicleId: z.coerce.number().int().positive(),
  driverName: z.string().min(1),
  type: z.enum(['ENTRY','EXIT']),
  dateTime: z.string().min(1),
  odometerKm: z.coerce.number().int().nonnegative()
});

export default function MovementForm(){
  const nav = useNavigate();
  const { register, handleSubmit, setValue, watch, formState:{ errors, isSubmitting } } =
    useForm({ resolver: zodResolver(schema), defaultValues:{ type:'ENTRY' } });

  const onSubmit = async (data)=>{
    await createMovement(data);
    nav('/movements');
  };

  return (
    <div className="p-3">
      <h2>Nuevo movimiento</h2>
      <form className="grid" onSubmit={handleSubmit(onSubmit)}>
        <div className="col-12 md:col-4">
          <label>Vehículo</label>
          <VehicleSelect value={watch('vehicleId')} onChange={(v)=>setValue('vehicleId', v)}/>
          {errors.vehicleId && <small className="text-red-500">{errors.vehicleId.message}</small>}
        </div>
        <div className="col-12 md:col-4">
          <label>Motorista</label>
          <input className="p-inputtext w-full" {...register('driverName')}/>
          {errors.driverName && <small className="text-red-500">{errors.driverName.message}</small>}
        </div>
        <div className="col-6 md:col-2">
          <label>Tipo</label>
          <select className="p-inputtext w-full" {...register('type')}>
            <option value="ENTRY">Entrada</option>
            <option value="EXIT">Salida</option>
          </select>
        </div>
        <div className="col-6 md:col-2">
          <label>Fecha y hora</label>
          <input type="datetime-local" className="p-inputtext w-full" {...register('dateTime')}/>
          {errors.dateTime && <small className="text-red-500">{errors.dateTime.message}</small>}
        </div>
        <div className="col-12 md:col-3">
          <label>Odómetro (km)</label>
          <input type="number" className="p-inputtext w-full" {...register('odometerKm')}/>
          {errors.odometerKm && <small className="text-red-500">{errors.odometerKm.message}</small>}
        </div>
        <div className="col-12">
          <Button type="submit" label="Guardar" loading={isSubmitting}/>
          <Button type="button" className="p-button-text ml-2" label="Cancelar" onClick={()=>nav('/movements')}/>
        </div>
      </form>
    </div>
  );
}
