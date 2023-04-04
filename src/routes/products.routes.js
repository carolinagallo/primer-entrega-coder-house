import { Router } from "express";
import ProductManager from "../model/product.js";
import { uploader } from "../utils.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  const productos = await productManager.getProducts();
  const limit = req.query.limit;
  if (limit && limit > 0) {
    return res.send(productos.slice(0, limit));
  }
  res.send(productos);
});

router.get("/:pid", async (req, res) => {
  const id = Number(req.params.pid);
  const productId = await productManager.getProductById(id);
  if (!productId) return res.status(404).send("Product no exist");
  res.send(productId);
});

router.post("/add", uploader.single("file"), async (req, res) => {
  //Los datos del producto fueron pasados por form-data.
  try {
    if (!req.file) {
      return res
        .status(400)
        .send({ status: "error", error: "Could not save image" });
    }
    const data = req.body;
    if (!data) return res.status(404).send("No product");
    const img = `http://localhost:8084/${req.file.path.replace("public/", "")}`;
    await productManager.loadData();
    data.thumbnail = img;
    const product = await productManager.addProduct(data);
    res.send(product);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

router.put("/update/:pid", async (req, res) => {
  const id = Number(req.params.pid);
  const data = req.body;
  await productManager.loadData();
  const product = await productManager.updateProduct(data, id);
  if (!data) return res.status(404).send("No product");
  res.send(product);
});

router.delete("/delete/:pid", async (req, res) => {
  const id = Number(req.params.pid);
  await productManager.loadData();
  await productManager.deleteProduct(id);
  if (id < 0) return res.status(404).send("Product no exist");
  res.send("Delete product");
});

export default router;
