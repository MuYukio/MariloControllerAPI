const express = require('express');
const router = express.Router();

const transacoesRoutes = require('./transacoes');

router.use('/transacoes', transacoesRoutes);

module.exports = router;