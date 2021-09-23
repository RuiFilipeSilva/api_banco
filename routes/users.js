const users = require("../controllers/users")

//As várias Rotas
module.exports = [{
        method: 'GET',
        path: "/",
        handler: users.getUsers,
        //Retira a verificação do token
        options: {
            auth: false
        }
    },
    {
        method: 'POST',
        path: "/register",
        handler: users.register,
        options: {
            auth: false
        }
    },
    {
        method: 'POST',
        path: "/login",
        handler: users.login,
        options: {
            auth: false
        }
    }

]