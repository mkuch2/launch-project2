function attachUser(req, res, next) {
  const userId = req.header("x-user-id") || null;

  if (userId) {
    req.user = { id: userId };
  }

  next();
}

export { attachUser };
