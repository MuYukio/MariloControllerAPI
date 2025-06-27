const db = require('../db');

exports.criarTransacao = async (req, res) =>{

    const { titulo, preco, categoria, data } = req.body;

    try{
        const resultado = await db.query(
            'INSERT INTO transacoes (titulo, preco, categoria, data) VALUES ($1, $2, $3, $4) RETURNING *', [titulo,preco,categoria,data]
        );
        res.status(201).json(resultado.rows[0]);

    }catch(err){
        console.log(err);
        res.status(500).json({erro:'Erro ao criar transação'});
    }
};

exports.listarTransacao = async (req, res) => {

    try{
        const resultado = await db.query('SELECT * FROM transacoes ORDER BY id');
        res.json(resultado.rows)
    } catch (err){
        console.error(err);
        res.status(500).json({ erro: 'Erro ao listar tarefas'})
    }
};