const ClasesModel = require('../models/clases.model');
jest.mock('../models/clases.model');

const {
  createClase, getClases, getClaseById,
  updateClase, deleteClase, getClasesPorInstructor
} = require('../controllers/clases.controller');

const mkReq = (body, params) => ({ body: body || {}, params: params || {} });
const mkRes = () => {
  const r = {};
  r.status = jest.fn().mockReturnValue(r);
  r.json = jest.fn().mockReturnValue(r);
  return r;
};

describe('Clases Controller', () => {

  beforeEach(() => { jest.clearAllMocks(); });

  // ===== GET ALL =====
  describe('getClases()', () => {
    test('retorna todas las clases', async () => {
      ClasesModel.obtenerClases.mockResolvedValue([{ id: 1, nombre: 'Spinning' }]);
      const res = mkRes();
      await getClases(mkReq(), res);
      expect(res.json).toHaveBeenCalledWith([{ id: 1, nombre: 'Spinning' }]);
    });

    test('500 si falla', async () => {
      ClasesModel.obtenerClases.mockRejectedValue(new Error('fail'));
      const res = mkRes();
      await getClases(mkReq(), res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ===== GET BY ID =====
  describe('getClaseById()', () => {
    test('retorna clase si existe', async () => {
      ClasesModel.obtenerClasePorId.mockResolvedValue({ id: 1 });
      const res = mkRes();
      await getClaseById(mkReq({}, { id: 1 }), res);
      expect(res.json).toHaveBeenCalledWith({ id: 1 });
    });

    test('404 si no existe', async () => {
      ClasesModel.obtenerClasePorId.mockResolvedValue(null);
      const res = mkRes();
      await getClaseById(mkReq({}, { id: 99 }), res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  // ===== CREATE =====
  describe('createClase()', () => {
    test('400 si faltan datos obligatorios', async () => {
      const res = mkRes();
      await createClase(mkReq({ nombre: 'Spinning' }), res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('409 si hay conflicto de horario', async () => {
      ClasesModel.existeCruceHorario.mockResolvedValue({
        nombre_clase: 'Yoga', dia_semana: 'Lunes',
        hora_inicio: '10:00', hora_fin: '11:00'
      });
      const res = mkRes();
      await createClase(mkReq({
        nombre: 'Spinning', id_entrenador: 1,
        dias: ['Lunes'], hora_inicio: '10:00', hora_fin: '11:00'
      }), res);
      expect(res.status).toHaveBeenCalledWith(409);
    });

    test('201 si no hay conflicto y se crea', async () => {
      ClasesModel.existeCruceHorario.mockResolvedValue(null);
      ClasesModel.crearClase.mockResolvedValue(10);
      ClasesModel.crearHorario.mockResolvedValue();
      const res = mkRes();
      await createClase(mkReq({
        nombre: 'Spinning', id_entrenador: 1,
        dias: ['Lunes', 'Miercoles'],
        hora_inicio: '10:00', hora_fin: '11:00', cupos: 20
      }), res);
      expect(ClasesModel.crearHorario).toHaveBeenCalledTimes(2);
      expect(res.json).toHaveBeenCalledWith({ mensaje: expect.stringMatching(/creados/i) });
    });
  });

  // ===== UPDATE =====
  describe('updateClase()', () => {
    test('404 si la clase no existe', async () => {
      ClasesModel.obtenerClasePorId.mockResolvedValue(null);
      const res = mkRes();
      await updateClase(mkReq({ nombre: 'Yoga' }, { id: 99 }), res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    test('200 actualiza clase sin horarios', async () => {
      ClasesModel.obtenerClasePorId.mockResolvedValue({ id: 1 });
      ClasesModel.actualizarClase.mockResolvedValue();
      const res = mkRes();
      await updateClase(mkReq({ nombre: 'Yoga' }, { id: 1 }), res);
      expect(res.json).toHaveBeenCalled();
    });

    test('200 actualiza con horarios si se envian dias', async () => {
      ClasesModel.obtenerClasePorId.mockResolvedValue({ id: 1 });
      ClasesModel.existeCruceHorario.mockResolvedValue(null);
      ClasesModel.eliminarHorariosPorClase.mockResolvedValue();
      ClasesModel.crearHorario.mockResolvedValue();
      const res = mkRes();
      await updateClase(mkReq({
        nombre: 'Spinning', id_entrenador: 1,
        dias: ['Lunes'], hora_inicio: '10:00', hora_fin: '11:00', cupos: 20
      }, { id: 1 }), res);
      expect(ClasesModel.eliminarHorariosPorClase).toHaveBeenCalled();
    });
  });

  // ===== DELETE =====
  describe('deleteClase()', () => {
    test('200 elimina clase existente', async () => {
      ClasesModel.eliminarClase.mockResolvedValue(1);
      const res = mkRes();
      await deleteClase(mkReq({}, { id: 1 }), res);
      expect(res.json).toHaveBeenCalledWith({ mensaje: expect.any(String) });
    });

    test('404 si no existe', async () => {
      ClasesModel.eliminarClase.mockResolvedValue(0);
      const res = mkRes();
      await deleteClase(mkReq({}, { id: 99 }), res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  // ===== GET BY INSTRUCTOR =====
  describe('getClasesPorInstructor()', () => {
    test('retorna clases del instructor', async () => {
      ClasesModel.obtenerClasesPorInstructor.mockResolvedValue([{ id: 1, nombre: 'Zumba' }]);
      const res = mkRes();
      await getClasesPorInstructor(mkReq({}, { id_entrenador: 2 }), res);
      expect(res.json).toHaveBeenCalledWith([{ id: 1, nombre: 'Zumba' }]);
    });
  });

});
