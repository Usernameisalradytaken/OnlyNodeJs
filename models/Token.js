const passwordHash = require("../services/passwordHash");
const validate = require("../services/validator");
// 30 mins
const tokenLifeTime = 1000 * 60 *30;
class Token {
  fromObject({ email, password }) {
    this.email = validate.email(email);
    this.hashpassword = passwordHash(validate.password(password));
    // token id
    this.id = Math.floor(Math.random() * 10000000000);
    this.expires = Date.now() + tokenLifeTime;
    this.createdAt = Date.now();
    return this;
  }
  fromSnapshot({ id, hashpassword, email, expires, createdAt }) {
    this.id = id;
    this.hashpassword = hashpassword;
    this.email = email;
    this.expires = expires;
    this.createdAt = Date.now();
    return this;
  }
  isValid() {
    return this.email && this.hashpassword && this.expires && this.id && this.createdAt;
  }
  isExpired() {
    return this.expires < Date.now() ;
  }
  toObject() {
    return {
      id: this.id,
      email: this.email,
      expires: this.expires,
      createdAt : this.createdAt
    };
  }
}

module.exports = Token;
