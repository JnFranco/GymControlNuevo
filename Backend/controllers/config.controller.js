const ConfigModel = require('../models/config.model');

exports.getConfig = async (req, res) => {
  try {
    const config = await ConfigModel.obtenerConfig();
    res.json(config);
  } catch (error) {
    console.error('❌ Error al obtener config:', error);
    res.status(500).json({ error: 'Error al obtener la configuración' });
  }
};

exports.updateConfig = async (req, res) => {
  try {
    const config = req.body;
    if (!config || typeof config !== 'object' || Array.isArray(config)) {
      return res.status(400).json({ error: 'Datos de configuración inválidos' });
    }

    const nuevo = await ConfigModel.actualizarConfig(config);
    res.json(nuevo);
  } catch (error) {
    console.error('❌ Error al actualizar config:', error);
    res.status(500).json({ error: 'Error al actualizar la configuración' });
  }
};
