import {createHmac} from 'crypto';

export const createRequestSignature = (req) => {
    const hmac = createHmac('sha256', process.env.REACT_APP_SIGNING_SECRET)
    return hmac.update(req).digest('hex');
}

