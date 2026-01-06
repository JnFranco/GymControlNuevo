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
================================ /*
/*export const getPagosPendientes = async () => {
  const res = await api.get("/pagos/pendientes");
  return res.data;
};/*

/* ===============================
   COBRAR PAGO
================================ */
export const cobrarPago = async (pagoId) => {
  return api.post(`/admin/pagos/cobrar/${pagoId}`);
};


/* ===============================
   ASISTENCIAS (GRÁFICA)
================================ */
export const getAsistenciasSemana = async () => {
  const res = await api.get("/admin/asistencias-semana");
  return res.data;
};

/* ===============================
  PAgos  ()
================================ */
export const getPagosPendientesAdmin = async () => {
  const res = await api.get('/admin/pagos/pendientes');
  return res.data;
};

export const getPagosAtrasadosAdmin = async () => {
  const res = await api.get('/admin/pagos/atrasados');
  return res.data;
};
