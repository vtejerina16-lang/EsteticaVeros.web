"use server";

import { fetchJson } from "@/lib/http";
import { getAccessToken } from "@/lib/auth";
import { adaptAppointmentFromBackend } from "../_adapters/cita-adapter";
import type { ListCitasParams, ListCitasResult, Cita } from "../_types";

/**
 * 🔹 Listar citas con paginación
 * CORRECCIÓN: Uso de URLSearchParams más limpio y manejo de tipos.
 */
export async function listCitas(params: ListCitasParams): Promise<ListCitasResult> {
  try {
    const token = await getAccessToken();
    const query = new URLSearchParams();

    // 🚩 Forzamos la lectura de los filtros
    if (params.search) query.append("search", params.search);
    
    // Si status es "all" o undefined, no lo mandamos para que el backend mande todo
    if (params.status && params.status !== "all") {
      query.append("status", params.status);
    }
    
    // Paginación (usando ambos estilos por seguridad)
    const p = params.page || 1;
    const pp = params.perPage || (params as any).per_page || 10;
    
    query.append("page", p.toString());
    query.append("perPage", pp.toString());

    const res = await fetchJson<any>(`/api/appointments?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const rawItems = res.appointments || res.items || (Array.isArray(res) ? res : []);
    
    const items = rawItems.filter((i: any) => i !== null).map(adaptAppointmentFromBackend);

    return {
      items,
      totalCount: res.totalCount || items.length,
      page: Number(p),
      perPage: Number(pp),
      totalPages: res.totalPages || 1
    };
  } catch {
    return { items: [], totalCount: 0, page: 1, perPage: 10, totalPages: 0 };
  }
}

/**
 * 🔹 Listar citas para el Calendario (Sin paginación)
 * CORRECCIÓN: Ahora sí acepta y aplica filtros de búsqueda/estado en el calendario.
 */
export async function listCitasRange(params: { search?: string; status?: string }): Promise<Cita[]> {
  try {
    const token = await getAccessToken();
    const query = new URLSearchParams();
    if (params.search) query.append("search", params.search);
    if (params.status && params.status !== "all") query.append("status", params.status);

    const res = await fetchJson<any>(`/api/appointments?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const rawItems = res.appointments || res.items || (Array.isArray(res) ? res : []);
    return rawItems.filter((i: any) => i !== null).map(adaptAppointmentFromBackend);
  } catch (error) {
    console.error("Error en listCitasRange:", error);
    return [];
  }
}

/**
 * 🔹 Listar Clientes
 */
export async function getClientes() {
  try {
    const token = await getAccessToken();
    const res = await fetchJson<any>("/api/customers", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = res.customers || (Array.isArray(res) ? res : []);
    return data.map((c: any) => ({
      id: c.id.toString(),
      name: c.fullName || c.name,
      phone: c.phoneNumber
    }));
  } catch {
    return [];
  }
}

/**
 * 🔹 Listar Servicios
 */
export async function getServicios() {
  try {
    const token = await getAccessToken();
    const res = await fetchJson<any>("/api/services", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = res.services || (Array.isArray(res) ? res : []);
    return data.map((s: any) => ({
      id: s.id.toString(),
      name: s.name,
      durationMin: s.duration
    }));
  } catch {
    return [];
  }
}

/**
 * 🔹 Listar Usuarios/Encargados
 */
export async function getUsuariosEncargados() {
  try {
    const token = await getAccessToken();
    const res = await fetchJson<any>("/api/users", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = res.users || res.items || (Array.isArray(res) ? res : []);

    const usuariosPermitidos = data.filter((u: any) => {
      const roleValue = [
        u?.roleName,
        u?.role,
        u?.rol,
        u?.userRole,
        u?.roles?.[0],
      ].find((value): value is string => typeof value === "string" && value.trim() !== "");

      if (!roleValue) return false;

      const role = roleValue.toLowerCase();
      return (
        role.includes("manager") ||
        role.includes("encargado") ||
        role.includes("assistant") ||
        role.includes("asistente") ||
        role.includes("receptionist") ||
        role.includes("recepcion") ||
        role.includes("specialist") ||
        role.includes("personal")
      );
    });

    return usuariosPermitidos.map((u: any) => ({
      id: u.id.toString(),
      name: u.fullName || u.name,
    }));
  } catch (error) {
    return [];
  }
}

/**
 * 🔹 Obtener una cita por su ID
 */
export async function getCitaById(id: string): Promise<Cita | null> {
  try {
    const token = await getAccessToken();
    const res = await fetchJson<any>(`/api/appointments/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return adaptAppointmentFromBackend(res);
  } catch (error) {
    console.error(`Error al obtener la cita ${id}:`, error);
    return null;
  }
}
