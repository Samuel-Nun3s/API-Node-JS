const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// Retorna todos os produtos
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) };
        conn.query(
            'SELECT * FROM produtos;',
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) };

                return res.status(200).send({ response: resultado });
            }
        )
    })
});

// Insere um produto
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) };
        conn.query(
            'INSERT INTO produtos (nome, preco) VALUES (?,?);',
            [req.body.nome, req.body.preco],
            (error, resultado, fields) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error }) };

                res.status(201).send({
                    mensagem: 'produto inserido com sucesso', 
                    id_produto: resultado.insertId
                });
            }
        )
    });
});

// Retorna os dados de um produto especifico
router.get('/:id_produto', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) };
        conn.query(
            'SELECT * FROM produtos WHERE id_produtos = ?;',
            [req.params.id_produto],
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) };

                return res.status(200).send({ response: resultado });
            }
        )
    })
});

// Altera um produto especifico
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) };
        conn.query(
            `UPDATE produtos
                SET nome          = ?,
                    preco         = ?
                WHERE id_produtos = ?`,
            [
                req.body.nome,
                req.body.preco,
                req.body.id_produto
            ],
            (error, resultado, fields) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error }) };

                res.status(202).send({
                    mensagem: 'produto alterado com sucesso', 
                    id_produto: resultado.insertId
                });
            }
        )
    });
});

// Deleta um produto
router.delete('/', (req, res, next) => {
    // res.status(200).send({
    //     mensagem: 'Produto excluido'
    // });

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) };
        conn.query(
            `DELETE FROM produtos WHERE id_produtos = ?`, [req.body.id_produto],
            (error, resultado, fields) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error }) };

                res.status(202).send({
                    mensagem: 'produto excluido com sucesso', 
                    id_produto: resultado.insertId
                });
            }
        )
    });
});

module.exports = router;
