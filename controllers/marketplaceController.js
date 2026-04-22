const Marketplace = require('../middleware/models/Marketplace');

// Get all items
exports.getAllItems = async (req, res) => {
    try {
        const items = await Marketplace.find();
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update an item (For your Edit Screen)
exports.updateItem = async (req, res) => {
    try {
        const updatedItem = await Marketplace.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete an item (For your Delete Popup)
exports.deleteItem = async (req, res) => {
  try {
    await Marketplace.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Add a new listing (For the "Save Listing" screen)
exports.createItem = async (req, res) => {
    try {
        const newItem = new Marketplace(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({ message: "Error creating listing", error: err.message });
    }
};

// Get a single item by ID (For the "Product Detail" screen)
exports.getItemById = async (req, res) => {
    try {
        const item = await Marketplace.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Item not found" });
        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};