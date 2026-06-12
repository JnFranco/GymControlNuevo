const db = require('../db/connection');
jest.mock('../db/connection');

const {
  pagarMembresia, getPagosPorUsuario,
  crearPago, getPagosPendientes
} = require('../controllers/pagos.controller');

const mkReq = (params, body) => ({ params: params || {}, body: body || {} });
const mkRes = () => {
  const r = {};
  r.status = jest.fn().mockReturnValue(r);
  r.json = jest.fn().mockReturnValue(r);
  return r;
};

describe('Pagos Controller', () => {

  beforeEach(() => { jest.clearAllMocks(); });

  // ===== GET PAGOS POR USUARIO =====
  describe('getPagosPorUsuario()', () => {
    test('retorna array de pagos del usuario', async () => {
      db.execute.mockResolvedValue([[{ id: 1, monto: 150 }]]);
      const res = mkRes();
      await getPagosPorUsuario(mkReq({ id: 1 }), res);
      expect(res.json).toHaveBeenCalledWith([{ id: 1, monto: 150 }]);
    });

    test('retorna array vacio si no hay pagos', async () => {
      db.execute.mockResolvedValue([[]]);
      const res = mkRes();
      await getPagosPorUsuario(mkReq({ id: 99 }), res);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    test('500 retorna array vacio si falla', async () => {
      db.execute.mockRejectedValue(new Error('fail'));
      const res = mkRes();
      await getPagosPorUsuario(mkReq({ id: 1 }), res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ===== PAGAR MEMBRESIA =====
  describe('pagarMembresia()', () => {
    test('400 si falta metodo_pago', async () => {
      const res = mkRes();
      await pagarMembresia(mkReq({ id: '1' }, {}), res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('200 Pendiente para Efectivo con codigo EF-', async () => {
      db.query.mockResolvedValue([{}]);
      const res = mkRes();
      await pagarMembresia(mkReq({ id: '1' }, { metodo_pago: 'Efectivo' }), res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        estado: 'Pendiente', codigo: expect.stringMatching(/^EF-/)
      }));
    });

    test('200 Pagado para metodo no efectivo', async () => {
      db.query.mockResolvedValue([{}]);
      const res = mkRes();
      await pagarMembresia(mkReq({ id: '1' }, { metodo_pago: 'Tarjeta' }), res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ estado: 'Pagado' }));
    });

    test('500 si falla la BD', async () => {
      db.query.mockRejectedValue(new Error('DB fail'));
      const res = mkRes();
      await pagarMembresia(mkReq({ id: '1' }, { metodo_pago: 'Tarjeta' }), res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ===== CREAR PAGO =====
  describe('crearPago()', () => {
    test('200 crea pago correctamente', async () => {
      db.execute
        .mockResolvedValueOnce([[{ costo: 150 }]])
        .mockResolvedValueOnce([{}]);
      const res = mkRes();
      await crearPago(mkReq({}, { id_usuario: 1, id_membresia: 2 }), res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Pago creado' });
    });

    test('500 si falla', async () => {
      db.execute.mockRejectedValue(new Error('fail'));
      const res = mkRes();
      await crearPago(mkReq({}, { id_usuario: 1, id_membresia: 2 }), res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ===== GET PENDIENTES =====
  describe('getPagosPendientes()', () => {
    test('retorna pagos pendientes', async () => {
      db.execute.mockResolvedValue([[{ id: 1, cliente: 'Juan', monto: 150 }]]);
      const res = mkRes();
      await getPagosPendientes(mkReq(), res);
      expect(res.json).toHaveBeenCalledWith([{ id: 1, cliente: 'Juan', monto: 150 }]);
    });

    test('500 si falla', async () => {
      db.execute.mockRejectedValue(new Error('fail'));
      const res = mkRes();
      await getPagosPendientes(mkReq(), res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

});
