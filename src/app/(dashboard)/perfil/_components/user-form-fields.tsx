import type { ProfileVM, UpdateProfileActionState } from "../_types/profile-types";

interface Props {
  vm: ProfileVM;
  state: UpdateProfileActionState;
}

export function UserFormFields({ vm, state }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1">
        <label className="text-sm font-semibold text-neutral-800">Nombre</label>
        <input
          name="firstName"
          defaultValue={vm.firstName}
          className={`input ${state.fieldErrors?.firstName ? 'border-red-500' : ''}`}
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-neutral-800">Apellido</label>
        <input
          name="lastName"
          defaultValue={vm.lastName}
          className={`input ${state.fieldErrors?.lastName ? 'border-red-500' : ''}`}
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-neutral-800">Teléfono</label>
        <input
          name="phoneNumber"
          defaultValue={vm.phoneNumber ?? ""}
          className="input"
        />
      </div>
      <div className="space-y-1 md:col-span-2">
        <label className="text-sm font-semibold text-neutral-800">Dirección</label>
        <input
          name="address"
          defaultValue={vm.address ?? ""}
          placeholder="Tu dirección completa"
          className="input"
        />
      </div>
    </div>
  );
}