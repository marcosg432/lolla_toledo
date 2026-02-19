import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "lolla_toledo.db");

// Garantir que o diretório existe
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (db) return db;
  db = new Database(DB_PATH, { verbose: undefined });
  initTables();
  return db;
}

function initTables() {
  if (!db) return;

  // Tabela de pedidos - verificar se existe e adicionar colunas se necessário
  db.exec(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente TEXT,
      telefone TEXT,
      items TEXT,
      total REAL,
      data TEXT,
      status TEXT DEFAULT 'pendente',
      pagamento TEXT,
      observacao TEXT
    );
  `);

  // Verificar colunas existentes e adicionar as novas se não existirem
  try {
    const columns = db.prepare("PRAGMA table_info(pedidos)").all() as Array<{ name: string }>;
    const columnNames = columns.map((c) => c.name);

    // Adicionar colunas novas se não existirem (para migração de tabelas antigas)
    if (!columnNames.includes("telefone")) {
      db.exec("ALTER TABLE pedidos ADD COLUMN telefone TEXT;");
    }
    if (!columnNames.includes("items")) {
      db.exec("ALTER TABLE pedidos ADD COLUMN items TEXT;");
    }
    if (!columnNames.includes("total")) {
      db.exec("ALTER TABLE pedidos ADD COLUMN total REAL;");
    }
    if (!columnNames.includes("pagamento")) {
      db.exec("ALTER TABLE pedidos ADD COLUMN pagamento TEXT;");
    }
    if (!columnNames.includes("observacao")) {
      db.exec("ALTER TABLE pedidos ADD COLUMN observacao TEXT;");
    }
    // Manter campos antigos para compatibilidade
    if (!columnNames.includes("produtoId")) {
      db.exec("ALTER TABLE pedidos ADD COLUMN produtoId TEXT;");
    }
    if (!columnNames.includes("produtoNome")) {
      db.exec("ALTER TABLE pedidos ADD COLUMN produtoNome TEXT;");
    }
    if (!columnNames.includes("quantidade")) {
      db.exec("ALTER TABLE pedidos ADD COLUMN quantidade INTEGER;");
    }
    if (!columnNames.includes("tipo")) {
      db.exec("ALTER TABLE pedidos ADD COLUMN tipo TEXT;");
    }
    if (!columnNames.includes("precoAplicado")) {
      db.exec("ALTER TABLE pedidos ADD COLUMN precoAplicado REAL;");
    }
  } catch (error) {
    // Ignorar erros de colunas já existentes
    console.error("Erro ao verificar colunas:", error);
  }

  // Tabela de clientes
  db.exec(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      telefone TEXT,
      criadoEm TEXT
    );
  `);

  // Verificar e adicionar colunas na tabela produtos (se existir)
  // Como estamos usando JSON, vamos criar uma tabela de produtos também para referência
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS produtos_sqlite (
        id TEXT PRIMARY KEY,
        nome TEXT,
        precoVarejo REAL,
        precoAtacado REAL,
        quantidadeMinAtacado INTEGER
      );
    `);

    // Verificar se as colunas existem na tabela produtos_sqlite
    const columns = db.prepare("PRAGMA table_info(produtos_sqlite)").all() as Array<{ name: string }>;
    const columnNames = columns.map((c) => c.name);

    if (!columnNames.includes("precoVarejo")) {
      db.exec("ALTER TABLE produtos_sqlite ADD COLUMN precoVarejo REAL;");
    }
    if (!columnNames.includes("precoAtacado")) {
      db.exec("ALTER TABLE produtos_sqlite ADD COLUMN precoAtacado REAL;");
    }
    if (!columnNames.includes("quantidadeMinAtacado")) {
      db.exec("ALTER TABLE produtos_sqlite ADD COLUMN quantidadeMinAtacado INTEGER;");
    }
    if (!columnNames.includes("estoque")) {
      db.exec("ALTER TABLE produtos_sqlite ADD COLUMN estoque INTEGER DEFAULT 0;");
    }
    if (!columnNames.includes("ativo")) {
      db.exec("ALTER TABLE produtos_sqlite ADD COLUMN ativo INTEGER DEFAULT 1;");
    }
  } catch (error) {
    // Ignorar erros se a tabela não existir
    console.error("Erro ao verificar tabela produtos_sqlite:", error);
  }
}

export interface PedidoItem {
  produtoId: string;
  produtoNome: string;
  quantidade: number;
  precoAplicado: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  cliente: string | null;
  telefone: string | null;
  items: PedidoItem[] | string; // JSON string ou array
  total: number;
  data: string;
  status: string;
  pagamento: string | null;
  observacao: string | null;
  // Campos legados para compatibilidade
  produtoId?: string | null;
  produtoNome?: string | null;
  quantidade?: number;
  tipo?: string | null;
  precoAplicado?: number;
}

export interface Cliente {
  id: number;
  nome: string | null;
  telefone: string | null;
  criadoEm: string;
}

export const sqliteDb = {
  // Pedidos
  criarPedido: (pedido: Omit<Pedido, "id">) => {
    const db = getDb();
    const itemsJson = typeof pedido.items === "string" ? pedido.items : JSON.stringify(pedido.items || []);
    const stmt = db.prepare(`
      INSERT INTO pedidos (cliente, telefone, items, total, data, status, pagamento, observacao, produtoId, produtoNome, quantidade, tipo, precoAplicado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      pedido.cliente,
      pedido.telefone,
      itemsJson,
      pedido.total || 0,
      pedido.data,
      pedido.status || "pendente",
      pedido.pagamento,
      pedido.observacao,
      pedido.produtoId,
      pedido.produtoNome,
      pedido.quantidade,
      pedido.tipo,
      pedido.precoAplicado
    );
  },

  obterPedidos: (limit?: number): Pedido[] => {
    const db = getDb();
    let pedidos: any[];
    if (limit) {
      pedidos = db.prepare("SELECT * FROM pedidos ORDER BY id DESC LIMIT ?").all(limit) as any[];
    } else {
      pedidos = db.prepare("SELECT * FROM pedidos ORDER BY id DESC").all() as any[];
    }
    // Parse items JSON se existir
    return pedidos.map((p) => {
      if (p.items && typeof p.items === "string") {
        try {
          p.items = JSON.parse(p.items);
        } catch {
          p.items = [];
        }
      }
      return p as Pedido;
    });
  },

  obterPedidoPorId: (id: number): Pedido | null => {
    const db = getDb();
    const pedido = db.prepare("SELECT * FROM pedidos WHERE id = ?").get(id) as any;
    if (!pedido) return null;
    if (pedido.items && typeof pedido.items === "string") {
      try {
        pedido.items = JSON.parse(pedido.items);
      } catch {
        pedido.items = [];
      }
    }
    return pedido as Pedido;
  },

  atualizarPedido: (id: number, pedido: Partial<Pedido>) => {
    const db = getDb();
    const itemsJson = pedido.items
      ? typeof pedido.items === "string"
        ? pedido.items
        : JSON.stringify(pedido.items)
      : undefined;
    const updates: string[] = [];
    const values: any[] = [];

    if (pedido.cliente !== undefined) {
      updates.push("cliente = ?");
      values.push(pedido.cliente);
    }
    if (pedido.telefone !== undefined) {
      updates.push("telefone = ?");
      values.push(pedido.telefone);
    }
    if (itemsJson !== undefined) {
      updates.push("items = ?");
      values.push(itemsJson);
    }
    if (pedido.total !== undefined) {
      updates.push("total = ?");
      values.push(pedido.total);
    }
    if (pedido.status !== undefined) {
      updates.push("status = ?");
      values.push(pedido.status);
    }
    if (pedido.pagamento !== undefined) {
      updates.push("pagamento = ?");
      values.push(pedido.pagamento);
    }
    if (pedido.observacao !== undefined) {
      updates.push("observacao = ?");
      values.push(pedido.observacao);
    }

    if (updates.length === 0) return null;
    values.push(id);
    const stmt = db.prepare(`UPDATE pedidos SET ${updates.join(", ")} WHERE id = ?`);
    return stmt.run(...values);
  },

  excluirPedido: (id: number) => {
    const db = getDb();
    return db.prepare("DELETE FROM pedidos WHERE id = ?").run(id);
  },

  // Estatísticas
  totalPedidos: (): number => {
    const db = getDb();
    const result = db.prepare("SELECT COUNT(*) as total FROM pedidos").get() as { total: number };
    return result.total || 0;
  },

  pedidosPorTipo: (): Array<{ tipo: string; total: number }> => {
    const db = getDb();
    const pedidos = db.prepare("SELECT items, tipo FROM pedidos").all() as Array<{ items: string; tipo?: string }>;
    const tipos: { [key: string]: number } = {};

    pedidos.forEach((p) => {
      // Se tiver items JSON, processar cada item
      if (p.items) {
        try {
          const items = typeof p.items === "string" ? JSON.parse(p.items) : p.items;
          if (Array.isArray(items)) {
            items.forEach((item: PedidoItem) => {
              if (item.tipo) {
                tipos[item.tipo] = (tipos[item.tipo] || 0) + 1;
              }
            });
          }
        } catch {
          // Ignorar erros de parse
        }
      }
      // Compatibilidade com formato antigo
      if (p.tipo) {
        tipos[p.tipo] = (tipos[p.tipo] || 0) + 1;
      }
    });

    return Object.entries(tipos).map(([tipo, total]) => ({ tipo, total }));
  },

  pedidosPorMes: (): Array<{ mes: string; total: number }> => {
    const db = getDb();
    return db
      .prepare(`
        SELECT strftime('%m', data) AS mes, COUNT(*) as total 
        FROM pedidos 
        WHERE data IS NOT NULL
        GROUP BY mes 
        ORDER BY mes
      `)
      .all() as Array<{ mes: string; total: number }>;
  },

  produtosMaisVendidos: (limit: number = 5): Array<{ produtoId: string; produtoNome: string; total: number }> => {
    const db = getDb();
    const pedidos = db.prepare("SELECT items, produtoId, produtoNome FROM pedidos").all() as Array<{
      items: string;
      produtoId?: string;
      produtoNome?: string;
    }>;
    const produtos: { [key: string]: { nome: string; total: number } } = {};

    pedidos.forEach((p) => {
      // Processar items JSON
      if (p.items) {
        try {
          const items = typeof p.items === "string" ? JSON.parse(p.items) : p.items;
          if (Array.isArray(items)) {
            items.forEach((item: PedidoItem) => {
              if (item.produtoId) {
                if (!produtos[item.produtoId]) {
                  produtos[item.produtoId] = { nome: item.produtoNome || item.produtoId, total: 0 };
                }
                produtos[item.produtoId].total += item.quantidade || 1;
              }
            });
          }
        } catch {
          // Ignorar erros
        }
      }
      // Compatibilidade com formato antigo
      if (p.produtoId) {
        if (!produtos[p.produtoId]) {
          produtos[p.produtoId] = { nome: p.produtoNome || p.produtoId, total: 0 };
        }
        produtos[p.produtoId].total += 1;
      }
    });

    return Object.entries(produtos)
      .map(([produtoId, data]) => ({ produtoId, produtoNome: data.nome, total: data.total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, limit);
  },

  faturamentoTotal: (): number => {
    const db = getDb();
    // Primeiro tentar usar o campo total
    const resultTotal = db.prepare("SELECT SUM(total) as total FROM pedidos WHERE total IS NOT NULL").get() as {
      total: number | null;
    };
    if (resultTotal.total) return resultTotal.total;

    // Fallback: calcular a partir de items ou campos antigos
    const pedidos = db.prepare("SELECT items, precoAplicado, quantidade, total FROM pedidos").all() as Array<{
      items?: string;
      precoAplicado?: number;
      quantidade?: number;
      total?: number;
    }>;

    let total = 0;
    pedidos.forEach((p) => {
      if (p.total) {
        total += p.total;
      } else if (p.items) {
        try {
          const items = typeof p.items === "string" ? JSON.parse(p.items) : p.items;
          if (Array.isArray(items)) {
            items.forEach((item: PedidoItem) => {
              total += item.subtotal || item.precoAplicado * (item.quantidade || 1);
            });
          }
        } catch {
          // Ignorar erros
        }
      } else if (p.precoAplicado && p.quantidade) {
        total += p.precoAplicado * p.quantidade;
      }
    });

    return total;
  },

  // Clientes
  criarCliente: (cliente: Omit<Cliente, "id">) => {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO clientes (nome, telefone, criadoEm)
      VALUES (?, ?, ?)
    `);
    return stmt.run(cliente.nome, cliente.telefone, cliente.criadoEm);
  },

  obterClientes: (): Cliente[] => {
    const db = getDb();
    return db.prepare("SELECT * FROM clientes ORDER BY id DESC").all() as Cliente[];
  },

  // Estoque
  atualizarEstoqueProduto: (produtoId: string, novoEstoque: number, ativo?: boolean) => {
    const db = getDb();
    if (ativo !== undefined) {
      return db.prepare("UPDATE produtos_sqlite SET estoque = ?, ativo = ? WHERE id = ?").run(novoEstoque, ativo ? 1 : 0, produtoId);
    }
    return db.prepare("UPDATE produtos_sqlite SET estoque = ? WHERE id = ?").run(novoEstoque, produtoId);
  },

  obterEstoqueProduto: (produtoId: string): { estoque: number; ativo: number } | null => {
    const db = getDb();
    const result = db.prepare("SELECT estoque, ativo FROM produtos_sqlite WHERE id = ?").get(produtoId) as { estoque: number; ativo: number } | undefined;
    return result || null;
  },

  reduzirEstoque: (produtoId: string, quantidade: number) => {
    const db = getDb();
    const produto = db.prepare("SELECT estoque, ativo FROM produtos_sqlite WHERE id = ?").get(produtoId) as { estoque: number; ativo: number } | undefined;
    if (!produto) return false;
    
    const novoEstoque = Math.max(0, (produto.estoque || 0) - quantidade);
    const novoAtivo = novoEstoque > 0 ? 1 : 0;
    
    db.prepare("UPDATE produtos_sqlite SET estoque = ?, ativo = ? WHERE id = ?").run(novoEstoque, novoAtivo, produtoId);
    return true;
  },

  reporEstoque: (produtoId: string, quantidade: number) => {
    const db = getDb();
    const produto = db.prepare("SELECT estoque, ativo FROM produtos_sqlite WHERE id = ?").get(produtoId) as { estoque: number; ativo: number } | undefined;
    if (!produto) return false;
    
    const novoEstoque = (produto.estoque || 0) + quantidade;
    const novoAtivo = novoEstoque > 0 ? 1 : produto.ativo;
    
    db.prepare("UPDATE produtos_sqlite SET estoque = ?, ativo = ? WHERE id = ?").run(novoEstoque, novoAtivo, produtoId);
    return true;
  },
};
