import type { BackendUserDto, ProfileVM } from "../_types/profile-types";

export function toProfileVM(dto: BackendUserDto): ProfileVM {
  return {
    id: String(dto.id),
    firstName: dto.firstName ?? "",
    lastName: dto.lastName ?? "",
    fullName: dto.fullName ?? "Usuario",
    email: dto.email ?? "",
    phoneNumber: dto.phoneNumber ?? "",
    address: dto.address ?? "",
    dateOfBirth: dto.dateOfBirth ? dto.dateOfBirth.split("T")[0] : "",
    // Mapeamos roleName o role al VM
    roleName: dto.roleName || dto.role || "Usuario",
    isActive: dto.isActive ?? true,
  };
}