import { Router } from "express";
import CartManager from "../model/carts.js";
import ProductManager from "../model/product.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
  const { products } = req.body;

  await cartManager.loadData();
  await productManager.loadData();

  for (const product of products) {
    const existProduct = await productManager.getProductById(
      Number(product.id)
    );
    if (!existProduct)
      return res.status(404).send(`Product no exist id: ${product.id}`);
  }

  await cartManager.addCart(products);
  res.status(202).send("Cart created successfully");
});

router.get("/:cid", async (req, res) => {
  const id = Number(req.params.cid);
  const cartId = await cartManager.getCartById(id);
  if (!cartId) return res.status(404).send("Cart no exist");
  res.send(cartId);
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cid = Number(req.params.cid);
  const pid = Number(req.params.pid);
  const cartId = await cartManager.getCartById(cid);
  if (!cartId) return res.status(404).send("Cart no exist");

  const productCart = cartId.products.find((product) => product?.id === pid);

  if (!productCart) {
    const validateProduct = await productManager.getProductById(pid);
    if (!validateProduct) return res.status(404).send("Product no exist");
    cartId.products.push({ id: pid, quantity: 1 });
  } else {
    const newProductCart = cartId.products.map((item) => {
      if (item.id === pid) {
        item.quantity++;
      }
      return item;
    });

    cartId.products = newProductCart;
  }

  await cartManager.loadData();
  await cartManager.updateCart(cartId);
  res.send(cartId);
});

export default router;
