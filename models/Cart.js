const MenuItem = require("./MenuItem");

class Cart {
  constructor() {
    this.items = [];
    this.total = 0;
  }
  fromSnapshot({ items = [] }) {
    this.items = items.map((item) => new MenuItem(item));
    this.total = this.getTotal();
    return this;
  }
  getTotal() {
    let total = 0;
    this.items.forEach((menuItem) => {
      total += menuItem.price * menuItem.quantity;
    });
    return total;
  }
  updateCart(item) {
    
    const IsItem = this.items.find((citem) => {
      return citem.id === item.id;
    });
    if(IsItem  && item.quantity == 0){
      this.removeCart(item)
    }
    else if (IsItem)
      this.items.map((citem) => {
        if (citem.id === item.id) citem.quantity = item.quantity;
      });
    else {
      this.items.push(item);
    }

    this.total = this.getTotal();
  }
  removeCart(item) {
    this.items = this.items.filter((citem) => {
      return citem.id !== item.id;
    });
    this.total = this.getTotal();
  }
  toObject() {
    return {
      items: this.items,
      total: this.total,
    };
  }
}

module.exports = Cart;
