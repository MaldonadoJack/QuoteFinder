import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({ extended: true }));

//setting up database connection pool
const pool = mysql.createPool({
    host: "zf4nk2bcqjvif4in.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "n18mr2pz51ahq1w1",
    password: "e9mby86atjrkouhr",
    database: "zwqjweuv3jxy2zyr",
    connectionLimit: 10,
    waitForConnections: true
});

//routes
app.get('/', async (req, res) => {
    let authorsSQL = `SELECT authorId , firstName , lastName FROM authors`;
    const [authorsRows] = await pool.query(authorsSQL);
    // console.log(authorsRows);

    let categorySQL = `SELECT DISTINCT category FROM quotes`;
    const [categoryRows] = await pool.query(categorySQL);

    res.render('home.ejs', { authorsRows , categoryRows });
});

app.get('/searchByKeyWord', async (req, res) => {
    // console.log(req);
    let keyword = req.query.keyword;

    let sql = `SELECT authorId, firstName, lastName, quote FROM authors NATURAL JOIN quotes WHERE quote LIKE ?`;
    let sqlParams = [`%${keyword}%`];
    const [rows] = await pool.query(sql, sqlParams);
    // console.log(rows);

    res.render('results.ejs', { rows });
});

app.get('/searchByCategory', async (req, res) => {
    let category = req.query.category;

    let sql = `SELECT authorId , firstName , lastName , quote , category FROM authors NATURAL JOIN quotes WHERE category = ?`
    let sqlParams = [`${category}`];
    const [rows] = await pool.query(sql, sqlParams);
    console.log(rows);

    res.render('results.ejs' , { rows });
});

app.get('/searchByAuthor' , async (req, res) => {
    let authorId = req.query.authorId;

    let sql = `SELECT authorId , firstName , lastName , quote FROM authors NATURAL JOIN quotes WHERE authorID = ?`;
    let sqlParams = [`${authorId}`];
    const [rows] = await pool.query(sql, sqlParams);
    // console.log(rows);

    res.render('results.ejs' , { rows })
});

// local API to get all info for a specific author
app.get('/api/authorInfo/:authorId', async (req, res) => {
    let authorId = req.params.authorId;

    let sql = `SELECT * FROM authors WHERE authorId = ?`;
    const [rows] = await pool.query(sql, [authorId]);

    res.send(rows);
});

app.get("/dbTest", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//dbTest

app.listen(3000, () => {
    console.log("Express server running")
})