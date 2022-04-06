class Order {
  constructor() {
    this.id = Math.floor(Math.random() * 10000000000);
    this.items = [];
    this.amount = 0;
    this.email = "";
    this.date = Date.now();
  }
  isValid() {
    return this.id && this.items && this.amount && this.email && this.date;
  }
  fromSnapshot() {
    this.id = id;
    this.items = items;
    this.amount = amount;
    this.email = email;
    this.date = date;
    return this;
  }
}

module.exports = Order;
