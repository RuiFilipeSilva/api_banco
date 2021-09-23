const fs = require('fs');
const util = require('util');
// Convert fs.readFile, fs.writeFile into Promise version of same
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const jwt = require('jsonwebtoken')

async function getUsers(req, res) {
    const users = await readFile('./database/db.json', 'utf8');
    return res.response({
        users: users
    }).code(200)
}


//Registar utilizador
async function register(req, res) {
    const user = req.payload;
    console.log(user)
    let users = await readFile('./database/db.json', 'utf8');
    users = JSON.parse(users)
    //Verificar se o email já existe
    const checkEmail = users.find(x => x.email == user.email)

    if (checkEmail == undefined) {
        if (user.password == user.confPassword) {
            //só é viável fazer assim pois não iremos conseguir eliminar users caso contrário teriamos que verficar o numero da conta do ultimo elemnto do array
            user.conta = users.length + 1
            //Ao criar conta o valor inicial será sempre de 1000 eur
            user.valor = 1000
            //Adicionar novo elemento ao array users
            users.push(user)
            //reescrever novamente o ficheiro
            await writeFile('./database/db.json', JSON.stringify(users, null, 2), 'utf8')
            return res.response({
                success: true,
                message: `Conta criada com sucesso`
            }).code(200)
        } else {
            return res.response({
                message: `Passwords não coincidem`
            }).code(400)
        }
    } else {
        return res.response({
            message: `Email já existente`
        }).code(400)
    }
}

async function login(req, res) {
    const user = req.payload
    let users = await readFile('./database/db.json', 'utf8');
    users = JSON.parse(users)

    //Utilizar propriedade .find para verificarmos se o utilizador existe
    const getUser = users.find(registed => registed.email == user.email)
    //Caso exista verificamos a password
    if (getUser != undefined && getUser.password == user.password) {
        //gerar token, onde possui o nº conta, nome e mail do utilizador com duração de uma hora
        let jwtoken = jwt.sign({
            //dados que são passados no token
            conta: getUser.conta,
            name: getUser.name,
        }, 'banco', {
            expiresIn: '1h'
        })
        //Retorna-nos o token criado
        return res.response({
            token: jwtoken,
            message: `Bem vindo ${getUser.name}`
        }).code(200)
    } else {
        return res.response({
            message: `Dados Incorretos`
        }).code(400)
    }
}
module.exports = {
    getUsers: getUsers,
    register: register,
    login: login
}