import { pool } from './db.js'; //Temp Block
import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import studentRoutes from './routes/studentRoutes.js';
 
const app = express();
const PORT = 4000;
 
// Middleware to parse incoming JSON request bodies
app.use(express.json());

app.use('/students', studentRoutes);

//Temp Block
pool.query('SELECT NOW()')
  .then(() => console.log('Database connected successfully'))
  .catch((error: unknown) => {
    if (error instanceof Error) {
      const code = 'code' in error && typeof error.code === 'string'
        ? ` (${error.code})`
        : '';
      console.error(`Database connection failed${code}: ${error.message}`);
      return;
    }

    console.error('Database connection failed with an unknown error.');
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Course API running at http://localhost:${PORT}`);
});