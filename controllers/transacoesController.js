const db = require('../db');

exports.criarTransacao = async (req, res) =>{

    const { titulo, preco, categoria, data,tipo } = req.body;

    try{
        const resultado = await db.query(
            'INSERT INTO transacoes (titulo, preco, categoria, data, tipo) VALUES ($1, $2, $3, $4, $5) RETURNING *', [titulo,preco,categoria,data,tipo]
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

exports.resumoMensal = async (req, res) => {
  try {
    const sql = `
      SELECT
        COALESCE(SUM(CASE WHEN tipo = 'entrada' THEN preco END), 0) AS entradas,
        COALESCE(SUM(CASE WHEN tipo = 'saida'   THEN preco END), 0) AS saidas
      FROM transacoes
      WHERE data >= date_trunc('month', CURRENT_DATE - interval '1 month')
        AND data <  date_trunc('month', CURRENT_DATE);
    `;
    const result = await db.query(sql);
    const { entradas, saidas } = result.rows[0];
    const total = entradas - saidas;

    res.json({ entradas, saidas, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao gerar resumo mensal' });
  }
};

exports.resumoPorCategoria = async (req, res) => {
  try {
    // Obter mês e ano da query ou usar mês/ano atual
    const mes = parseInt(req.query.mes) || new Date().getMonth() + 1;
    const ano = parseInt(req.query.ano) || new Date().getFullYear();

    const query = `
      SELECT
        categoria,
        SUM(preco) AS total
      FROM transacoes
      WHERE EXTRACT(MONTH FROM data) = $1
        AND EXTRACT(YEAR  FROM data) = $2
      GROUP BY categoria
      ORDER BY categoria;
    `;

    const result = await db.query(query, [mes, ano]);

    // Cores predefinidas para categorias
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
    const dados = result.rows.map((row, idx) => ({
      categoria: row.categoria,
      total: Number(row.total),
      cor: colors[idx % colors.length]
    }));

    res.json(dados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Não foi possível gerar resumo por categoria' });
  }
};