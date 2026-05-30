const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    return res
      .status(error.statusCode)
      .send({ success: false, msg: error.message });
  }
};

module.exports = { asyncHandler };
