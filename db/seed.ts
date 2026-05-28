import { getDb } from "../api/queries/connection";
import { products } from "./schema";

async function seed() {
  const db = getDb();

  const existing = await db.select().from(products);
  if (existing.length > 0) {
    console.log("Database already seeded, skipping...");
    return;
  }

  const seedProducts = [
    {
      name: "Body Manga Larga Premium",
      description: "Body de algodón orgánico 100% con mangas largas. Suave al tacto, ideal para el día a día de tu bebé. Disponible en varios colores pastel.",
      price: "8500.00",
      imageUrl: "/images/products/product-1.jpg",
      category: "bodies" as const,
      sizes: ["0-3m", "3-6m", "6-9m", "9-12m"],
      isFeatured: true,
      isNew: true,
      isBestseller: true,
      stock: 25,
    },
    {
      name: "Buzo Polar con Pie",
      description: "Buzo polar ultra suave con pie integrado. Mantiene abrigadito a tu bebé durante los días fríos. Tela plush de alta calidad.",
      price: "12900.00",
      imageUrl: "/images/products/product-2.jpg",
      category: "conjuntos" as const,
      sizes: ["0-3m", "3-6m", "6-9m", "9-12m", "12-18m"],
      isFeatured: true,
      isNew: false,
      isBestseller: true,
      stock: 18,
    },
    {
      name: "Conjunto Tejido Sage",
      description: "Hermoso conjunto de saquito tejido y pantalón en color verde sage. Botones de madera naturales. Ideal para ocasiones especiales.",
      price: "15800.00",
      imageUrl: "/images/products/product-3.jpg",
      category: "conjuntos" as const,
      sizes: ["0-3m", "3-6m", "6-9m", "9-12m"],
      isFeatured: true,
      isNew: true,
      isBestseller: false,
      stock: 12,
    },
    {
      name: "Set Gorro y Manoplas",
      description: "Set de gorro con nudo y manoplas anti-rasguños en color peach. Algodón jersey suave y elástico. Perfecto para recién nacidos.",
      price: "6200.00",
      imageUrl: "/images/products/product-4.jpg",
      category: "accesorios" as const,
      sizes: ["0-3m", "3-6m"],
      isFeatured: true,
      isNew: false,
      isBestseller: true,
      stock: 30,
    },
    {
      name: "Body Nubes Mint",
      description: "Body manga corta con adorable estampado de nubecitas. Color menta fresco. 100% algodón peinado. Ideal para primavera-verano.",
      price: "7900.00",
      salePrice: "6900.00",
      imageUrl: "/images/products/product-5.jpg",
      category: "bodies" as const,
      sizes: ["0-3m", "3-6m", "6-9m", "9-12m", "12-18m"],
      isFeatured: true,
      isNew: false,
      isBestseller: false,
      stock: 20,
    },
    {
      name: "Manta Waffle Premium",
      description: "Manta de textura waffle en color crema. Ultra suave y absorbente. Perfecta para envolver a tu bebé o para el cambio de pañales.",
      price: "9500.00",
      imageUrl: "/images/products/product-6.jpg",
      category: "accesorios" as const,
      sizes: ["UNICO"],
      isFeatured: true,
      isNew: true,
      isBestseller: false,
      stock: 15,
    },
    {
      name: "Pack 3 Bodies Clásicos",
      description: "Pack de 3 bodies en colores blanco, gris y rosa pálido. Algodón 100%, cuello envelope para fácil cambio. El básico indispensable.",
      price: "18900.00",
      salePrice: "15900.00",
      imageUrl: "/images/categories/bodies.jpg",
      category: "bodies" as const,
      sizes: ["0-3m", "3-6m", "6-9m", "9-12m", "12-18m", "18-24m"],
      isFeatured: false,
      isNew: false,
      isBestseller: true,
      stock: 40,
    },
    {
      name: "Conjunto Jardín de Sueños",
      description: "Conjunto remera y pantalón en tonos verde agua con estampado floral delicado. Ideal para salidas y visitas. Muy cómodo.",
      price: "11200.00",
      imageUrl: "/images/categories/conjuntos.jpg",
      category: "conjuntos" as const,
      sizes: ["3-6m", "6-9m", "9-12m", "12-18m"],
      isFeatured: false,
      isNew: true,
      isBestseller: false,
      stock: 10,
    },
    {
      name: "Set Regalo Bienvenida",
      description: "Hermoso set de regalo que incluye body, gorrito, manoplas y babero en caja kraft con moño rosa. Listo para entregar.",
      price: "18500.00",
      imageUrl: "/images/categories/regalo.jpg",
      category: "regalo" as const,
      sizes: ["0-3m", "3-6m"],
      isFeatured: false,
      isNew: true,
      isBestseller: true,
      stock: 8,
    },
    {
      name: "Baberos Pack x3",
      description: "Pack de 3 baberos en colores pastel con broches ajustables. Tela impermeable por detrás. Prácticos y adorables.",
      price: "5400.00",
      imageUrl: "/images/categories/accesorios.jpg",
      category: "accesorios" as const,
      sizes: ["UNICO"],
      isFeatured: false,
      isNew: false,
      isBestseller: false,
      stock: 35,
    },
    {
      name: "Body Manga Corta Básico",
      description: "Body manga corta en algodón pima. Disponible en blanco, crema y rosa pálido. Escote envelope para fácil vestido.",
      price: "6900.00",
      imageUrl: "/images/products/product-1.jpg",
      category: "bodies" as const,
      sizes: ["0-3m", "3-6m", "6-9m", "9-12m", "12-18m", "18-24m"],
      isFeatured: false,
      isNew: false,
      isBestseller: false,
      stock: 50,
    },
    {
      name: "Canastilla de Bienvenida",
      description: "Canastilla completa con 5 prendas esenciales: bodies, pantaloncitos, gorro, babero y manta. Presentada en caja de regalo.",
      price: "24500.00",
      salePrice: "21900.00",
      imageUrl: "/images/categories/regalo.jpg",
      category: "regalo" as const,
      sizes: ["0-3m", "3-6m"],
      isFeatured: false,
      isNew: false,
      isBestseller: true,
      stock: 6,
    },
  ];

  for (const product of seedProducts) {
    await db.insert(products).values(product);
  }

  console.log(`Seeded ${seedProducts.length} products`);
}

seed().catch(console.error);
