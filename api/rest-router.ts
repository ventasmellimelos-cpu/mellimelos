import { Hono } from "hono";
import {
  getProducts, getProductById, createProduct, updateProduct, deleteProduct,
  getVariantsByProductId, createVariants, deleteVariantsByProductId,
  getOrders, createOrder, updateOrderStatus,
  getUploadById, createUpload,
  seedIfEmpty,
} from "./json-store";

// Seed on first load
try { seedIfEmpty(); } catch (e) { console.error("Seed error:", e); }

const restApi = new Hono();

// PRODUCTS
restApi.get("/products", (c) => {
  let items = getProducts();
  const search = c.req.query("search");
  const category = c.req.query("category");

  if (category) items = items.filter((p) => p.category === category);
  if (search) items = items.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  // Add variants to each product
  const withVariants = items.map((p) => ({
    ...p,
    variants: getVariantsByProductId(p.id),
  }));

  return c.json({ items: withVariants, total: items.length });
});

restApi.get("/products/:id", (c) => {
  const id = parseInt(c.req.param("id"));
  const product = getProductById(id);
  if (!product) return c.json({ error: "Not found" }, 404);
  return c.json({ ...product, variants: getVariantsByProductId(id) });
});

restApi.post("/products", async (c) => {
  try {
    const body = await c.req.json();

    // Create product
    const product = createProduct({
      name: body.name,
      description: body.description || null,
      price: String(body.price),
      salePrice: body.salePrice ? String(body.salePrice) : null,
      images: body.images || [],
      videoUrl: body.videoUrl || null,
      category: body.category,
      sizes: body.sizes || ["0-3m", "3-6m", "6-9m"],
      colors: body.colors || [],
      isFeatured: body.isFeatured || false,
      isNew: body.isNew || false,
      isBestseller: body.isBestseller || false,
      stock: body.stock || 0,
    });

    // Create variants if provided
    if (body.variants && body.variants.length > 0) {
      createVariants(body.variants.map((v: any) => ({ ...v, productId: product.id })));
    }

    return c.json({ success: true, id: product.id, product: { ...product, variants: getVariantsByProductId(product.id) } }, 201);
  } catch (e) {
    console.error("Create product error:", e);
    return c.json({ error: e instanceof Error ? e.message : "Failed to create product" }, 500);
  }
});

restApi.put("/products/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const body = await c.req.json();

    updateProduct(id, {
      name: body.name,
      description: body.description || null,
      price: String(body.price),
      salePrice: body.salePrice ? String(body.salePrice) : null,
      images: body.images || [],
      videoUrl: body.videoUrl || null,
      category: body.category,
      sizes: body.sizes || ["0-3m", "3-6m", "6-9m"],
      colors: body.colors || [],
      isFeatured: body.isFeatured || false,
      isNew: body.isNew || false,
      isBestseller: body.isBestseller || false,
      stock: body.stock || 0,
    });

    // Update variants
    if (body.variants !== undefined) {
      deleteVariantsByProductId(id);
      if (body.variants.length > 0) {
        createVariants(body.variants.map((v: any) => ({ ...v, productId: id })));
      }
    }

    return c.json({ success: true });
  } catch (e) {
    console.error("Update product error:", e);
    return c.json({ error: e instanceof Error ? e.message : "Failed to update product" }, 500);
  }
});

restApi.delete("/products/:id", (c) => {
  const id = parseInt(c.req.param("id"));
  deleteProduct(id);
  return c.json({ success: true });
});

// ORDERS
restApi.get("/orders", (c) => {
  const items = getOrders();
  return c.json({ items, total: items.length });
});

restApi.post("/orders", async (c) => {
  try {
    const body = await c.req.json();
    const order = createOrder({
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail || null,
      items: body.items,
      totalAmount: String(body.totalAmount),
      status: "pending",
      notes: body.notes || null,
    });
    return c.json(order, 201);
  } catch (e) {
    return c.json({ error: e instanceof Error ? e.message : "Failed to create order" }, 500);
  }
});

restApi.patch("/orders/:id/status", async (c) => {
  const id = parseInt(c.req.param("id"));
  const body = await c.req.json();
  updateOrderStatus(id, body.status);
  return c.json({ success: true });
});

export default restApi;
