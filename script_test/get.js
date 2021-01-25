module.exports = function(req, res) {
  res.send({
    query: req.query,
    headers: req.headers
  });
}