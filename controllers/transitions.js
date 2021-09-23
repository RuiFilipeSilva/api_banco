const fs = require('fs');
const util = require('util');
// Convert fs.readFile, fs.writeFile into Promise version of same
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
async function getMoneyUser(req, res) {
    let conta = req.params.conta //nºconta passado por parametro
    console.log(conta)
    let users = await readFile('./database/db.json', 'utf8');
    users = JSON.parse(users)
    //procura o utilizador com o numero da conta
    let user = users.find(user => user.conta == conta)
    console.log(user)
    return res.response({
        message: user.valor
    }).code(200)
}
async function addMoney(req, res) {
    let data = req.payload //dados passados no formulário
    let value = +data.value //tornar o valor introduzido num number
    let conta = req.params.conta //nº conta passado por parametro
    //ler db
    let users = await readFile('./database/db.json', 'utf8');
    users = JSON.parse(users)
    //Procurar o número da conta
    users.find(user => {
        if (user.conta == conta) {
            //somar valor à conta
            user.valor = user.valor + value
        }
    })
    //Reescrevemos o ficheiro com os novos valores
    await writeFile('./database/db.json', JSON.stringify(users, null, 2), 'utf8')
    return res.response({
        success: true,
        message: `Foram adicionados ${data.value}€ à sua conta`
    }).code(200)
}

async function payments(req, res) {
    let data = req.payload
    let value = +data.value //tornar o valor introduzido num number
    let conta = req.params.conta
    let users = await readFile('./database/db.json', 'utf8');
    users = JSON.parse(users)
    //Procurar o user pelo número da conta
    let user = users.find(user => user.conta == conta)
    //Verificar se têm saldo suficiente para efetuar o pagamento
    if (user.valor > value) {
        //reduzir valor à conta
        user.valor = user.valor - value
        //Reescrevemos o ficheiro com os novos valores
        await writeFile('./database/db.json', JSON.stringify(users, null, 2), 'utf8')
        return res.response({
            success: true,
            message: `Foram retirados ${data.value}€ à sua conta`
        }).code(200)
    } else {
        return res.response({
            message: `Não possui montante suficiente para a transação`
        }).code(400)
    }

}

//Função para fazer transferências entre contas
async function transactions(req, res) {
    //dados passados no formulário
    let data = req.payload
    console.log(data.value)
    //passa o valor para number
    let value = +data.value
    //número da conta passado por parâmetro
    let conta = req.params.conta
    console.log(conta)
    let users = await readFile('./database/db.json', 'utf8')
    users = JSON.parse(users)
    //procura no array de users se o beneficiario e o remetente existem
    let recipient = users.find(recipient => recipient.conta == data.conta)
    let sender = users.find(sender => sender.conta == conta)
    console.log(recipient, sender)
    if (recipient != undefined && sender != undefined) {
        //Verificação se o valor que existe na conta é superior ao valor a transferir
        if (sender.valor >= value) {
            recipient.valor = recipient.valor + value //Adição do valor ao beneficiario
            sender.valor = sender.valor - value //Subtração do valor ao remetente
            //Reescrevemos o ficheiro com os novos valores
            await writeFile('./database/db.json', JSON.stringify(users, null, 2), 'utf8')
            return res.response({
                success: true,
                message: `Foram transferido ${data.value}€ para o/a cliente ${recipient.name}`
            }).code(200)
        } else {
            //caso não possua dinheiro suficiente para a operação retorna uma mensagem a informar
            return res.response({
                message: `Não possui montante suficiente para a transação`
            }).code(400)
        }
    } else {
        //caso não encontre o beneficiário retorna uma mensagem a informar
        return res.response({
            message: `Não foi encontrado beneficiario`
        }).code(400)
    }

}
module.exports = {
    getMoneyUser: getMoneyUser,
    addMoney: addMoney,
    payments: payments,
    transactions: transactions
}