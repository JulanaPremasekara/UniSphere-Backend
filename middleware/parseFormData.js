const parseFormData = (config) => (req, res, next) => {
  try {
    // 🔹 Parse booleans
    if (config.booleans) {
      config.booleans.forEach((field) => {
        if (req.body[field] !== undefined) {
          req.body[field] = req.body[field] === "true";
        }
      });
    }

    // 🔹 Parse numbers
    if (config.numbers) {
      config.numbers.forEach((field) => {
        if (req.body[field] !== undefined) {
          const num = Number(req.body[field]);
          req.body[field] = isNaN(num) ? req.body[field] : num;
        }
      });
    }

    // 🔹 Parse arrays (comma-separated → array)
    if (config.arrays) {
      config.arrays.forEach((field) => {
        if (req.body[field]) {
          req.body[field] = req.body[field].split(",");
        }
      });
    }

    next();
  } catch (error) {
    console.error("Parse Middleware Error:", error);
    res.status(400).json({
      success: false,
      message: "Invalid form data format",
    });
  }
};

module.exports = parseFormData;