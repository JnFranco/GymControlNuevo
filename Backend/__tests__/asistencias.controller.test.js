const AsistenciasModel = require('../models/asistencias.model');
jest.mock('../models/asistencias.model');

const {
  getAsistencias, getAsistenciaById,
  createAsistencia, updateAsistencia, deleteAsistencia
} = require('../controllers/asistencias.controller');

const mkReq = (body, params) => ({ body: body || {}, params: params || {} });
const mkRes = () => {
  const r = {};
  r.status = jest.fn().mockReturnValue(r);
  r.json = jest.fn().mockReturnValue(r);
  return r;
};

describe('Asistencias Controller', () => {

  beforeEach(() => { jest.clearAllMocks(); });

  describe('getAsistencias()', () => {
    test('retorna todas las asistencias', async () => {
      AsistenciasModel.obtenerAsistencias.mockResolvedValue([{ id: 1, usuario: 'Juan', presente: 1 }]);
      const res = mkRes();
      await getAsistencias(mkReq(), res);
      expect(res.json).toHaveBeenCalledWith([{ id: 1, usuario: 'Juan', presente: 1 }]);
    });

    test('500 si falla la consulta', async () => {
      AsistenciasModel.obtenerAsistencias.mockRejectedValue(new Error('DB fail'));
      const res = mkRes();
      await getAsistencias(mkReq(), res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getAsistenciaById()', () => {
    test('retorna asistencia si existe', async () => {
      AsistenciasModel.obtenerAsistenciaPorId.mockResolvedValue({ id: 1, presente: 1 });
      const res = mkRes();
      await getAsistenciaById(mkReq({}, { id: 1 }), res);
      expect(res.json).toHaveBeenCalledWith({ id: 1, presente: 1 });
    });

    test('404 si no existe', async () => {
      AsistenciasModel.obtenerAsistenciaPorId.mockResolvedValue(null);
      const res = mkRes();
      await getAsistenciaById(mkReq({}, { id: 99 }), res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('createAsistencia()', () => {
    test('400 si falta id_reserva', async () => {
      const res = mkRes();
      await createAsistencia(mkReq({ presente: 1 }), res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('201 registra asistencia sin fecha (usa CURRENT_DATE)', async () => {
      AsistenciasModel.registrarAsistencia.mockResolvedValue(10);
      const res = mkRes();
      await createAsistencia(mkReq({ id_reserva: 5, presente: 1 }), res);
      expect(AsistenciasModel.registrarAsistencia).toHaveBeenCalledWith({ id_reserva: 5, presente: 1 });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('201 registra asistencia con fecha personalizada', async () => {
      AsistenciasModel.registrarAsistencia.mockResolvedValue(11);
      const res = mkRes();
      await createAsistencia(mkReq({ id_reserva: 5, presente: 1, fecha_asistencia: '2026-06-01' }), res);
      expect(AsistenciasModel.registrarAsistencia).toHaveBeenCalledWith({
        id_reserva: 5, presente: 1, fecha_asistencia: '2026-06-01'
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('500 si falla el modelo', async () => {
      AsistenciasModel.registrarAsistencia.mockRejectedValue(new Error('fail'));
      const res = mkRes();
      await createAsistencia(mkReq({ id_reserva: 5, presente: 1 }), res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('updateAsistencia()', () => {
    test('200 actualiza asistencia existente', async () => {
      AsistenciasModel.actualizarAsistencia.mockResolvedValue(1);
      const res = mkRes();
      await updateAsistencia(mkReq({ presente: 0 }, { id: 1 }), res);
      expect(res.json).toHaveBeenCalledWith({ mensaje: expect.any(String) });
    });

    test('404 si no existe', async () => {
      AsistenciasModel.actualizarAsistencia.mockResolvedValue(0);
      const res = mkRes();
      await updateAsistencia(mkReq({ presente: 0 }, { id: 99 }), res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('deleteAsistencia()', () => {
    test('200 elimina asistencia existente', async () => {
      AsistenciasModel.eliminarAsistencia = jest.fn().mockResolvedValue(1);
      const res = mkRes();
      await deleteAsistencia(mkReq({}, { id: 1 }), res);
      expect(res.json).toHaveBeenCalledWith({ mensaje: expect.any(String) });
    });

    test('404 si no existe', async () => {
      AsistenciasModel.eliminarAsistencia = jest.fn().mockResolvedValue(0);
      const res = mkRes();
      await deleteAsistencia(mkReq({}, { id: 99 }), res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

});
