const db = require('../db/connection');
jest.mock('../db/connection');

const { getEstadisticas, getResumen } = require('../controllers/admin.controller');

const mkReq = () => ({});
const mkRes = () => {
  const r = {};
  r.status = jest.fn().mockReturnValue(r);
  r.json = jest.fn().mockReturnValue(r);
  return r;
};

describe('Admin Controller', () => {

  beforeEach(() => { jest.clearAllMocks(); });

  // ===== GET RESUMEN =====
  describe('getResumen()', () => {
    test('retorna resumen con clientes, entrenadores y clases', async () => {
      db.execute
        .mockResolvedValueOnce([[{ total: 10 }]])
        .mockResolvedValueOnce([[{ total: 3 }]])
        .mockResolvedValueOnce([[{ total: 8 }]]);
      const res = mkRes();
      await getResumen(mkReq(), res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        clientes: 10, entrenadores: 3, clasesHoy: 8
      }));
    });

    test('500 si falla la BD', async () => {
      db.execute.mockRejectedValue(new Error('DB fail'));
      const res = mkRes();
      await getResumen(mkReq(), res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ===== GET ESTADISTICAS =====
  describe('getEstadisticas()', () => {
    test('retorna asistencias de los ultimos 7 dias', async () => {
      const data = [
        { dia: '2026-05-22', asistencias: 15 },
        { dia: '2026-05-23', asistencias: 20 },
      ];
      db.execute.mockResolvedValue([data]);
      const res = mkRes();
      await getEstadisticas(mkReq(), res);
      expect(res.json).toHaveBeenCalledWith(data);
    });

    test('retorna array vacio si no hay asistencias', async () => {
      db.execute.mockResolvedValue([[]]);
      const res = mkRes();
      await getEstadisticas(mkReq(), res);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    test('500 si falla', async () => {
      db.execute.mockRejectedValue(new Error('fail'));
      const res = mkRes();
      await getEstadisticas(mkReq(), res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

});
