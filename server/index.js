import express from "express";
import cors from 'cors';
import pool from "./config/connect-db.js";
import { runQueries } from "./utils/run-queries.js";


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


app.get('/', (req, res) => {
    res.send('<h1>Sat Saheb!!</h1>');
});



app.listen(3000, () => {
    console.log(`Server Running on: https://localhost:3000/`);
})
