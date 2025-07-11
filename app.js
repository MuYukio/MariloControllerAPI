const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use('/api/v1',require('./routes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 