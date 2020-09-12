const express = require('express');
const { uuid, isUuid } = require('uuidv4');

const port = 3000;

const app = express();
const accounts = [];

app.use(express.json());

function validateAccountId(request, response, next) {
    const { id } = request.params;

    if (!isUuid(id)) {
        return response.status(400).json({ error: 'Invalid account ID' })
    }

    return next();
}

app.use('/accounts/:id', validateAccountId);
app.use('/accounts/:id/deposit', validateAccountId);
app.use('/accounts/:id/withdrawal', validateAccountId);

app.get('/accounts', (_, response) => {
    return response.json(accounts);
});

app.post('/accounts', (request, response) => {
    const { id, name, balance } = request.body;

    const account = {
        id: uuid(),
        name,
        balance: 0,
    };
    /* object account created */

    accounts.push(account);

    return response.json(account);
});

app.put("/accounts/:id", (request, response) => {
    const { id } = request.params;
    const { name } = request.body;

    const accountIndex = accounts.findIndex(account => account.id === id);

    if (accountIndex === -1) {
        return response.status(400).json({ error: 'Account not found' })
    }

    const account = {
            id,
            name,
            balance: accounts[accountIndex].balance,
        }
        /* repositories[repositoryIndex].likes number of likes before edit */
    accounts[accountIndex] = account;

    return response.json(account);

});

app.post("/accounts/:id/deposit", (request, response) => {
    const { id } = request.params;
    const { deposit } = request.body;

    const findAccountIndex = accounts.findIndex(account => account.id === id);

    if (findAccountIndex === -1) {
        return response.status(400).json({ error: 'Account not found' })
    }

    accounts[findAccountIndex].balance += deposit;

    return response.json(accounts[findAccountIndex]);

});

app.post("/accounts/:id/withdrawal", (request, response) => {
    const { id } = request.params;
    const { withdrawal } = request.body;

    const findAccountIndex = accounts.findIndex(account => account.id === id);

    if (findAccountIndex === -1) {
        return response.status(400).json({ error: 'Account not found' })
    }

    accounts[findAccountIndex].balance -= withdrawal;

    return response.json(accounts[findAccountIndex]);

});

app.delete("/accounts/:id", (request, response) => {
    const { id } = request.params;

    const accountIndex = accounts.findIndex(account => account.id === id);

    if (accountIndex === -1) {
        return response.status(400).json({ error: 'Account not found' })
    }
    accounts.splice(accountIndex, 1);
    return response.status(204).send();
});

app.listen(port, () =>
    console.log(`App listening on port ${port}`)
)