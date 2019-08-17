async function authenticate(req, res) {
  res.json({ authentic: true });
}

module.exports = authenticate
