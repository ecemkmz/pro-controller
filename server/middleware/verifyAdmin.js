const connection = require('../config/dbConfig');

const verifyAdmin = (req, res, next) => {
  const userId = parseInt(req.headers.userid, 10);
  const projectId =  req.body.projectID || req.params.id || req.headers.projectid ||req.params.projectID;

  const checkCreatorQuery = `SELECT projCreatorID FROM Projects WHERE projID = ?`;

  connection.query(checkCreatorQuery, [projectId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (result.length && result[0].projCreatorID === userId) {
      next();
    } else {
      return res.status(403).json({ error: 'Bu işlem için yetkiniz bulunmamaktadır.' });
    }
  });
};
module.exports = verifyAdmin;