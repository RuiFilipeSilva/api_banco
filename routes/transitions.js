const transitions = require("../controllers/transitions")

module.exports = [{
        method: 'GET',
        path: '/transitions/value/{conta}',
        handler: transitions.getMoneyUser
    }, {
        method: 'PUT',
        path: '/transitions/add/{conta}',
        handler: transitions.addMoney
    },
    {
        method: 'PUT',
        path: '/transitions/payments/{conta}',
        handler: transitions.payments
    },
    {
        method: 'PUT',
        path: '/transitions/transactions/{conta}',
        handler: transitions.transactions
    },
]