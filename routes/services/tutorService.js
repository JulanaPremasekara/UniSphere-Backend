const Tutor = require('../../middleware/models/Tutor');
const { deleteFromCloud } = require('../../middleware/supabaseUpload');

class TutorService {
    
    async registerTutor(tutorData) {
        const newTutor = new Tutor(tutorData);
        return await newTutor.save();
    }

    async fetchActiveTutors() {
        // Only returns tutors appearing in search (isOnline: true)
        return await Tutor.find({});
    }

    async fetchTutorDetails(id) {
        const tutor = await Tutor.findById(id);
        if (!tutor) {
            throw new Error("Tutor not found");
        }
        return tutor;
    }

    async updateTutorStatus(id) {
        const tutor = await Tutor.findById(id);
        if (!tutor) {
            return { success: false, message: "Tutor not found." };
        }

        tutor.isOnline = !tutor.isOnline;
        const updatedTutor = await tutor.save();

        return { 
            success: true, 
            isOnline: updatedTutor.isOnline, 
            message: `Tutor is now ${updatedTutor.isOnline ? 'Online' : 'Offline'}.` 
        };
    }

    async removeTutorRecord(id) {
        const deletedTutor = await Tutor.findByIdAndDelete(id);

        if (!deletedTutor) {
            return { 
                success: false, 
                message: "Tutor record not found in our database." 
            };
        }
        
        if(deletedTutor.image){
            const cleanup = await deleteFromCloud("Images", deletedTutor.image);

            if(!cleanup.success){
                console.error('Failed to delete tutor image from cloud:', cleanup.message);
            }
        }
        
        return { 
            success: true, 
            message: "Tutor account and associated image removed successfully." 
        };
    }
}

module.exports = new TutorService();
