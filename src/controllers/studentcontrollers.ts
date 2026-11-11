// import express from 'express';
import type { Request, Response } from 'express';
//Additional 
import { pool } from '../db.js';

//New Get Courses 
export async function getStudents(_req: Request, res: Response): Promise<void> {
  try {
    const result = await pool.query(
      'SELECT * FROM students ORDER BY id;'
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: 'Could not load students' });
  }
}

//Get Course by ID 
// export function getCourseById(req: Request, res: Response) {
//   res.json({
//     message: 'Course details request received',
//     courseId: req.params.id
//   });}
//Get Student by ID 

export async function getStudentById(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    res.status(400).json({ message: 'Student ID must be a positive integer' });
    return;
  }
 
  try {
    const result = await pool.query(
      'SELECT * FROM students WHERE id = $1;',
      [id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: 'Could not load student' });
  }
}
export async function updateStudent(req: Request, res: Response): Promise<void> {
  const idText = String(req.params.id ?? '');
  const id = Number(idText);

  if (!/^\d+$/.test(idText) || !Number.isSafeInteger(id) || id < 1) {
    res.status(400).json({ message: 'Student ID must be a positive integer' });
    return;
  }

  const body: unknown = req.body;
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    res.status(400).json({ message: 'A JSON object is required' });
    return;
  }

  const { student_number, first_name, last_name, course, year_level } = body as Record<string, unknown>;

  if (
    typeof student_number !== 'string' || student_number.trim() === '' ||
    typeof first_name !== 'string' || first_name.trim() === '' ||
    typeof last_name !== 'string' || last_name.trim() === '' ||
    typeof course !== 'string' || course.trim() === ''
  ) {
    res.status(400).json({ message: 'All text fields are required' });
    return;
  }

  if (typeof year_level !== 'number' || !Number.isInteger(year_level) || year_level < 1) {
    res.status(400).json({ message: 'year_level must be a positive whole number' });
    return;
  }

  const sql = `UPDATE students
    SET student_number = $1, first_name = $2, last_name = $3,
        course = $4, year_level = $5
    WHERE id = $6
    RETURNING id, student_number, first_name, last_name, course, year_level;`;

  const values = [
    student_number.trim(), first_name.trim(), last_name.trim(),
    course.trim(), year_level, id
  ];

  try {
    const result = await pool.query(sql, values);

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (error: unknown) {
    if (
      typeof error === 'object' && error !== null &&
      'code' in error && error.code === '23505'
    ) {
      res.status(409).json({ message: 'student_number already exists' });
      return;
    }

    res.status(500).json({ message: 'Could not update student' });
  }
}

export async function deleteStudent(req: Request, res: Response): Promise<void> {
  const idText = String(req.params.id ?? '');
  const id = Number(idText);

  if (!/^\d+$/.test(idText) || !Number.isSafeInteger(id) || id < 1) {
    res.status(400).json({ message: 'Student ID must be a positive integer' });
    return;
  }

  const sql = `DELETE FROM students
    WHERE id = $1
    RETURNING id, student_number;`;

  try {
    const result = await pool.query(sql, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }

    res.status(200).json({
      message: 'Student deleted',
      id: result.rows[0].id,
      student_number: result.rows[0].student_number
    });
  } catch {
    res.status(500).json({ message: 'Could not delete student' });
  }
}

export async function createStudent(req: Request, res: Response): Promise<void> {
  const body = req.body;

  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    res.status(400).json({ message: 'A JSON object is required' });
    return;
  }

  const { student_number, first_name, last_name, course, year_level } = body as Record<string, unknown>;

  if (
    typeof student_number !== 'string' || student_number.trim() === '' ||
    typeof first_name !== 'string' || first_name.trim() === '' ||
    typeof last_name !== 'string' || last_name.trim() === '' ||
    typeof course !== 'string' || course.trim() === ''
  ) {
    res.status(400).json({ message: 'All text fields are required' });
    return;
  }

  if (typeof year_level !== 'number' || !Number.isInteger(year_level) || year_level < 1) {
    res.status(400).json({ message: 'year_level must be a positive whole number' });
    return;
  }

  const sql = `INSERT INTO students
    (student_number, first_name, last_name, course, year_level)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, student_number, first_name, last_name, course, year_level;`;

  const values = [
    student_number.trim(), first_name.trim(), last_name.trim(),
    course.trim(), year_level
  ];

  try {
    const result = await pool.query(sql, values);
    res.status(201).json(result.rows[0]);
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') {
      res.status(409).json({ message: 'student_number already exists' });
      return;
    }

    res.status(500).json({ message: 'Could not create student' });
  }
}

export const createCourse = createStudent;
export const updateCourse = updateStudent;
export const deleteCourse = deleteStudent;

// app.get('/courses', (req: Request, res: Response) => {
//   const program = String(req.query.program ?? 'all programs');
//   res.json({
//     message: 'Course list request received',
//     program
//   });
// });
 
// 2. GET /courses/:id - return a specific course by ID
// app.get('/courses/:id', (req: Request, res: Response) => {
//   res.json({
//     message: 'Course details request received',
//     courseId: req.params.id
//   });
// });
 
// 3. POST /courses - receive new course data
// app.post('/courses', (req: Request, res: Response) => {
//   const { code, title, program } = req.body ?? {};
 
//   if (
//     typeof code !== 'string' || !code.trim() ||
//     typeof title !== 'string' || !title.trim() ||
//     typeof program !== 'string' || !program.trim()
//   ) {
//     return res.status(400).json({
//       message: 'code, title, and program are required'
//     });
//   }
 
//   res.status(200).json({
//     message: 'Course data received; nothing was saved',
//     course: { code, title, program }
//   });
// });
 
// 4. PUT /courses/:id - receive updated course data
// app.put('/courses/:id', (req: Request, res: Response) => {
//   res.json({
//     message: 'Update request received; nothing was changed',
//     courseId: req.params.id,
//     updatedData: req.body
//   });
// });
 
// 5. DELETE /courses/:id - receive delete request
// app.delete('/courses/:id', (req: Request, res: Response) => {
//   res.json({
//     message: 'Delete request received; nothing was removed',
  //   courseId: req.params.id
  // // });
// });


// Start the server
// app.listen(PORT, () => {
//   console.log(`Course API running at http://localhost:${PORT}`);
// })