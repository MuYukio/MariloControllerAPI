const express = require ('express');
const router = express.Router();
const tc      = require('../controllers/transacoesController');

router.get('/resumo', tc.resumoMensal);

router.get('/',    tc.listarTransacao);
router.post('/',   tc.criarTransacao);

router.get('/resumo-por-categoria', tc.resumoPorCategoria);

module.exports = router