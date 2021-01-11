const jwt = require('jsonwebtoken');

const generateJWT = (uid) => {

    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign(payload, process.env.JWT_KEY, {
            expiresIn: '24h',
        }, (err, token) => {
            if (err) {
                //no se pudo crear el token
                reject('can´t generate the token');
            } else {
                //TOKEN:
                resolve(token);
            }
        })
    });
}

module.exports = {
    generateJWT
}