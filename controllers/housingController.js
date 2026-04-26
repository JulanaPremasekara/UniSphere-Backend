const Housing = require('../models/Housing');

/**
 * @desc    Create a new housing entry
 * @route   POST /api/housing
 * @access  Private
 */
exports.createHousing = async (req, res) => {
  try {
    const housingData = {
      ...req.body,
      postedBy: req.user._id // req.user populated by auth middleware
    };

    const housing = await Housing.create(housingData);

    res.status(201).json({
      success: true,
      message: 'Housing post created successfully',
      housing
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get all housing entries with search and location filtering
 * @route   GET /api/housing
 * @access  Public
 */
exports.getAllHousing = async (req, res) => {
  try {
    const { search, location } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (location) {
      query.address = { $regex: location, $options: 'i' };
    }

    const housings = await Housing.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      housings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get a single housing entry by ID
 * @route   GET /api/housing/:id
 * @access  Public
 */
exports.getHousingById = async (req, res) => {
  try {
    const housing = await Housing.findById(req.params.id).populate('postedBy', 'name email phone');

    if (!housing) {
      return res.status(404).json({
        success: false,
        message: 'Housing post not found'
      });
    }

    res.status(200).json({
      success: true,
      housing
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid Housing ID'
    });
  }
};

/**
 * @desc    Update a housing entry
 * @route   PUT /api/housing/:id
 * @access  Private (Owner only)
 */
exports.updateHousing = async (req, res) => {
  try {
    let housing = await Housing.findById(req.params.id);

    if (!housing) {
      return res.status(404).json({
        success: false,
        message: 'Housing post not found'
      });
    }

    // Check ownership
    if (housing.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    housing = await Housing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Housing post updated successfully',
      housing
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Delete a housing entry
 * @route   DELETE /api/housing/:id
 * @access  Private (Owner only)
 */
exports.deleteHousing = async (req, res) => {
  try {
    const housing = await Housing.findById(req.params.id);

    if (!housing) {
      return res.status(404).json({
        success: false,
        message: 'Housing post not found'
      });
    }

    // Check ownership
    if (housing.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    await housing.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Housing post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
