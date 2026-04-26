// middleware/supabaseUpload.js
const supabase = require('./supabaseClient');

const handleCloudUpload = (bucketName, folderPath = 'general') => async (req, res, next) => {
    try {
        
        if (!req.file && (!req.files || req.files.length === 0)) {
            return next();
        }

       
        if (req.files && req.files.length > 0) {
            const uploadedUrls = [];

            for (const file of req.files) {
                const fileName = `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;
                const filePath = `${folderPath}/${fileName}`;

                // Upload
                const { error } = await supabase.storage
                    .from(bucketName)
                    .upload(filePath, file.buffer, {
                        contentType: file.mimetype,
                        upsert: false
                    });

                if (error) throw error;

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from(bucketName)
                    .getPublicUrl(filePath);

                uploadedUrls.push(publicUrl);
            }

            
            req.body.images = uploadedUrls;

            return next();
        }

        
        if (req.file) {
            const file = req.file;

            const fileName = `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;
            const filePath = `${folderPath}/${fileName}`;

            // Upload
            const { error } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                    upsert: false
                });

            if (error) throw error;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath);

            
            req.body.image = publicUrl;

            return next();
        }

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Cloud Storage Upload Failed",
            error: err.message
        });
    }
};


const deleteFromCloud = async (bucketName, publicUrl) => {
    try {
        if (!publicUrl) return;

        const urlParts = publicUrl.split(`/storage/v1/object/public/${bucketName}/`);
        const filePath = urlParts[1];

        if (filePath) {
            const { error } = await supabase.storage
                .from(bucketName)
                .remove([filePath]);

            if (error) throw error;
        }

        return { success: true };
    } catch (err) {
        console.error("Supabase Deletion Error:", err.message);
        return { success: false, message: err.message };
    }
};

module.exports = { handleCloudUpload, deleteFromCloud };