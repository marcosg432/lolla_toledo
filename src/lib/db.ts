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
    
    // Invalidar cache do require se existir
    if (require.cache[fp]) {
      delete require.cache[fp];
    }
    
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
  // Invalidar cache após escrever
  if (require.cache[fp]) {
    delete require.cache[fp];
  }
}

// Função para invalidar cache do require
function invalidateJsonCache(name: string): void {
  try {
    const fp = getFilePath(name);
    if (require.cache[fp]) {
      delete require.cache[fp];
    }
  } catch {
    // Ignorar erros
  }
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
  estoque?: number;
  ativo?: boolean;
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
  // Invalidar cache antes de ler
  invalidateJsonCache("products");
  
  const images = listCabelosImages();
  if (images.length === 0) return [];
  
  // Forçar leitura direta do arquivo, ignorando qualquer cache
  const fp = getFilePath("products");
  let fromJson: Product[] = [];
  try {
    if (fs.existsSync(fp)) {
      // Invalidar cache do require
      if (require.cache[fp]) {
        delete require.cache[fp];
      }
      // Ler diretamente do arquivo
      const raw = fs.readFileSync(fp, "utf-8");
      if (raw && raw.trim()) {
        const parsed = JSON.parse(raw);
        fromJson = Array.isArray(parsed) ? parsed : [];
      }
    }
  } catch (error) {
    console.error("[productsFromCabelosFolder] Erro ao ler products.json:", error);
    fromJson = [];
  }
  
  // Criar mapa por nome base do arquivo (sem extensão) para fazer match independente da extensão
  // Isso resolve o problema de .png no JSON vs .jpeg no sistema de arquivos
  const byImageBase = new Map<string, Product>();
  for (const p of fromJson) {
    if (p?.image && String(p.image).startsWith("/cabelos/")) {
      // Extrair nome base sem extensão (ex: "cabelo-01" de "/cabelos/cabelo-01.png")
      const baseName = p.image.replace("/cabelos/", "").replace(/\.(png|jpg|jpeg|webp)$/i, "");
      byImageBase.set(baseName, p as Product);
    }
  }
  
  const base = "100% humano, selecionado e de alta qualidade. Comprimento: 60cm. Peso: 90g.";
  const produtos = images.map((filename, i) => {
    const imagePath = `/cabelos/${filename}`;
    // Extrair nome base do arquivo atual (sem extensão)
    const baseName = filename.replace(/\.(png|jpg|jpeg|webp)$/i, "");
    const existing = byImageBase.get(baseName);
    const id = String(i + 1);
    
    if (existing) {
      // CRÍTICO: Preservar estoque e ativo do JSON exatamente como estão
      let estoque: number;
      if (typeof existing.estoque === "number") {
        estoque = existing.estoque;
      } else if (existing.estoque !== undefined && existing.estoque !== null) {
        estoque = Number(existing.estoque);
      } else {
        estoque = 0;
      }
      
      let ativo: boolean;
      if (typeof existing.ativo === "boolean") {
        ativo = existing.ativo;
      } else if (existing.ativo !== undefined && existing.ativo !== null) {
        ativo = Boolean(existing.ativo);
      } else {
        ativo = estoque > 0;
      }
      
      // Criar produto final preservando TODOS os valores do JSON, ESPECIALMENTE estoque e ativo
      return { 
        id: existing.id || id,
        name: existing.name,
        description: existing.description,
        price: existing.price,
        image: imagePath,
        length: existing.length,
        peso: existing.peso,
        color: existing.color,
        type: existing.type,
        featured: existing.featured,
        order: existing.order !== undefined ? existing.order : i,
        createdAt: existing.createdAt,
        estoque: estoque, // VALOR PRESERVADO DO JSON
        ativo: ativo, // VALOR PRESERVADO DO JSON
      } as Product;
    }
    
    // Produto não encontrado no JSON - criar novo
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
      estoque: 0,
      ativo: true,
      createdAt: "2024-01-01T00:00:00.000Z",
    } as Product;
  });
  
  // Ordenar: produtos ativos primeiro (estoque > 0), depois inativos (estoque = 0)
  return produtos.sort((a, b) => {
    const aAtivo = (a.ativo !== false) && ((a.estoque || 0) > 0);
    const bAtivo = (b.ativo !== false) && ((b.estoque || 0) > 0);
    if (aAtivo && !bAtivo) return -1;
    if (!aAtivo && bAtivo) return 1;
    return (b.estoque || 0) - (a.estoque || 0);
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
