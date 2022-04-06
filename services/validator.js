const validator = {};
validator.username = (username) => {
  return typeof username == "string" &&
    username.trim().length &&
    /^[A-Za-z\s]+$/.test(username.trim())
    ? username.trim()
    : null;
};

validator.password = (password) => {
  return typeof password == "string" &&
    password.trim().length &&
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password)
    ? password
    : null;
};

validator.email = (email) => {
  return typeof email == "string" &&
    email.trim().length &&
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
      email
    )
    ? email.trim()
    : null;
};

validator.address = (address) => {
  return typeof address == "string" &&
    address.trim().length &&
    /[\sa-zA-Z\n0-9]{5,250}/.test(address.trim())
    ? address.trim()
    : null;
};

module.exports = validator