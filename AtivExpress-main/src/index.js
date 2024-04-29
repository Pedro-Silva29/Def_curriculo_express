const express = require("express");
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
});

const app = express();

const PORT = 40; 

app.use(express.json());

app.get('/', (req, res) => {
    console.log('olá mundo');
});

app.get('/CURRICULUM', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM CURRICULUM');
        return res.status(200).send(rows);
    } catch (err) {
        return res.status(400).send(err);
    }
});

app.post('/session', async (req, res) => {
    const { username, userprofissao, useridade } = req.body;
    try {
        let CURRICULUM = await pool.query('SELECT * FROM CURRICULUM WHERE user_name = $1 AND user_profissao = $2 AND user_idade = $3', [username, userprofissao, useridade]);
        if (CURRICULUM.rows.length === 0) {
            // Se não houver entrada para este usuário, insira no banco de dados
            CURRICULUM = await pool.query('INSERT INTO CURRICULUM (user_name, user_profissao, user_idade) VALUES ($1, $2, $3) RETURNING *', [username, userprofissao, useridade]);
            return res.status(200).send(CURRICULUM.rows[0]); 
        } else {
            return res.status(200).send(CURRICULUM.rows[0]); 
        }
    } catch (err) {
        return res.status(400).send(err);
    }
});

app.delete('/session/:useridade', async (req, res) => {
    const { useridade } = req.params;
    try {
        const deletedCURRICULUM = await pool.query('DELETE FROM CURRICULUM WHERE user_idade = $1 RETURNING *', [useridade]);
        if (deletedCURRICULUM.rows.length === 0) {
            return res.status(404).send('Registro não encontrado');
        } else {
            return res.status(200).send('Registro removido com sucesso');
        }
    } catch (err) {
        return res.status(400).send(err);
    }
});


app.listen(PORT, () => console.log(`server running on port ${PORT}`));

