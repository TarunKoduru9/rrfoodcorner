const db = require('../../config/db');

exports.getAllKeywords = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM keywords');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getKeywordById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM keywords WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Keyword not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createKeyword = async (req, res) => {
  const { name } = req.body;
  try {
    const [result] = await db.query('INSERT INTO keywords (name) VALUES (?)', [name]);
    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Keyword already exists' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.updateKeyword = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const [result] = await db.query('UPDATE keywords SET name = ? WHERE id = ?', [name, id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Keyword not found' });
    res.json({ id, name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete keyword
exports.deleteKeyword = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM keywords WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Keyword not found' });
    res.json({ message: 'Keyword deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
