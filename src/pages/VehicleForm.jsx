import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createVehicle, getVehicle, updateVehicle } from '../services/vehicles';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'primereact/button';

const schema = z.object({
  brand: z.string().min(1, 'Requerido'),
  model: z.string().min(1, 'Requerido'),
  plate: z.string().min(1, 'Requerido'),
});

export default function VehicleForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    // Evita uncontrolled en el primer render (antes de cargar datos)
    defaultValues: { brand: '', model: '', plate: '' },
  });

  useEffect(() => {
    let active = true;

    (async () => {
      if (!isEdit) {
        if (active) reset({ brand: '', model: '', plate: '' });
        return;
      }
      try {
        const v = await getVehicle(id);
        if (active && v) {
          reset({ brand: v.brand ?? '', model: v.model ?? '', plate: v.plate ?? '' });
        }
      } catch (e) {
        console.error('Error getVehicle:', e);
        if (active) {
          alert('No se pudo cargar el vehículo. Intenta de nuevo.');
        }
      }
    })();

    return () => { active = false; };
  }, [id, isEdit, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await updateVehicle(id, data);
      } else {
        await createVehicle(data);
      }
      nav('/vehicles');
    } catch (e) {
      console.error('Error al guardar vehículo:', e);
      alert('No se pudo guardar el vehículo. Revisa la consola.');
    }
  };

  return (
    <div className="p-3">
      <h2>{isEdit ? 'Editar vehículo' : 'Nuevo vehículo'}</h2>

      <form className="grid" onSubmit={handleSubmit(onSubmit)}>
        <div className="col-12 md:col-4">
          <label>Marca</label>
          <input
            className="p-inputtext w-full"
            {...register('brand')}
            aria-invalid={!!errors.brand}
          />
          {errors.brand && <small className="text-red-500">{errors.brand.message}</small>}
        </div>

        <div className="col-12 md:col-4">
          <label>Modelo</label>
          <input
            className="p-inputtext w-full"
            {...register('model')}
            aria-invalid={!!errors.model}
          />
          {errors.model && <small className="text-red-500">{errors.model.message}</small>}
        </div>

        <div className="col-12 md:col-4">
          <label>Placa</label>
          <input
            className="p-inputtext w-full"
            {...register('plate')}
            aria-invalid={!!errors.plate}
          />
          {errors.plate && <small className="text-red-500">{errors.plate.message}</small>}
        </div>

        <div className="col-12">
          <Button
            type="submit"
            label={isEdit ? 'Guardar cambios' : 'Crear'}
            loading={isSubmitting}
            disabled={isSubmitting}
          />
          <Button
            type="button"
            className="p-button-text ml-2"
            label="Cancelar"
            onClick={() => nav('/vehicles')}
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}

