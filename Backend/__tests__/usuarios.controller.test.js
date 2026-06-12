const bcrypt = require('bcrypt');
jest.mock('bcrypt');

const db = require('../db/connection');
jest.mock('../db/connection');

const UsuariosModel = require('../models/usuarios.model');
jest.mock('../models/usuarios.model');

const {
  login, getUsuarios, getUsuarioById,
  createUsuario, updateUsuario, deleteUsuario
} = require('../controllers/usuarios.controller');

const mkReq = (body, params) => ({ body: body || {}, params: params || {} });
const mkRes = () => {
  const r = {};
  r.status = jest.fn().mockReturnValue(r);
  r.json = jest.fn().mockReturnValue(r);
  return r;
};

describe('Usuarios Controller', () => {

  beforeEach(() => { jest.clearAllMocks(); });

  // ===== LOGIN =====
  describe('login()', () => {
    test('401 si el usuario no existe o esta inactivo', async () => {
      db.execute.mockResolvedValue([[]]);
      const res = mkRes();
      await login(mkReq({ correo: 'x@x.com', password: '123' }), res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    test('401 si la contrasena es incorrecta', async () => {
      db.execute.mockResolvedValue([[{ id: 1, password: 'hash' }]]);
      bcrypt.compare.mockResolvedValue(false);
      const res = mkRes();
      await login(mkReq({ correo: 'x@x.com', password: 'wrong' }), res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    test('200 con datos del usuario si credenciales correctas', async () => {
      db.execute.mockResolvedValue([[{ id: 1, correo: 'a@a.com', password: 'hash', rol: 'Admin' }]]);
      bcrypt.compare.mockResolvedValue(true);
      const res = mkRes();
      await login(mkReq({ correo: 'a@a.com', password: 'ok' }), res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1, rol: 'Admin' }));
    });

    test('500 si ocurre error interno', async () => {
      db.execute.mockRejectedValue(new Error('DB fail'));
      const res = mkRes();
      await login(mkReq({ correo: 'x@x.com', password: '123' }), res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ===== GET USUARIOS =====
  describe('getUsuarios()', () => {
    test('retorna lista de usuarios', async () => {
      UsuariosModel.obtenerUsuarios.mockResolvedValue([{ id: 1, nombre: 'Test' }]);
      const res = mkRes();
      await getUsuarios(mkReq(), res);
      expect(res.json).toHaveBeenCalledWith([{ id: 1, nombre: 'Test' }]);
    });

    test('500 si falla el modelo', async () => {
      UsuariosModel.obtenerUsuarios.mockRejectedValue(new Error('fail'));
      const res = mkRes();
      await getUsuarios(mkReq(), res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ===== GET BY ID =====
  describe('getUsuarioById()', () => {
    test('retorna usuario si existe', async () => {
      UsuariosModel.obtenerUsuarioPorId.mockResolvedValue({ id: 1, nombre: 'Juan' });
      const res = mkRes();
      await getUsuarioById(mkReq({}, { id: 1 }), res);
      expect(res.json).toHaveBeenCalledWith({ id: 1, nombre: 'Juan' });
    });

    test('404 si no existe', async () => {
      UsuariosModel.obtenerUsuarioPorId.mockResolvedValue(null);
      const res = mkRes();
      await getUsuarioById(mkReq({}, { id: 99 }), res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    test('500 si falla', async () => {
      UsuariosModel.obtenerUsuarioPorId.mockRejectedValue(new Error('fail'));
      const res = mkRes();
      await getUsuarioById(mkReq({}, { id: 1 }), res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ===== CREATE USUARIO =====
  describe('createUsuario()', () => {
    test('201 crea usuario con password encriptada', async () => {
      bcrypt.hash.mockResolvedValue('hashed123');
      UsuariosModel.crearUsuario.mockResolvedValue(1);
      const res = mkRes();
      await createUsuario(mkReq({ nombre: 'Juan', password: '123456', id_rol: 3 }), res);
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
      expect(UsuariosModel.crearUsuario).toHaveBeenCalledWith(
        expect.objectContaining({ password: 'hashed123' })
      );
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('500 si falla', async () => {
      UsuariosModel.crearUsuario.mockRejectedValue(new Error('fail'));
      const res = mkRes();
      await createUsuario(mkReq({ nombre: 'Juan', password: '123' }), res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    test('400 si el correo ya existe (ER_DUP_ENTRY)', async () => {
      const dupError = new Error('Duplicate entry');
      dupError.errno = 1062;
      dupError.code = 'ER_DUP_ENTRY';
      UsuariosModel.crearUsuario.mockRejectedValue(dupError);
      const res = mkRes();
      await createUsuario(mkReq({ nombre: 'Juan', correo: 'dup@test.com', password: '123456' }), res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ mensaje: 'El correo electrónico ya se encuentra registrado' })
      );
    });
  });

  // ===== UPDATE USUARIO =====
  describe('updateUsuario()', () => {
    test('200 actualiza usuario sin password', async () => {
      UsuariosModel.actualizarUsuario.mockResolvedValue(1);
      const res = mkRes();
      await updateUsuario(mkReq({ nombre: 'Juan' }, { id: 1 }), res);
      expect(res.json).toHaveBeenCalledWith({ mensaje: expect.any(String) });
    });

    test('200 actualiza usuario con password nuevo', async () => {
      bcrypt.hash.mockResolvedValue('newhash');
      UsuariosModel.actualizarUsuario.mockResolvedValue(1);
      const res = mkRes();
      await updateUsuario(mkReq({ password: 'nueva123' }, { id: 1 }), res);
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(UsuariosModel.actualizarUsuario).toHaveBeenCalledWith(1, expect.objectContaining({ password: 'newhash' }));
    });

    test('404 si no encuentra el usuario', async () => {
      UsuariosModel.actualizarUsuario.mockResolvedValue(0);
      const res = mkRes();
      await updateUsuario(mkReq({ nombre: 'Juan' }, { id: 99 }), res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  // ===== DELETE USUARIO =====
  describe('deleteUsuario()', () => {
    test('200 elimina usuario existente', async () => {
      UsuariosModel.eliminarUsuario.mockResolvedValue(1);
      const res = mkRes();
      await deleteUsuario(mkReq({}, { id: 1 }), res);
      expect(res.json).toHaveBeenCalledWith({ mensaje: expect.any(String) });
    });

    test('404 si el usuario no existe', async () => {
      UsuariosModel.eliminarUsuario.mockResolvedValue(0);
      const res = mkRes();
      await deleteUsuario(mkReq({}, { id: 99 }), res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    test('500 si falla la BD', async () => {
      UsuariosModel.eliminarUsuario.mockRejectedValue(new Error('fail'));
      const res = mkRes();
      await deleteUsuario(mkReq({}, { id: 1 }), res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

});
