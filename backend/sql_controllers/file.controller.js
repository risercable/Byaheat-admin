
exports.uploadFile = async (req, res) => {
  try {
    console.log("FREEEEE file");

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
