const connection = require('../config/dbConfig');

const verifyAdmin = (req, res, next) => {
  const userId = parseInt(req.headers.userid, 10);
  const projectId =  req.body.projectID || req.params.id || req.headers.projectid;
  console.log(projectId,userId)
  const checkCreatorQuery = `SELECT projCreatorID FROM Projects WHERE projID = ?`;

  connection.query(checkCreatorQuery, [projectId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (result.length && result[0].projCreatorID === userId) {
      // Kullanıcı yetkili, istenen işleme devam et
      next();
    } else {
      // Kullanıcı yetkili değil, yetki hatası ver
      return res.status(403).json({ error: 'Unauthorized' });
    }
  });
};
module.exports = verifyAdmin;