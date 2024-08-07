import {Router} from 'express';
import { upload } from '../middleware/upload.js'; // Assuming you have middleware for file uploads
import { createProgram, deleteProgram, getAllPrograms, getProgramById, updateProgram } from '../controllers/trainingController.js';
import {authenticateJwt} from '../middleware/authMiddleware.js'

const trainingRouter = Router();

// Create a new program
trainingRouter.post('/program',authenticateJwt, createProgram);

// Get all programs
trainingRouter.get('/get_all_programs', getAllPrograms);


// Get program by ID
trainingRouter.get('/program/:id', getProgramById);

// Update program by ID
trainingRouter.put('/update_program/:id', authenticateJwt, updateProgram);
 
// Delete program by ID 
trainingRouter.delete('/program/:id', authenticateJwt, deleteProgram);

export default trainingRouter; 
 