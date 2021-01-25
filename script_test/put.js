module.exports = function(req, res) {
  res.send({
    query: req.query,
    body: req.body,
    headers: req.headers
  });
}