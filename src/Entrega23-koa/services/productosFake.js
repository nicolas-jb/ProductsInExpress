import faker from "faker";
faker.locale = "es";

export function generateFakeProducts() {
  return {
    title: faker.commerce.product(),
    price: faker.commerce.price(),
    thumbnail: faker.image.avatar(),
  };
}


