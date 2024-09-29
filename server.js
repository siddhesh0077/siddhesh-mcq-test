const express = require('express');
const sql = require('mssql');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// SQL Server configuration
const config = {
    user: 'SA',
    password: 'MyStrongPass123',
    server: 'localhost',
    port: 1433,
    database: 'siddhesh',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// Connect to database
sql.connect(config).then(() => {
    console.log('Connected to database');
}).catch(err => console.log('Database connection failed:', err));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/quiz', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM MCQQuestions`;
        res.render('quiz', { questions: result.recordset });
    } catch (err) {
        console.log(err);
        res.status(500).send('Error fetching questions');
    }
});

app.post('/submit', (req, res) => {
    let score = 0;
    let totalQuestions = 0;

    // Calculate score
    for (let key in req.body) {
        if (key.startsWith('q')) {
            totalQuestions++;
            if (req.body[key] === req.body[`CorrectAnswer${totalQuestions}`]) {
                score++;
            }
        }
    }

    res.render('result', { 
        score: score,
        totalQuestions: totalQuestions
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});