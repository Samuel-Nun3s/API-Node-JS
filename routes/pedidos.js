const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// Retorna todos os pedidos
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) };

        conn.query(
            'SELECT * FROM pedidos',
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) };

                const response = {
                    quantidade: result.length,
                    pedidos: result.map(ped => {
                        return {
                            id_pedido: ped.id_pedidos,
                            quantidade: ped.quantidade,
                            id_produto: ped.id_produto,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna detalhes de um pedido especifico',
                                url: 'http://localhost:3000/produtos/' + ped.id_pedidos
                            }
                        }
                    })
                };

                return res.status(200).send(response);
            }
        )
    });
});

// Insere um produto
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) };

        conn.query(
            'SELECT * FROM produtos WHERE id_produtos = ?;',
            [req.body.id_produto],
            (error, result, field) => {
                if (error) { return res.status(500).send({ error: error }) }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Produto nao encontrado'
                    })
                }

                conn.query(
                    'INSERT INTO pedidos (quantidade, id_produto) VALUES (?,?);',
                    [req.body.quantidade, req.body.id_produto],
                    (error, result, fields) => {
                        conn.release();
        
                        if (error) { return res.status(500).send({ error: error }) };
        
                        const response = {
                            mensagem: 'Pedido adicionado com sucesso',
                            pedidoCriado: {
                                id_pedido: result.id_pedidos,
                                quantidade: req.body.quantidade,
                                id_produto: req.body.id_produto,
                                request: {
                                    tipo: 'GET',
                                    descricao: 'Coleta todos os pedidos',
                                    url: 'http://localhost:3000/pedidos'
                                }
                            }
                        }
                        
                        return res.status(201).send(response);
                    }
                )
            }
        )
    });
});

// Retorna os dados de um pedido especifico
router.get('/:id_pedido', (req, res, next) => {
    const id = req.params.id_produto;
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) };
        conn.query(
            'SELECT * FROM pedidos WHERE id_pedidos = ?;',
            [req.params.id_pedido],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) };

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Nao foi encontrado nenhum pedido com esse ID'
                    })
                }

                const response = {
                    pedido: {
                        id_pedido: result[0].id_pedidos,
                        quantidade: result[0].quantidade,
                        id_produto: result[0].id_produto,
                        request: {
                            tipo: 'POST',
                            descricao: 'Insere um novo pedido',
                            url: 'https://localhost:3000/pedidos'
                        }
                    }
                }

                return res.status(200).send(response);
            }
        )
    });
});

// Deleta um pedido
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) };
        conn.query(
            'DELETE FROM pedidos WHERE id_pedidos = ?;',
            [req.body.id_pedido],
            (error, result, fields) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error }) };

                const response = {
                    mensagem: 'Pedido cancelado com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um produto',
                        url: 'http://localhost:3000/produtos',
                        body: {
                            quantidade: 'Number',
                            id_produto: 'Number'
                        }
                    }
                }

                res.status(202).send(response);
            }
        )
    });
});

module.exports = router;
