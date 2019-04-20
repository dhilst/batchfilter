module.exports = {
  baseUrl(req) {
    return `${req.protocol}://${req.get('host')}/`;
  },
}
