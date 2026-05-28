import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const DATA_FILE = join(process.cwd(), "data", "store.json");

interface Store {
  products: any[];
  orders: any[];
  settings: any[];
  uploads: any[];
  productVariants: any[];
}

let store: Store | null = null;
let nextId = { products: 1, orders: 1, settings: 1, uploads: 1, productVariants: 1 };

function loadStore(): Store {
  try {
    if (existsSync(DATA_FILE)) {
      const data = JSON.parse(readFileSync(DATA_FILE, "utf-8"));
      // Restore nextIds
      nextId.products = (data.products?.length ?? 0) > 0 ? Math.max(...data.products.map((p: any) => p.id)) + 1 : 1;
      nextId.orders = (data.orders?.length ?? 0) > 0 ? Math.max(...data.orders.map((o: any) => o.id)) + 1 : 1;
      nextId.uploads = (data.uploads?.length ?? 0) > 0 ? Math.max(...data.uploads.map((u: any) => u.id)) + 1 : 1;
      nextId.productVariants = (data.productVariants?.length ?? 0) > 0 ? Math.max(...data.productVariants.map((v: any) => v.id)) + 1 : 1;
      return data;
    }
  } catch (e) {
    console.error("Error loading store:", e);
  }
  return { products: [], orders: [], settings: [], uploads: [], productVariants: [] };
}

function saveStore() {
  try {
    const dir = join(process.cwd(), "data");
    if (!existsSync(dir)) {
      const fs = require("fs");
      fs.mkdirSync(dir, { recursive: true });
    }
    writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
  } catch (e) {
    console.error("Error saving store:", e);
  }
}

function getStore(): Store {
  if (!store) {
    store = loadStore();
  }
  return store;
}

// Products
export function getProducts(): any[] {
  return getStore().products;
}

export function getProductById(id: number): any | null {
  return getStore().products.find((p) => p.id === id) ?? null;
}

export function createProduct(data: any): any {
  const s = getStore();
  const product = { ...data, id: nextId.products++, createdAt: new Date().toISOString() };
  s.products.push(product);
  saveStore();
  return product;
}

export function updateProduct(id: number, data: any): boolean {
  const s = getStore();
  const idx = s.products.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  s.products[idx] = { ...s.products[idx], ...data };
  saveStore();
  return true;
}

export function deleteProduct(id: number): boolean {
  const s = getStore();
  s.products = s.products.filter((p) => p.id !== id);
  s.productVariants = s.productVariants.filter((v) => v.productId !== id);
  saveStore();
  return true;
}

// Product Variants
export function getVariantsByProductId(productId: number): any[] {
  return getStore().productVariants.filter((v) => v.productId === productId);
}

export function createVariants(variants: any[]): any[] {
  const s = getStore();
  const created = variants.map((v) => ({ ...v, id: nextId.productVariants++ }));
  s.productVariants.push(...created);
  saveStore();
  return created;
}

export function deleteVariantsByProductId(productId: number): void {
  const s = getStore();
  s.productVariants = s.productVariants.filter((v) => v.productId !== productId);
  saveStore();
}

// Orders
export function getOrders(): any[] {
  return getStore().orders;
}

export function createOrder(data: any): any {
  const s = getStore();
  const order = { ...data, id: nextId.orders++, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  s.orders.push(order);
  saveStore();
  return order;
}

export function updateOrderStatus(id: number, status: string): boolean {
  const s = getStore();
  const idx = s.orders.findIndex((o) => o.id === id);
  if (idx === -1) return false;
  s.orders[idx].status = status;
  s.orders[idx].updatedAt = new Date().toISOString();
  saveStore();
  return true;
}

// Settings
export function getSettings(): any[] {
  return getStore().settings;
}

export function getSettingByKey(key: string): any | null {
  return getStore().settings.find((s) => s.key === key) ?? null;
}

export function setSetting(key: string, value: string): void {
  const s = getStore();
  const idx = s.settings.findIndex((s2) => s2.key === key);
  if (idx >= 0) {
    s.settings[idx].value = value;
    s.settings[idx].updatedAt = new Date().toISOString();
  } else {
    s.settings.push({ id: nextId.settings++, key, value, updatedAt: new Date().toISOString() });
  }
  saveStore();
}

// Uploads
export function createUpload(data: any): any {
  const s = getStore();
  const upload = { ...data, id: nextId.uploads++, createdAt: new Date().toISOString() };
  s.uploads.push(upload);
  saveStore();
  return upload;
}

export function getUploadById(id: number): any | null {
  return getStore().uploads.find((u) => u.id === id) ?? null;
}

// Seed initial data if empty
export function seedIfEmpty() {
  const s = getStore();
  if (s.products.length === 0) {
    console.log("Seeding initial products...");
    const seedProducts = [
      { name: "Body Manga Larga Premium", description: "Body de algodón orgánico 100% con mangas largas.", price: "49990.00", salePrice: "39990.00", images: ["/images/products/product-1.jpg"], category: "bodies", sizes: ["0-3m","3-6m","6-9m"], colors: ["Blanco","Rosa","Celeste"], isFeatured: true, isNew: true, isBestseller: true, stock: 25 },
      { name: "Buzo Polar con Pie", description: "Buzo polar ultra suave con pie integrado.", price: "69990.00", salePrice: "48990.00", images: ["/images/products/product-2.jpg"], category: "conjuntos", sizes: ["0-3m","3-6m","6-9m"], colors: ["Blanco","Rosa","Gris"], isFeatured: true, isNew: false, isBestseller: true, stock: 18 },
      { name: "Conjunto Tejido Sage", description: "Saquito tejido a mano y pantalón.", price: "79990.00", salePrice: "55990.00", images: ["/images/products/product-3.jpg"], category: "conjuntos", sizes: ["0-3m","3-6m","6-9m"], colors: ["Blanco","Celeste"], isFeatured: true, isNew: true, isBestseller: false, stock: 12 },
      { name: "Set Gorro y Manoplas", description: "Set en color peach.", price: "34990.00", salePrice: "27990.00", images: ["/images/products/product-4.jpg"], category: "accesorios", sizes: ["0-3m","3-6m"], colors: ["Rosa","Celeste"], isFeatured: true, isNew: false, isBestseller: true, stock: 30 },
      { name: "Body Nubes Mint", description: "Body con estampado de nubes.", price: "49990.00", salePrice: "39990.00", images: ["/images/products/product-5.jpg"], category: "bodies", sizes: ["0-3m","3-6m","6-9m"], colors: ["Celeste","Gris"], isFeatured: true, isNew: false, isBestseller: false, stock: 20 },
      { name: "Manta Waffle Premium", description: "Manta textura waffle crema.", price: "54990.00", salePrice: "38490.00", images: ["/images/products/product-6.jpg"], category: "accesorios", sizes: ["UNICO"], colors: ["Blanco"], isFeatured: true, isNew: true, isBestseller: false, stock: 15 },
    ];
    for (const p of seedProducts) {
      createProduct(p);
    }
    // Create variants
    for (const p of s.products) {
      const colors = p.colors || ["Blanco"];
      const sizes = p.sizes || ["0-3m"];
      const colorHexes: Record<string, string> = { "Blanco": "#FFFFFF", "Rosa": "#F8E1E4", "Celeste": "#B8D4E3", "Gris": "#D0D0D0" };
      for (const color of colors) {
        for (const size of sizes) {
          createVariants([{ productId: p.id, color, colorHex: colorHexes[color] || "#E8E8E8", size, stock: Math.floor(Math.random() * 15) + 5 }]);
        }
      }
    }
    console.log(`Seeded ${s.products.length} products with ${s.productVariants.length} variants`);
  }
}
