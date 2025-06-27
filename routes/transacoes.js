const express = require ('express');
const router = express.Router();
const transacoesController = require('../controllers/transacoesController');


router.post('/', transacoesController.criarTransacao)
router.get('/', transacoesController.listarTransacao)


module.exports = router