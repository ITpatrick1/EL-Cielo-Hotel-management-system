class User {
  constructor(id, username, email, password, role = 'customer') {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password; // Should be hashed
    this.role = role; // 'admin' or 'customer'
    this.createdAt = new Date();
  }

  toJSON() {
    // Remove password from JSON representation
    const { password, ...user } = this;
    return user;
  }
}

module.exports = User;
