export const esCorreoValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const sanitizePhone = (value) => value.replace(/\D/g, '');

export const passwordsMatch = (password, confirmPassword) => password === confirmPassword;

export const isValidPassword = (password) => password.length >= 6;

export const calcularPromedioAsistencias = (chartData) => {
  return chartData.length > 0
    ? Math.round(
        chartData.reduce((acc, d) => acc + (Number(d.asistencias) || 0), 0) /
        chartData.length
      )
    : 0;
};

export const calcularTotalPendiente = (pagos) => {
  return pagos.reduce((acc, p) => acc + Number(p.monto || 0), 0);
};

export const calcularTotalAtrasado = (pagos) => {
  return pagos.reduce((acc, p) => acc + Number(p.monto || 0), 0);
};
