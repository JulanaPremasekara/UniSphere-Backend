// middleware/supabaseUpload.js
const supabase = require('./supabaseClient');

const handleCloudUpload = (bucketName, folderPath = 'general') => async (req, res, next) => {
    try {
        if (!req.file) return next(); 

        const file = req.file;
        // Standardize filename to avoid conflicts
        const fileName = `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;
        
        // Dynamic path: e.g., 'profiles/123_me.jpg' or 'marketplace/123_bike.png'
        const filePath = `${folderPath}/${fileName}`;

        // 1. Upload to Bucket
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (error) throw error;

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

        // 3. Inject into req.body
        // Note: Using 'image' as the key. If your schema uses 'avatar', 
        // you could even pass the field name as a 3rd argument.
        req.body.image = publicUrl;

        next();
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: "Cloud Storage Upload Failed", 
            error: err.message 
        });
    }
};

// --- ADD THIS DELETE FUNCTION ---
const deleteFromCloud = async (bucketName, publicUrl) => {
    try {
        if (!publicUrl) return;

        // Logic to extract the path from the URL
        // Splits after the bucket name to get: "folder/filename.png"
        const urlParts = publicUrl.split(`/storage/v1/object/public/${bucketName}/`);
        const filePath = urlParts[1];

        if (filePath) {
            const { error } = await supabase.storage
                .from(bucketName)
                .remove([filePath]);
            
            if (error) throw error;
        }
        return true;
    } catch (err) {
        console.error("Supabase Deletion Error:", err.message);
        return false;
    }
};


module.exports = { handleCloudUpload, deleteFromCloud };