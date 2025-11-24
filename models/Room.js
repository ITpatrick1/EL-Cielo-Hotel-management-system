class Room {
  constructor(id, number, type, price, available = true) {
    this.id = id;
    this.number = number;
    this.type = type;
    this.price = price;
    this.available = available;
  }
}

module.exports = Room;
