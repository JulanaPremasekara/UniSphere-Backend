const Marketplace = require('../middleware/models/Marketplace');

// 1. Get all items
exports.getAllItems = async (req, res) => {
    try {
        const items = await Marketplace.find().sort({ createdAt: -1 }).lean();
        res.status(200).json(items);
    } catch (err) {
        console.error("GET ALL ERROR:", err.message);
        res.status(500).json({ success: false, message: "Database fetch failed" });
    }
};

// 2. Get a single item by ID
exports.getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: "Invalid ID format" });
        }

        const item = await Marketplace.findById(id).lean().exec();
        if (!item) return res.status(404).json({ success: false, message: "Listing not found" });

        res.status(200).json(item);
    } catch (err) {
        console.error("GET BY ID ERROR:", err.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// 3. Create Item
exports.createItem = async (req, res) => {
    try {
        // Use the URL injected by handleCloudUpload or placeholder
        const imageUrl = req.body.image || "https://via.placeholder.com/150";

        const itemData = {
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
            location: req.body.location,
            condition: req.body.condition,
            contactNumber: req.body.contactNumber, // NEW
            image: req.body.image || "https://via.placeholder.com/150",
            seller: { name: "UniSphere User" }
        };

        const newItem = new Marketplace(itemData);
        const savedItem = await newItem.save();
        
        res.status(201).json(savedItem);
    } catch (err) {
        console.error("CREATE ERROR:", err.message);
        res.status(400).json({ success: false, message: err.message });
    }
};

// 4. Update Item
exports.updateItem = async (req, res) => {
    try {
        const updatedItem = await Marketplace.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                price: req.body.price,
                description: req.body.description,
                location: req.body.location,
                condition: req.body.condition,
                contactNumber: req.body.contactNumber // <--- ADD THIS LINE
            },
            { new: true }
        );
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 5. Delete Item
exports.deleteItem = async (req, res) => {
    try {
        const deletedItem = await Marketplace.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: "Item not found" });
        res.status(200).json({ success: true, message: "Item deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};