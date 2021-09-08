const knex = require("knex");

class Contenedor {
  constructor(config, tabla) {
    this.db = knex(config);
    this.tabla = tabla;
  }

  async getAll() {
    try {
      const savedProducts = await this.db.from(this.tabla).select();
      const products = [];
      savedProducts.map((product) => {
        products.push({
          title: product.title,
          precio: product.precio,
          thumbnail: product.thumbnail,
        });
      });
      return products;
    } catch (error) {
      return [];
    }
  }

  async save(product) {
    try {
      await this.db.from(this.tabla).insert(product);
      const maxId = this.db.from(this.tabla).max("id");
      return maxId;
    } catch (e) {
      console.error(e);
      throw new Error();
    }
  }

  async getById(number) {
    try {
      const productIdObj = await this.db
        .from(this.tabla)
        .select()
        .where(`id`, number);
      if (productIdObj == undefined || productIdObj.length == 0) {
        return null;
      }
      return productIdObj;
    } catch (error) {
      return null;
    }
  }

  async modify(id, product) {
    try {
      const erasedProduct = await this.getById(id);
      if (erasedProduct == null) {
        return null;
      } else {
        await this.db.from(this.tabla).update(product).where("id", id);
        return true;
      }
    } catch (e) {
      return null;
    }
  }

  async getByPosition(number) {
    try {
      const productIdObj = await this.db.raw(
        `SELECT * FROM ${this.tabla} LIMIT ${number},1`
      );
      if (productIdObj == undefined) {
        return null;
      }
      return productIdObj;
    } catch (error) {
      return null;
    }
  }

  async deleteAll() {
    try {
      await this.db.from(this.tabla).del();
    } catch (e) {
      throw new Error();
    }
  }

  async deleteById(number) {
    try {
      const erasedProductsObj = await this.getById(number);
      await this.db.from(this.tabla).del().where("id", number);

      if (erasedProductsObj != null) {
        return true;
      }

      return null;
    } catch (e) {
      return null;
    }
  }
}

class Producto {
  constructor(title, price, thumbnail) {
    this.title = title;
    this.price = price;
    this.thumbnail = thumbnail;
  }
}

module.exports = {
  Contenedor,
  Producto,
};

