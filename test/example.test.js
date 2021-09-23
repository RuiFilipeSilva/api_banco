'use strict';
//Para iniciar o teste - npm test
let tokenValid
let tokenInvalid = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250YSI6OSwibmFtZSI6IlRlc3RlIFNpbHZhIiwiZW1haWwiOiJ0ZXN0ZUB0ZXN0ZS5jb20iLCJpYXQiOjE2MzIyMzIwNzQsImV4cCI6MTYzMjIzNTY3NH0.VqlinKrAKnPLBlkAWeZGxShxLtN6zIzLlI19wS626wk'
const Lab = require('@hapi/lab');
const {
    expect
} = require('@hapi/code');
const {
    afterEach,
    beforeEach,
    describe,
    it
} = exports.lab = Lab.script();
const {
    init
} = require('../index');

describe('GET /', () => {
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });

    it('Retorna o código 200', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/'
        });
        expect(res.statusCode).to.equal(200);
    });
});


// Testar rota /login
describe('POST /login', () => {
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });

    it('Retorna o código 200 - Login com sucesso', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/login',
            payload: {
                email: 'teste@email.com',
                password: '123'
            }
        });
        tokenValid = res.result.token
        expect(res.statusCode).to.equal(200);
    });
    it('Retorna o código 400 - Utilizador não encontrado', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/login',
            payload: {
                email: 'testeteste@email.com',
                password: '123'
            }
        });
        expect(res.statusCode).to.equal(400);
    });
    it('Retorna o código 400 - Password incorreta', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/login',
            payload: {
                email: 'teste@email.com',
                password: '1234'
            }
        });
        expect(res.statusCode).to.equal(400);
    });
});

//Testar rota /register
describe('POST /register', () => {
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });

    it('Retorna o código 400 - Passwords não coincidem', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/register',
            payload: {
                email: 'teste2@email.com',
                user: 'Teste',
                password: '123',
                confPassword: '1234'
            }
        });
        expect(res.statusCode).to.equal(400);
    });
    it('Retorna o código 200 - Registo com sucesso', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/register',
            payload: {
                email: 'teste2@email.com',
                user: 'Teste',
                password: '123',
                confPassword: '123'
            }
        });
        expect(res.statusCode).to.equal(200);
    });
    it('Retorna o código 400 - Utilizador já existe', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/register',
            payload: {
                email: 'teste2@email.com',
                user: 'Teste',
                password: '123',
                confPassword: '123'
            }
        });
        expect(res.statusCode).to.equal(400);
    });
});



//ROTAS TRANSITIONS
// Testar rota /transitions/value
describe('GET /transitions/value', () => {
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });
    it('Responde o código 200 - Obter valor do utilizador', async () => {
        //Passamos um token inválido
        const res = await server.inject({
            method: 'get',
            url: `/transitions/value/${1}`,
            headers: {
                'authorization': 'Bearer ' + tokenValid
            }
        });
        expect(res.statusCode).to.equal(200);
    });
    it('Responde o código 401 - Não autorizado', async () => {
        //Não passamos token
        const res = await server.inject({
            method: 'get',
            url: `/transitions/value/${1}`
        });
        expect(res.statusCode).to.equal(401);
    });
    it('Responde o código 401 - Token expirado', async () => {
        //Passamos um token inválido
        const res = await server.inject({
            method: 'get',
            url: `/transitions/value/${1}`,
            headers: {
                'authorization': 'Bearer ' + tokenInvalid
            }
        });
        expect(res.statusCode).to.equal(401);
    });
});

// Testar rota /transitions/add
describe('PUT /transitions/add', () => {
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });
    it('Responde o código 200 - Adicionado dinheiro à conta', async () => {
        //Passamos um token inválido
        const res = await server.inject({
            method: 'put',
            url: `/transitions/add/${1}`,
            payload: {
                value: 200
            },
            headers: {
                'authorization': 'Bearer ' + tokenValid
            }
        });
        expect(res.statusCode).to.equal(200);
    });
    it('Responde o código 401 - Não autorizado', async () => {
        //Não passamos token
        const res = await server.inject({
            method: 'put',
            url: `/transitions/add/${1}`,
            payload: {
                value: 200
            }
        });
        expect(res.statusCode).to.equal(401);
    });
    it('Responde o código 401 - Token expirado', async () => {
        //Passamos um token inválido
        const res = await server.inject({
            method: 'put',
            url: `/transitions/add/${1}`,
            payload: {
                value: 200
            },
            headers: {
                'authorization': 'Bearer ' + tokenInvalid
            }
        });
        expect(res.statusCode).to.equal(401);
    });
});

// Testar rota /transitions/payments
describe('PUT /transitions/payments', () => {
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });
    it('Responde o código 200 - Pagamento com sucesso', async () => {
        //Passamos um token inválido
        const res = await server.inject({
            method: 'put',
            url: `/transitions/payments/${1}`,
            payload: {
                value: 200
            },
            headers: {
                'authorization': 'Bearer ' + tokenValid
            }
        });
        expect(res.statusCode).to.equal(200);
    });
    it('Responde o código 400 - Dinheiro insuficiente', async () => {
        //Passamos um token inválido
        const res = await server.inject({
            method: 'put',
            url: `/transitions/payments/${1}`,
            payload: {
                value: 5000
            },
            headers: {
                'authorization': 'Bearer ' + tokenValid
            }
        });
        expect(res.statusCode).to.equal(400);
    });
    it('Responde o código 401 - Não autorizado', async () => {
        //Não passamos token
        const res = await server.inject({
            method: 'put',
            url: `/transitions/payments/${1}`,
            payload: {
                value: 200
            }
        });
        expect(res.statusCode).to.equal(401);
    });
    it('Responde o código 401 - Token expirado', async () => {
        //Passamos um token inválido
        const res = await server.inject({
            method: 'put',
            url: `/transitions/payments/${1}`,
            payload: {
                value: 200
            },
            headers: {
                'authorization': 'Bearer ' + tokenInvalid
            }
        });
        expect(res.statusCode).to.equal(401);
    });
});

// Testar rota /transitions/transactions
describe('PUT /transitions/transactions', () => {
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });
    it('Responde o código 200 - Transferência feita com sucesso', async () => {
        //Passamos um token inválido
        const res = await server.inject({
            method: 'put',
            url: `/transitions/transactions/${1}`,
            payload: {
                value: 200,
                conta: 2
            },
            headers: {
                'authorization': 'Bearer ' + tokenValid
            }
        });
        expect(res.statusCode).to.equal(200);
    });
    it('Responde o código 400 - Dinheiro insuficiente', async () => {
        //Passamos um token inválido
        const res = await server.inject({
            method: 'put',
            url: `/transitions/transactions/${1}`,
            payload: {
                value: 5000,
                conta: 2
            },
            headers: {
                'authorization': 'Bearer ' + tokenValid
            }
        });
        expect(res.statusCode).to.equal(400);
    });
    it('Responde o código 400 - Beneficiário não encontrado', async () => {
        //Passamos um token inválido
        const res = await server.inject({
            method: 'put',
            url: `/transitions/transactions/${1}`,
            payload: {
                value: 5000,
                conta: 2
            },
            headers: {
                'authorization': 'Bearer ' + tokenValid
            }
        });
        expect(res.statusCode).to.equal(400);
    });
    it('Responde o código 401 - Não autorizado', async () => {
        //Não passamos token
        const res = await server.inject({
            method: 'put',
            url: `/transitions/transactions/${1}`,
            payload: {
                value: 200,
                conta: 2
            }
        });
        expect(res.statusCode).to.equal(401);
    });
    it('Responde o código 401 - Token expirado', async () => {
        //Passamos um token inválido
        const res = await server.inject({
            method: 'put',
            url: `/transitions/transactions/${1}`,
            payload: {
                value: 200,
                conta: 2
            },
            headers: {
                'authorization': 'Bearer ' + tokenInvalid
            }
        });
        expect(res.statusCode).to.equal(401);
    });
});