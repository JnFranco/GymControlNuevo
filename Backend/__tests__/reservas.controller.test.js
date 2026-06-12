const ReservasModel = require('../models/reservas.model');
jest.mock('../models/reservas.model');

const {
  createReserva, getReservas, getReservaById, deleteReserva
} = require('../controllers/reservas.controller');

const mkReq = (body, params) => ({ body: body || {}, params: params || {} });
const mkRes = () => {
  const r = {};
  r.status = jest.fn().mockReturnValue(r);
  r.json = jest.fn().mockReturnValue(r);
  return r;
};

describe('Reservas Controller', () => {

  beforeEach(() => { jest.clearAllMocks(); });

  // ===== GET ALL =====
  describe('getReservas()', () => {
    test('retorna todas las reservas', async () => {
      ReservasModel.obtenerReservas.mockResolvedValue([{ id: 1, usuario: 'Juan' }]);
      const res = mkRes();
      await getReservas(mkReq(), res);
      expect(res.json).toHaveBeenCalledWith([{ id: 1, usuario: 'Juan' }]);
    });

    test('500 si falla', async () => {
      ReservasModel.obtenerReservas.mockRejectedValue(new Error('fail'));
      const res = mkRes();
      await getReservas(mkReq(), res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ===== GET BY ID =====
  describe('getReservaById()', () => {
    test('retorna reserva si existe', async () => {
      ReservasModel.obtenerReservaPorId.mockResolvedValue({ id: 1 });
      const res = mkRes();
      await getReservaById(mkReq({}, { id: 1 }), res);
      expect(res.json).toHaveBeenCalledWith({ id: 1 });
    });

    test('404 si no existe', async () => {
      ReservasModel.obtenerReservaPorId.mockResolvedValue(null);
      const res = mkRes();
      await getReservaById(mkReq({}, { id: 99 }), res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  // ===== CREATE =====
  describe('createReserva()', () => {
    test('400 si faltan campos', async () => {
      const res = mkRes();
      await createReserva(mkReq({ id_usuario: 1 }), res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('201 si se crea correctamente', async () => {
      ReservasModel.crearReserva.mockResolvedValue(42);
      const res = mkRes();
      await createReserva(mkReq({ id_usuario: 1, id_horario: 5 }), res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 42 }));
    });

    test('400 si el modelo lanza error (cupo lleno)', async () => {
      ReservasModel.crearReserva.mockRejectedValue(new Error('No hay cupos'));
      const res = mkRes();
      await createReserva(mkReq({ id_usuario: 1, id_horario: 5 }), res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  // ===== DELETE =====
  describe('deleteReserva()', () => {
    test('200 elimina reserva existente', async () => {
      ReservasModel.eliminarReserva.mockResolvedValue(1);
      const res = mkRes();
      await deleteReserva(mkReq({}, { id: 1 }), res);
      expect(res.json).toHaveBeenCalledWith({ mensaje: expect.any(String) });
    });

    test('404 si no existe', async () => {
      ReservasModel.eliminarReserva.mockResolvedValue(0);
      const res = mkRes();
      await deleteReserva(mkReq({}, { id: 99 }), res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

});
