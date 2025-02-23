const express = require('express');
const router = express.Router();

// Retorna todos os produtos
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Retorna os produtos'
    });
});

// Insere um produto
router.post('/', (req, res, next) => {
    const produto = {
        nome: req.body.nome,
        preco: req.body.preco
    }

    res.status(201).send({
        mensagem: 'Insere um produto', 
        produtoCriado: produto
    });
});

// Retorna os dados de um produto especifico
router.get('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto;

    if (id === 'especial') {
        res.status(200).send({
            mensagem: 'Voce descobriu o id especial',
            id: id
        });
    } else {
        res.status(200).send({
            mensagem: 'Voce passou um ID'
        })
    }
});

// Altera um produto especifico
router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Produto atualizado'
    });
});

// Deleta um produto
router.delete('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Produto excluido'
    });
});

module.exports = router;
