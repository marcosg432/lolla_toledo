import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const CABELOS_DIR = path.join(process.cwd(), "public", "cabelos");
const IMAGE_EXT = [".png", ".jpg", ".jpeg", ".webp"];

const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
};

/** Lista de nomes de arquivos de imagem na pasta public/cabelos (sempre desta pasta). */
function listCabelosImages(): string[] {
  try {
    if (!fs.existsSync(CABELOS_DIR)) return [];
    const files = fs.readdirSync(CABELOS_DIR) as string[];
    return files
      .filter((f) => IMAGE_EXT.some((ext) => f.toLowerCase().endsWith(ext)))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  } catch {
    return [];
  }
}

function getFilePath(name: string) {
  ensureDataDir();
  return path.join(DATA_DIR, `${name}.json`);
}

export function readJson<T>(name: string, defaultValue: T): T {
  try {
    const fp = getFilePath(name);
    if (!fs.existsSync(fp)) return defaultValue;
    const raw = fs.readFileSync(fp, "utf-8");
    if (typeof raw !== "string" || raw.trim() === "") return defaultValue;
    const parsed = JSON.parse(raw) as T;
    if (parsed === null || parsed === undefined) return defaultValue;
    return parsed;
  } catch {
    return defaultValue;
  }
}

export function writeJson<T>(name: string, data: T): void {
  const fp = getFilePath(name);
  ensureDataDir();
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), "utf-8");
}

// Tipos
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  length?: string;
  peso?: string;
  color?: string;
  type?: string;
  featured?: boolean;
  order: number;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  image?: string;
  order: number;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  text: string;
  image?: string;
  rating: number;
  order: number;
  createdAt: string;
}

export interface BeforeAfter {
  id: string;
  title: string;
  beforeImage: string;
  afterImage: string;
  order: number;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  order: number;
  active: boolean;
  createdAt: string;
}

export interface AppointmentSlot {
  id: string;
  date: string;
  time: string;
  serviceId: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  status: "pending" | "confirmed" | "done" | "cancelled";
  notes?: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
}

const DEFAULT_PRODUCTS: Product[] = [];
const DEFAULT_SERVICES: Service[] = [
  {
    id: "1",
    name: "Aplicação Mega Hair",
    description: "Aplicação completa de mega hair com fios premium, garantindo naturalidade e durabilidade.",
    price: 0,
    duration: "4-6h",
    order: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Manutenção Mega Hair",
    description: "Manutenção periódica para manter os fios impecáveis e prolongar a durabilidade.",
    price: 0,
    duration: "2-3h",
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Avaliação e Consulta",
    description: "Consulta personalizada para análise do seu cabelo e definição do melhor tipo de mega hair.",
    price: 0,
    duration: "1h",
    order: 2,
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [];
const DEFAULT_BEFORE_AFTER: BeforeAfter[] = [];
const DEFAULT_BANNERS: Banner[] = [];

function ensureArray<T>(val: unknown, fallback: T[]): T[] {
  if (val == null) return [...fallback];
  if (!Array.isArray(val)) return [...fallback];
  return [...(val as T[])];
}

/** Produtos do catálogo sempre a partir das imagens em public/cabelos. Dados extras vêm de products.json quando a imagem bate. */
export function productsFromCabelosFolder(): Product[] {
  const images = listCabelosImages();
  if (images.length === 0) return [];
  const fromJson = ensureArray(readJson<Product[]>("products", DEFAULT_PRODUCTS), DEFAULT_PRODUCTS);
  const byImage = new Map<string, Product>();
  for (const p of fromJson) {
    if (p?.image && String(p.image).startsWith("/cabelos/")) {
      byImage.set(p.image, p as Product);
    }
  }
  const base = "100% humano, selecionado e de alta qualidade. Comprimento: 60cm. Peso: 90g.";
  return images.map((filename, i) => {
    const imagePath = `/cabelos/${filename}`;
    const existing = byImage.get(imagePath);
    const id = String(i + 1);
    if (existing) {
      return { ...existing, id, image: imagePath, order: i };
    }
    const name = `Cabelo Premium ${String(i + 1).padStart(2, "0")}`;
    return {
      id,
      name,
      description: `${base}`,
      price: 1200,
      image: imagePath,
      length: "60cm",
      peso: "90g",
      type: "Mega Hair",
      featured: i < 3,
      order: i,
      createdAt: "2024-01-01T00:00:00.000Z",
    } as Product;
  });
}

export const db = {
  products: () => ensureArray(readJson<Product[]>("products", DEFAULT_PRODUCTS), DEFAULT_PRODUCTS),
  /** Produtos do catálogo: só imagens de public/cabelos. Use este na página de catálogo e no preview. */
  catalogProducts: () => productsFromCabelosFolder(),
  setProducts: (v: Product[]) => writeJson("products", v),
  services: () => ensureArray(readJson<Service[]>("services", DEFAULT_SERVICES), DEFAULT_SERVICES),
  setServices: (v: Service[]) => writeJson("services", v),
  testimonials: () => ensureArray(readJson<Testimonial[]>("testimonials", DEFAULT_TESTIMONIALS), DEFAULT_TESTIMONIALS),
  setTestimonials: (v: Testimonial[]) => writeJson("testimonials", v),
  beforeAfter: () => ensureArray(readJson<BeforeAfter[]>("beforeAfter", DEFAULT_BEFORE_AFTER), DEFAULT_BEFORE_AFTER),
  setBeforeAfter: (v: BeforeAfter[]) => writeJson("beforeAfter", v),
  banners: () => ensureArray(readJson<Banner[]>("banners", DEFAULT_BANNERS), DEFAULT_BANNERS),
  setBanners: (v: Banner[]) => writeJson("banners", v),
  appointments: (): AppointmentSlot[] => ensureArray(readJson<AppointmentSlot[]>("appointments", []), []),
  setAppointments: (v: AppointmentSlot[]) => writeJson("appointments", v),
};
