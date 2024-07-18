import { Router } from 'express';
import { db } from '../config/dbConnection.js';
import { authenticateJwt } from '../middleware/authMiddleware.js'

const programApplicationRouter = Router();
programApplicationRouter.use(authenticateJwt)
//craete program
programApplicationRouter.post('/apply_for_program', (req, res) => {
    const { std_id, course_id, program_id, AppDate, Status } = req.body
    console.log(req.body)


    const check_previous_program = `select * from applications_for_courses_and_programs where program_id=? AND std_id=?`
    db.query(check_previous_program, [program_id, std_id], (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            if (result.length >= 1) {
                return res.status(409).json("Already Applied")
            }
            else {
                const sql = `INSERT INTO applications_for_courses_and_programs (std_id, course_id, program_id, AppDate, Status) VALUES(?, ?, ?, ?, ?)`;
                const values = [std_id, null, program_id, AppDate, Status]
                db.query(sql, values, (err, result) => {
                    if (err) {
                        console.error('Error executing SQL:', err);
                        res.status(500).json({ error: 'Error inserting data in applicaitons courses and programs' });

                    }
                    else {
                        res.status(201).json({
                            success: true,
                            msg: "Program enrolled successfully"
                        });
                    }
                    console.log(result)

                });
            }
        }
    })
});

// Get all programs
programApplicationRouter.get('/all_program_applications', (req, res) => {

});

// Get program by student ID
programApplicationRouter.get('/program_application_by_std/:id', (req, res) => {
    const id = req.params.id;
    console.log(id)
    const sql = 'select trainingprograms.program_id, trainingprograms.program_name from applications_for_courses_and_programs inner join trainingprograms on applications_for_courses_and_programs.program_id=trainingprograms.program_id where std_id=1;';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error executing SQL:', err);
            res.status(500).json({ error: 'Error fetching students' });
            return;
        }
        console.log(result)
        if (result.length > 0) {
            res.status(200).json({
                success: true,
                data: result,
                msg: "Fetch All students data successfully."
            });
        }
        else {
            res.status(200).json({ data:[]})
        }

    });

});

programApplicationRouter.get('/program_application/:id', (req, res) => {

});
// Update program application by ID
programApplicationRouter.put('/program_application/:id', (req, res) => {

});

// Delete program application by ID
programApplicationRouter.delete('/program_application/:id', (req, res) => {

});

export default programApplicationRouter;