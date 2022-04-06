const passwordHash = require("../services/passwordHash");
const validator = require("../services/validator");

class User {
  // creating the user from olduser so not need for validation
  // for using it to update the user
  formSnapshot({
    username,
    hashpassword,
    streetaddress,
    address,
    email,
    orders,
  }) {
    this.username = username;
    this.email = email;
    this.address = address;
    this.streetaddress = streetaddress;
    this.hashpassword = hashpassword;
    this.orders = orders;

    return this;
  }
  // to create new user
  fromObject({ username, password, streetaddress, address, email }) {
    this.username = validator.username(username);
    this.email = validator.email(email);
    this.address = validator.address(address);
    this.streetaddress = validator.address(streetaddress);
    this.hashpassword = passwordHash(validator.password(password));
    this.orders = [];

    return this;
  }
  /// to validate
  isvalid() {
    return (
      this.username &&
      this.address &&
      this.streetaddress &&
      this.email &&
      this.hashpassword
    );
  }
  // to update the details of user
  updateUser({ username, address, streetaddress, password }) {
    const name1 = validator.username(username);
    const address1 = validator.address(address);
    const address2 = validator.address(streetaddress);
    const hashpassword = passwordHash(validator.password(password));

    if (name1) this.username = name1;
    if (address1) this.address = address1;
    if (address2) this.streetaddress = address2;
    if (hashpassword) this.hashpassword = hashpassword;
  }

  toObject() {
    return {
      name: this.username,
      address: this.address,
      streetaddress: this.streetaddress,
      email: this.email,
      order: this.order,
    };
  }
}

module.exports = User;
