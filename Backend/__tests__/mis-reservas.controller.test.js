const db = require('../db/connection');
jest.mock('../db/connection');

const ReservasModel = require('../models/reservas.model');
jest.mock('../models/reservas.model');

const {
  getMisReservas, createMiReserva, deleteMiReserva
} = require('../controllers/mis-reservas.controller');

const mkReq = (body, params, query, user) => ({
  body: body || {},
  params: params || {},
  query: query || {},
  user: user || { correo: 'test@test.com' }
});
const mkRes = () => {
  const r = {};
  r.status = jest.fn().mockReturnValue(r);
  r.json = jest.fn().mockReturnValue(r);
  return r;
};

describe('Mis Reservas Controller', () => {

  beforeEach(() => { jest.clearAllMocks(); });

  describe('getMisReservas()', () => {
    test('400 si falta correo', async () => {
      const res = mkRes();
      await getMisReservas(mkReq({}, {}, {}), res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('retorna reservas del usuario', async () => {
      db.execute.mockResolvedValue([[{ id: 1, clase: 'Spinning' }]]);
      const res = mkRes();
      await getMisReservas(mkReq({}, {}, { correo: 'test@test.com' }), res);
      expect(res.json).toHaveBeenCalledWith([{ id: 1, clase: 'Spinning' }]);
    });
  });

  describe('createMiReserva()', () => {
    test('400 si falta id_horario', async () => {
      const res = mkRes();
      await createMiReserva(mkReq({}), res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('201 crea reserva exitosamente', async () => {
      db.execute
        .mockResolvedValueOnce([[{ id: 1 }]])
        .mockResolvedValueOnce([{}]);
      ReservasModel.crearReserva.mockResolvedValue(42);
      const res = mkRes();
      await createMiReserva(mkReq({ id_horario: 5 }), res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 42 }));
    });
  });

  describe('deleteMiReserva()', () => {
    test('200 elimina reserva propia', async () => {
      db.execute.mockResolvedValue([{ affectedRows: 1 }]);
      const res = mkRes();
      await deleteMiReserva(mkReq({}, { id: '1' }, {}, { correo: 'test@test.com' }), res);
      expect(res.json).toHaveBeenCalledWith({ mensaje: expect.any(String) });
    });

    test('404 si la reserva no pertenece al usuario', async () => {
      db.execute.mockResolvedValue([{ affectedRows: 0 }]);
      const res = mkRes();
      await deleteMiReserva(mkReq({}, { id: '99' }, {}, { correo: 'test@test.com' }), res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

});
