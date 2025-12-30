import api from "../api/axios";

/* ===============================
   DASHBOARD - ESTADÍSTICAS GENERALES
================================ */
export const getAdminStats = async () => {
  const res = await api.get("/admin/stats");
  return res.data;
};

/* ===============================
   PAGOS PENDIENTES
================================ */
export const getPagosPendientes = async () => {
  const res = await api.get("/pagos/pendientes");
  return res.data;
};

/* ===============================
   COBRAR PAGO
================================ */
export const cobrarPago = async (pagoId) => {
  const res = await api.post(`/pagos/cobrar/${pagoId}`);
  return res.data;
};

/* ===============================
   ASISTENCIAS (GRÁFICA)
================================ */
export const getAsistenciasSemana = async () => {
  const res = await api.get("/admin/asistencias-semana");
  return res.data;
};
