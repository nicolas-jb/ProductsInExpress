const faker = require("faker");
faker.locale = 'es'

function generateFakeProducts() {
  const productosFake = [];

  for (let index = 0; index < 5; index++) {
    productosFake.push({
      title: faker.commerce.product(),
      precio: faker.commerce.price(),
      thumbnail: faker.image.imageUrl(),
    });
  }
  return productosFake;
}


module.exports = {generateFakeProducts}