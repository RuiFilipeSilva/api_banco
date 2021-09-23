//Começar servidor - node index

const Hapi = require('@hapi/hapi');
let routesUsers = require('./routes/users')
let routesTransitions = require('./routes/transitions');
const hapiAuthJwt2 = require('hapi-auth-jwt2');
const {
    verify
} = require('crypto');


const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
        cors: true
    }
});

exports.init = async () => {
    await server.initialize();
    return server;
};


const start = async () => {
    await server.register(hapiAuthJwt2); //registar plugin
    //Irá fazer a Verificação do token para ver se ainda é válido, caso não seja retorna códio 401-Unauthorized
    server.auth.strategy('jwt', 'jwt', {
        key: 'banco',
        validate: function () {
            return {
                isValid: true
            }
        },
        verifyOptions: {
            algorithms: 'HS256'
        }
    });
    //Todas as rotas que forem criadas automáticamente têm que ter a verificação do token
    server.auth.default('jwt')
    //Chama as várias rotas criadas.
    server.route(routesUsers)
    server.route(routesTransitions)

    //COMENTAR ESTE BLOCO PARA CORRER OS TESTE
    await server.start();
    console.log('Server runniong on %s', server.info.uri)
    return server
};



process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1)
})

start();