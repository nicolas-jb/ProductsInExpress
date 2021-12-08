const faker = require("faker");
faker.locale = "es";

function generateFakeProducts() {
  return {
    title: faker.commerce.product(),
    price: faker.commerce.price(),
    thumbnail: faker.image.avatar(),
  };
}

module.exports = { generateFakeProducts };
