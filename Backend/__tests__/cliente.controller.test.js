const db = require('../db/connection');
jest.mock('../db/connection');

const ReservasModel = require('../models/reservas.model');
jest.mock('../models/reservas.model');

const {
  obtenerClasesDisponibles, reservarClase, cancelarReserva,
  obtenerClases_cli, reservarClase_cli, cancelarReserva_cli
} = require('../controllers/cliente.controller');

const mkReq = (body, params, usuario) => ({
  body: body || {},
  params: params || {},
  query: {},
  usuario: usuario || { id: 1 }
});
const mkRes = () => {
  const r = {};
  r.status = jest.fn().mockReturnValue(r);
  r.json = jest.fn().mockReturnValue(r);
  return r;
};

describe('Cliente Controller', () => {

  beforeEach(() => { jest.clearAllMocks(); });

  describe('obtenerClasesDisponibles()', () => {
    test('retorna clases con cupos disponibles', async () => {
      const mockClases = [
        { horario_id: 1, clase_nombre: 'Spinning', cupos_disponibles: 10, reservado: 0 }
      ];
      db.query.mockResolvedValue([mockClases]);
      const res = mkRes();
      await obtenerClasesDisponibles(mkReq({}, {}, { id: 1 }), res);
      expect(res.json).toHaveBeenCalledWith(mockClases);
    });

    test('500 si falla la consulta', async () => {
      db.query.mockRejectedValue(new Error('DB fail'));
      const res = mkRes();
      await obtenerClasesDisponibles(mkReq({}, {}, { id: 1 }), res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('reservarClase()', () => {
    test('reserva una clase exitosamente', async () => {
      ReservasModel.crearReserva.mockResolvedValue(42);
      const res = mkRes();
      await reservarClase(mkReq({ idHorario: 5 }, {}, { id: 1 }), res);
      expect(ReservasModel.crearReserva).toHaveBeenCalledWith(1, 5);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 42 }));
    });

    test('400 si falla la reserva (cupos, cruce, etc)', async () => {
      ReservasModel.crearReserva.mockRejectedValue(new Error('No hay cupos'));
      const res = mkRes();
      await reservarClase(mkReq({ idHorario: 5 }, {}, { id: 1 }), res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('cancelarReserva()', () => {
    test('cancela reserva exitosamente', async () => {
      ReservasModel.cancelarReserva.mockResolvedValue(1);
      const res = mkRes();
      await cancelarReserva(mkReq({}, { idHorario: 5 }, { id: 1 }), res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Reserva cancelada' });
    });

    test('404 si no encuentra la reserva', async () => {
      ReservasModel.cancelarReserva.mockResolvedValue(0);
      const res = mkRes();
      await cancelarReserva(mkReq({}, { idHorario: 99 }, { id: 1 }), res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

});
