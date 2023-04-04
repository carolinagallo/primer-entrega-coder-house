import fs from "fs/promises";

class ProductManager {
  products = [];
  static id = 1;

  constructor() {
    this.path = "./data/products.json";
  }

  async loadData() {
    this.products = await this.getProducts();
    ProductManager.id = this.products.length;
  }

  async getProducts() {
    try {
      const products = await fs.readFile(this.path, "utf-8");
      if (products) return JSON.parse(products);
    } catch (error) {
      console.log(`El archivo ${this.path} no existe, creando...`);
      await fs.writeFile(this.path, "[]");
      return [];
    }
  }

  async addProduct(newProduct) {
    const codeExist = this.products.find(
      (product) => product?.code === newProduct.code
    );

    if (codeExist) throw Error("This code exist");

    if (!newProduct.title || newProduct.title.trim().length === 0)
      throw Error("Empty title field");

    if (!newProduct.description || newProduct.description.trim().length === 0)
      throw Error("Empty description field");

    if (!newProduct.price) throw Error("Empty price field");

    if (!newProduct.thumbnail || newProduct.thumbnail.trim().length === 0)
      throw Error("Empty thumbnail field");

    if (!newProduct.code || newProduct.code.trim().length === 0)
      throw Error("Empty code field");

    if (!newProduct.stock) throw Error("Empty stock field");

    if (!newProduct.category || newProduct.category.trim().length === 0)
      throw Error("Empty category field");

    this.products.push({
      ...newProduct,
      status: true,
      id: ProductManager.id++,
    });

    await fs.writeFile(this.path, JSON.stringify(this.products));
  }

  async getProductById(idProduct) {
    try {
      const products = await fs.readFile(this.path, "utf-8");
      const productsParsed = JSON.parse(products);
      const productExist = productsParsed.find(
        (product) => product?.id === idProduct
      );
      return productExist;
    } catch (error) {
      console.log(error);
      throw new Error("This product no exist");
    }
  }

  async updateProduct(productChange, id) {
    const product = await this.getProductById(id);
    if (!product) throw new Error("This product no exist");

    const {
      title,
      description,
      thumbnail,
      price,
      code,
      stock,
      category,
      status,
    } = productChange;

    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = price;
    if (thumbnail) product.thumbnail = thumbnail;
    if (code) product.code = code;
    if (stock) product.stock = stock;
    if (category) product.category = category;
    if (status) product.status = status;

    this.products[product.id] = product;

    await fs.writeFile(this.path, JSON.stringify(this.products));
    return product;
  }

  async deleteProduct(id) {
    delete this.products[id];
    await fs.writeFile(this.path, JSON.stringify(this.products));
  }
}

export default ProductManager;
