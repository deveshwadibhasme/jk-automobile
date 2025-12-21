import express from "express";
import cors from 'cors';
import pool from "./config/connect-db.js";
import { runQueries } from "./utils/run-queries.js";

import authRoute from "./routes/auth.routes.js";
import dataRoute from "./routes/data.routes.js";
import uploadRoute from './routes/upload.route.js'
import fileRoute from './routes/file.route.js'

const app = express();

app.use(cors({ origin: "*" }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


try {
    const connection = await pool.getConnection();
    await runQueries(connection);
    console.log("Database Connected");
    connection.release();
} catch (err) {
    console.error("Error in Database connection:", err);
}

app.use('/auth', authRoute)

app.use('/data', dataRoute)

app.use('/file', uploadRoute)

app.use('/bin-file', fileRoute)

app.get('/', (req, res) => {
    res.send('<h1>J.K. Automobile Server by Resicode</h1>');
});



app.listen(3000, () => {
    console.log(`Server Running on: http://localhost:3000/`);
})
