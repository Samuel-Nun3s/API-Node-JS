const express = require('express');
const router = express.Router();

// Retorna todos os pedidos
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Retorna os pedidos'
    });
});

// Insere um produto
router.post('/', (req, res, next) => {
    const pedido = {
        id_produto: req.body.id_produto,
        quantidade: req.body.quantidade
    }

    res.status(201).send({
        mensagem: 'O pedido foi criado',
        pedidoCriado: pedido
    });
});

// Retorna os dados de um pedido especifico
router.get('/:id_pedido', (req, res, next) => {
    const id = req.params.id_produto;
    res.status(200).send({
        mensagem: 'Detalhes do pedido',
        id_pedido: id
    });
});

// Deleta um pedido
router.delete('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Pedido excluido'
    });
});

module.exports = router;
