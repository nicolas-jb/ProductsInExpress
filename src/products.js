const fs = require("fs");

class Contenedor {
  maxIdSaved = 0;
  constructor(nombreArchivo) {
    this.ruta = `../../${nombreArchivo}.txt`;
  }
  async getAll() {
    try {
      const savedProducts = await fs.promises.readFile(this.ruta, "utf-8");
      return JSON.parse(savedProducts);
    } catch (error) {
      return [];
    }
  }

  async save(product) {
    try {
      const savedProducts = await this.getAll();
      if (this.maxIdSaved == 0) {
        if (savedProducts.length > 0) {
          this.maxIdSaved =
            Math.max.apply(
              null,
              savedProducts.map((product) => product.id)
            ) + 1;
        } else {
          this.maxIdSaved++;
        }
      } else {
        this.maxIdSaved++;
      }

      const newProduct = {
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        id: this.maxIdSaved,
      };

      savedProducts.push(newProduct);

      await fs.promises.writeFile(
        this.ruta,
        JSON.stringify(savedProducts, null, 2)
      );

      return this.maxIdSaved;
    } catch (e) {
      console.error(e);
      throw new Error();
    }
  }

  async getById(number) {
    try {
      const savedProductsObj = await this.getAll();
      const productIdObj = savedProductsObj.filter(function (sp) {
        return parseInt(sp.id) == number;
      })[0];
      if (productIdObj == undefined) {
        return null;
      }
      return productIdObj;
    } catch (error) {
      return null;
    }
  }

  async modify(id, product) {
    try {
      const erasedProduct = await this.deleteById(id);
      if (erasedProduct == null) {
        return null;
      } else {
        const newProduct = {
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          id: id,
        };

        const savedProducts = await this.getAll();
        savedProducts.push(newProduct);

        await fs.promises.writeFile(
          this.ruta,
          JSON.stringify(savedProducts, null, 2)
        );

        return true;
      }
    } catch (e) {
      return null;
    }
  }

  async getByPosition(number) {
    try {
      const savedProductsObj = await this.getAll();
      if (savedProductsObj.length <= number) {
        return null;
      } else {
        return savedProductsObj[number];
      }
    } catch (error) {
      return null;
    }
  }

  async deleteAll() {
    try {
      await fs.promises.writeFile(this.ruta, "");
    } catch (e) {
      throw new Error();
    }
  }

  async deleteById(number) {
    try {
      const savedProductsObj = await this.getAll();
      const erasedProductsObj = await this.getById(number);
      const actualProducts = savedProductsObj.filter(function (sp) {
        return parseInt(sp.id) != number;
      });

      if (erasedProductsObj != null) {
        await fs.promises.writeFile(
          this.ruta,
          JSON.stringify(actualProducts, null, 2)
        );
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
