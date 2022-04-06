const crypto = require("crypto")


/// change the secret key
const passwordHash = (password) => {
    if(typeof password == 'string' && password.trim().length){
        const hmac = crypto.createHmac("sha512", "THisisAsecret")
        const HashedPassword = hmac.update(password).digest('hex')
        return HashedPassword;
    }
    else   
        return null
}

module.exports = passwordHash