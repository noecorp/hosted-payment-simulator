import express from 'express'
import _ from 'lodash'
import crypto from 'crypto'

const secret = process.env.SECRET;

const app = express();
app.set('view engine', 'ejs');

function sign(toSign) {
    const hash = crypto.createHmac('sha256', secret)
        .update(toSign)
        .digest('hex');

    return hash;
}

function getSignature({ amount, transactionId, status }) {
    const toSign = `${status}|${transactionId}`;

    return sign(toSign);
}

function validateParams({ amount, transactionId, reference }, signature) {
    const toSign = `${amount}|${reference}|${transactionId}`;

    return sign(toSign) === signature;
}

app.get('/', (req, res) => {
    const { amount, reference, transactionId, signature, redirectUrl } = req.query;
    const status = validateParams({ amount, reference, transactionId }, signature) ?
        'valid' :
        `Signature ${signature} was is not valid for amount: ${amount}, reference: ${reference} and transactionId: ${transactionId}`;

    let successUrl, failUrl;
    if (status === 'valid') {
        const successStatus = 'success';
        const successSignature = getSignature({ amount, transactionId, status: successStatus });
        successUrl = `${redirectUrl}?transactionId=${transactionId}&status=${successStatus}&signature=${successSignature}`;

        const failStatus = 'fail';
        const error = 'Some random error';
        const failSignature = getSignature({ amount, transactionId, status: failStatus });
        failUrl = `${redirectUrl}?transactionId=${transactionId}&status=${failStatus}&amount=${amount}&signature=${failSignature}&error=${error}`;
    }

    res.render('pages/index', { successUrl, failUrl, status, amount, reference });
});

const port = Number(process.env.PORT || 3031);
app.listen(port, () => console.log(`App is ready! Listening on port ${port}.`));
