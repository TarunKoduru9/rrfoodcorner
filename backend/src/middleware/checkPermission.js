const db = require('../config/db');

const checkPermission = (pageKey, action = 'can_view') => {
  return async (req, res, next) => {
    const { role } = req.user; 

    if (role === 'superadmin') return next(); 

    try {
      const [rows] = await db.query(
        'SELECT ?? FROM role_permissions WHERE role = ? AND page_key = ?',
        [action, role, pageKey]
      );

      if (!rows.length || !rows[0][action]) {
        return res.status(403).json({ message: 'Permission denied' });
      }

      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Permission check failed' });
    }
  };
};

module.exports = checkPermission;
