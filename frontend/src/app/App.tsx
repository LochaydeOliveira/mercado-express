import { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  Home,
  Package,
  PlusCircle,
  List,
  User,
  LogOut,
  X,
  ChevronRight,
  ArrowLeft,
  Check,
  Clock,
  Edit2,
  Trash2,
  MoreVertical,
  Eye,
  Camera,
  ShoppingCart,
  Tag,
  AlertCircle,
  Info,
  CheckCircle,
  Menu,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Screen =
  | "login"
  | "home"
  | "products"
  | "add-product"
  | "edit-product"
  | "notifications";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  updatedAt: string;
  updatedBy: string;
  image: string;
  category: string;
}

interface Notification {
  id: string;
  icon: "info" | "success" | "alert" | "star";
  title: string;
  description: string;
  date: string;
  read: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Coca-Cola 2L",
    description: "Refrigerante sabor cola, garrafa 2 litros",
    price: 9.99,
    unit: "Garrafa",
    updatedAt: "12/07/2025",
    updatedBy: "João Silva",
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop&auto=format",
    category: "Bebidas",
  },
  {
    id: "2",
    name: "Arroz Tio João 5kg",
    description: "Arroz branco tipo 1, pacote 5kg",
    price: 24.9,
    unit: "Pacote",
    updatedAt: "11/07/2025",
    updatedBy: "Maria Santos",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop&auto=format",
    category: "Grãos",
  },
  {
    id: "3",
    name: "Feijão Carioca 1kg",
    description: "Feijão carioca tipo 1, pacote 1kg",
    price: 8.5,
    unit: "Pacote",
    updatedAt: "10/07/2025",
    updatedBy: "João Silva",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&auto=format",
    category: "Grãos",
  },
  {
    id: "4",
    name: "Leite Integral 1L",
    description: "Leite integral UHT, caixa 1 litro",
    price: 5.49,
    unit: "Caixa",
    updatedAt: "12/07/2025",
    updatedBy: "Ana Costa",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop&auto=format",
    category: "Laticínios",
  },
  {
    id: "5",
    name: "Pão de Forma 500g",
    description: "Pão de forma tradicional, embalagem 500g",
    price: 7.9,
    unit: "Pacote",
    updatedAt: "11/07/2025",
    updatedBy: "Maria Santos",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&auto=format",
    category: "Padaria",
  },
  {
    id: "6",
    name: "Frango Peito 1kg",
    description: "Peito de frango congelado sem osso, 1kg",
    price: 18.9,
    unit: "Kg",
    updatedAt: "09/07/2025",
    updatedBy: "João Silva",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop&auto=format",
    category: "Carnes",
  },
];

const NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    icon: "alert",
    title: "Preço atualizado",
    description: "Coca-Cola 2L teve o preço alterado de R$ 8,99 para R$ 9,99",
    date: "Hoje, 14:32",
    read: false,
  },
  {
    id: "2",
    icon: "success",
    title: "Produto cadastrado",
    description: "Frango Peito 1kg foi adicionado ao catálogo com sucesso",
    date: "Hoje, 09:15",
    read: false,
  },
  {
    id: "3",
    icon: "info",
    title: "Estoque baixo",
    description: "Atenção: Leite Integral 1L com menos de 10 unidades",
    date: "Ontem, 18:00",
    read: true,
  },
  {
    id: "4",
    icon: "star",
    title: "Produto mais consultado",
    description: "Arroz Tio João 5kg foi o produto mais buscado da semana",
    date: "Ontem, 12:00",
    read: true,
  },
  {
    id: "5",
    icon: "alert",
    title: "Cadastro pendente",
    description: "3 produtos aguardam confirmação de preço",
    date: "10/07/2025",
    read: true,
  },
];

const RECENT_SEARCHES = ["Coca-Cola", "Arroz", "Feijão", "Leite"];

const UNITS = ["Unidade", "Kg", "Litro", "Garrafa", "Caixa", "Pacote", "Lata", "Pote", "Dúzia"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const notifIcon = (type: Notification["icon"]) => {
  const base = "w-5 h-5";
  if (type === "alert") return <AlertCircle className={`${base} text-[#ffd600]`} />;
  if (type === "success") return <CheckCircle className={`${base} text-[#30d158]`} />;
  if (type === "star") return <Star className={`${base} text-[#ff9f0a]`} />;
  return <Info className={`${base} text-[#0a84ff]`} />;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProductCard({ product, onDetails }: { product: Product; onDetails: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl overflow-hidden border border-border"
    >
      <div className="relative h-48 bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
          {product.category}
        </span>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-lg leading-tight">{product.name}</h3>
          <p className="text-muted-foreground text-sm mt-0.5">{product.unit}</p>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-muted-foreground text-xs">Preço atual</p>
            <p className="text-4xl font-extrabold text-primary tracking-tight">
              {fmt(product.price)}
            </p>
          </div>
          <button
            onClick={onDetails}
            className="bg-primary text-primary-foreground font-semibold text-sm px-5 py-2.5 rounded-xl active:scale-95 transition-transform"
          >
            Detalhes
          </button>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs pt-1 border-t border-border">
          <Clock className="w-3.5 h-3.5" />
          <span>Atualizado em {product.updatedAt}</span>
        </div>
      </div>
    </motion.div>
  );
}

function DetailModal({ product, onClose, onEdit }: { product: Product; onClose: () => void; onEdit: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="w-full max-w-md bg-card rounded-t-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-64 bg-muted">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4">
            <span className="bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
              {product.category}
            </span>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <p className="text-muted-foreground text-sm mt-1">{product.description}</p>
          </div>
          <div className="bg-secondary rounded-2xl p-4">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest mb-1">Preço</p>
            <p className="text-5xl font-black text-primary tracking-tight">{fmt(product.price)}</p>
            <p className="text-muted-foreground text-sm mt-1">por {product.unit}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-secondary rounded-xl p-3">
              <p className="text-muted-foreground text-xs mb-0.5">Tipo</p>
              <p className="font-semibold">{product.unit}</p>
            </div>
            <div className="bg-secondary rounded-xl p-3">
              <p className="text-muted-foreground text-xs mb-0.5">Atualizado em</p>
              <p className="font-semibold">{product.updatedAt}</p>
            </div>
            <div className="bg-secondary rounded-xl p-3 col-span-2">
              <p className="text-muted-foreground text-xs mb-0.5">Responsável</p>
              <p className="font-semibold">{product.updatedBy}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={onClose}
              className="py-3.5 rounded-2xl bg-secondary text-foreground font-semibold text-base active:scale-95 transition-transform"
            >
              Fechar
            </button>
            <button
              onClick={onEdit}
              className="py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-base active:scale-95 transition-transform"
            >
              Editar
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SideMenu({
  open,
  onClose,
  onNav,
  currentScreen,
}: {
  open: boolean;
  onClose: () => void;
  onNav: (s: Screen) => void;
  currentScreen: Screen;
}) {
  const items: { icon: React.ReactNode; label: string; screen: Screen }[] = [
    { icon: <Home className="w-5 h-5" />, label: "Início", screen: "home" },
    { icon: <Search className="w-5 h-5" />, label: "Consultar Produtos", screen: "home" },
    { icon: <PlusCircle className="w-5 h-5" />, label: "Cadastrar Produto", screen: "add-product" },
    { icon: <List className="w-5 h-5" />, label: "Lista de Produtos", screen: "products" },
    { icon: <Bell className="w-5 h-5" />, label: "Notificações", screen: "notifications" },
    { icon: <User className="w-5 h-5" />, label: "Perfil", screen: "home" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-sidebar flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-sidebar-border">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-lg">MercadoApp</span>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format"
                  alt="João Silva"
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-primary"
                />
                <div>
                  <p className="font-semibold text-sm">João Silva</p>
                  <p className="text-muted-foreground text-xs">Funcionário</p>
                </div>
              </div>
            </div>
            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {items.map((item) => {
                const active = currentScreen === item.screen && item.screen !== "home" || (item.label === "Início" && currentScreen === "home");
                return (
                  <button
                    key={item.label}
                    onClick={() => { onNav(item.screen); onClose(); }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                      active
                        ? "bg-primary/15 text-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}
                  >
                    <span className={active ? "text-primary" : "text-muted-foreground"}>
                      {item.icon}
                    </span>
                    {item.label}
                    {active && <ChevronRight className="w-4 h-4 ml-auto text-primary" />}
                  </button>
                );
              })}
            </nav>
            {/* Footer */}
            <div className="p-4 border-t border-sidebar-border">
              <button
                onClick={() => { onNav("login" as Screen); onClose(); }}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors active:scale-95"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Screens ──────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-lg shadow-primary/30 mb-4">
            <ShoppingCart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-foreground">MercadoApp</h1>
          <p className="text-muted-foreground text-sm mt-1">Consulta de preços rápida</p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-3xl p-6 border border-border space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground block mb-2">Usuário</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.usuario"
              className="w-full bg-secondary rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-all text-base"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground block mb-2">Senha</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-secondary rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-all text-base"
            />
          </div>

          {/* Remember */}
          <button
            onClick={() => setRemember(!remember)}
            className="flex items-center gap-3 w-full py-1 active:scale-95 transition-transform"
          >
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${remember ? "bg-primary border-primary" : "border-border"}`}>
              {remember && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="text-sm text-muted-foreground">Lembrar login</span>
          </button>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-bold text-lg py-4 rounded-2xl active:scale-95 transition-all shadow-lg shadow-primary/30 disabled:opacity-70 mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Entrando...
              </span>
            ) : "Entrar"}
          </button>
        </div>

        <p className="text-center text-muted-foreground text-xs mt-6">
          v1.0.0 · MercadoApp © 2025
        </p>
      </motion.div>
    </div>
  );
}

function HomeScreen({
  onOpenMenu,
  onShowDetail,
  onNotifications,
}: {
  onOpenMenu: () => void;
  onShowDetail: (p: Product) => void;
  onNotifications: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const search = (q: string) => {
    setQuery(q);
    if (!q.trim()) { setResults([]); setSearched(false); return; }
    const found = PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(q.toLowerCase())
    );
    setResults(found);
    setSearched(true);
  };

  const unread = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/15 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md mx-auto px-4 pb-28">
        {/* Header */}
        <div className="flex items-center justify-between pt-12 pb-6">
          <div className="flex items-center gap-3">
            <button onClick={onOpenMenu} className="active:scale-90 transition-transform">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format"
                alt="João"
                className="w-11 h-11 rounded-full object-cover ring-2 ring-primary"
              />
            </button>
            <div>
              <p className="text-muted-foreground text-sm">Bem-vindo de volta 👋</p>
              <p className="font-bold text-xl leading-tight">Olá, João</p>
            </div>
          </div>
          <button
            onClick={onNotifications}
            className="relative w-11 h-11 bg-card border border-border rounded-2xl flex items-center justify-center active:scale-90 transition-transform"
          >
            <Bell className="w-5 h-5 text-foreground" />
            {unread > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => search(e.target.value)}
            placeholder="Buscar produto..."
            className="w-full bg-card border border-border rounded-2xl pl-12 pr-12 py-4 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-all text-base font-medium"
          />
          {query && (
            <button
              onClick={() => search("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 bg-muted rounded-full flex items-center justify-center active:scale-90 transition-transform"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Recent searches (shown when no query) */}
        {!query && (
          <div className="mb-6">
            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-widest mb-3">
              Buscas recentes
            </p>
            <div className="flex flex-wrap gap-2">
              {RECENT_SEARCHES.map((s) => (
                <button
                  key={s}
                  onClick={() => { search(s); inputRef.current?.focus(); }}
                  className="bg-secondary border border-border text-foreground text-sm font-medium px-4 py-2 rounded-full active:scale-95 transition-transform flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {searched && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground text-xs font-semibold uppercase tracking-widest">
                {results.length} resultado{results.length !== 1 ? "s" : ""}
              </p>
              {results.length > 0 && (
                <span className="text-xs text-muted-foreground">para &ldquo;{query}&rdquo;</span>
              )}
            </div>
            {results.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-secondary rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="font-bold text-lg mb-1">Produto não encontrado</p>
                <p className="text-muted-foreground text-sm">Tente outro nome ou cadastre o produto</p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((p) => (
                  <ProductCard key={p.id} product={p} onDetails={() => onShowDetail(p)} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Hero section when idle */}
        {!query && (
          <div className="mt-2">
            <div className="bg-card border border-border rounded-3xl p-5 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/15 rounded-2xl flex items-center justify-center">
                  <Tag className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-sm">Consulta rápida</p>
                  <p className="text-muted-foreground text-xs">{PRODUCTS.length} produtos cadastrados</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Digite o nome do produto no campo acima para encontrar o preço instantaneamente.
              </p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card border border-border rounded-2xl p-4">
                <p className="text-muted-foreground text-xs mb-1">Hoje</p>
                <p className="text-2xl font-black text-foreground">47</p>
                <p className="text-muted-foreground text-xs">consultas</p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <p className="text-muted-foreground text-xs mb-1">Mais buscado</p>
                <p className="text-base font-bold text-foreground leading-tight">Coca-Cola 2L</p>
                <p className="text-muted-foreground text-xs">12 vezes</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductsScreen({
  onBack,
  onEdit,
}: {
  onBack: () => void;
  onEdit: (p: Product) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const filtered = PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 pb-28">
        {/* Header */}
        <div className="flex items-center gap-4 pt-12 pb-6">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-card border border-border rounded-2xl flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-xl flex-1">Lista de Produtos</h1>
          {selected && (
            <button
              onClick={() => {
                const p = PRODUCTS.find((x) => x.id === selected);
                if (p) onEdit(p);
              }}
              className="bg-primary text-primary-foreground text-sm font-bold px-4 py-2 rounded-xl active:scale-95 transition-transform flex items-center gap-1.5"
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </button>
          )}
        </div>

        {/* Search filter */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filtrar..."
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        <p className="text-muted-foreground text-xs mb-3">
          {filtered.length} produto{filtered.length !== 1 ? "s" : ""}
        </p>

        <div className="space-y-2">
          {filtered.map((p) => (
            <div key={p.id} className="relative">
              <button
                onClick={() => setSelected(selected === p.id ? null : p.id)}
                className={`w-full flex items-center gap-3 bg-card border rounded-2xl p-3.5 active:scale-98 transition-all ${
                  selected === p.id ? "border-primary" : "border-border"
                }`}
              >
                {/* Radio */}
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  selected === p.id ? "border-primary bg-primary" : "border-border"
                }`}>
                  {selected === p.id && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>

                {/* Thumb */}
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 text-left min-w-0">
                  <p className="font-semibold text-sm truncate">{p.name}</p>
                  <p className="text-primary font-bold text-base">{fmt(p.price)}</p>
                  <p className="text-muted-foreground text-xs">{p.updatedAt}</p>
                </div>

                {/* Menu trigger */}
                <button
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === p.id ? null : p.id); }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary active:scale-90 transition-all flex-shrink-0"
                >
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              </button>

              {/* Dropdown menu */}
              <AnimatePresence>
                {menuOpen === p.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    className="absolute right-3 top-16 z-20 bg-popover border border-border rounded-2xl shadow-2xl p-1 min-w-36"
                  >
                    <button
                      onClick={() => { onEdit(p); setMenuOpen(null); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm hover:bg-secondary transition-colors text-foreground"
                    >
                      <Edit2 className="w-4 h-4 text-muted-foreground" />
                      Editar
                    </button>
                    <button
                      onClick={() => setMenuOpen(null)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm hover:bg-secondary transition-colors text-foreground"
                    >
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      Detalhes
                    </button>
                    <div className="h-px bg-border my-1" />
                    <button
                      onClick={() => setMenuOpen(null)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm hover:bg-red-500/10 transition-colors text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductFormScreen({
  mode,
  product,
  onBack,
  onSave,
}: {
  mode: "add" | "edit";
  product?: Product;
  onBack: () => void;
  onSave: () => void;
}) {
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [unit, setUnit] = useState(product?.unit || "Unidade");
  const [date, setDate] = useState(product?.updatedAt || new Date().toLocaleDateString("pt-BR"));
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onSave(); }, 1200);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 pb-28">
        {/* Header */}
        <div className="flex items-center gap-4 pt-12 pb-6">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-card border border-border rounded-2xl flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-xl flex-1">
            {mode === "add" ? "Cadastrar Produto" : "Editar Produto"}
          </h1>
        </div>

        {/* Photo upload */}
        <div className="mb-5">
          <div
            className={`relative h-44 rounded-3xl overflow-hidden border-2 border-dashed flex items-center justify-center cursor-pointer transition-all ${
              product ? "border-transparent" : "border-border hover:border-primary/50"
            }`}
          >
            {product ? (
              <>
                <img src={product.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 flex items-center gap-2 text-white text-sm font-semibold">
                    <Camera className="w-4 h-4" />
                    Trocar foto
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <Camera className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Adicionar foto</p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">Toque para escolher</p>
              </div>
            )}
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {[
            { label: "Nome do Produto", value: name, setter: setName, placeholder: "Ex: Coca-Cola 2L" },
            { label: "Descrição", value: description, setter: setDescription, placeholder: "Breve descrição do produto" },
          ].map(({ label, value, setter, placeholder }) => (
            <div key={label}>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-2">
                {label}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-card border border-border rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-all text-base"
              />
            </div>
          ))}

          {/* Price */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-2">
              Preço
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-lg">R$</span>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0,00"
                className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-3.5 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-all text-2xl font-black"
              />
            </div>
          </div>

          {/* Unit */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-2">
              Tipo de Unidade
            </label>
            <div className="flex flex-wrap gap-2">
              {UNITS.map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all active:scale-95 ${
                    unit === u
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border text-muted-foreground"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-2">
              Data de Atualização
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="dd/mm/aaaa"
              className="w-full bg-card border border-border rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-all text-base"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="mt-8">
          <button
            onClick={handleSave}
            className={`w-full font-bold text-lg py-4 rounded-2xl active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 ${
              mode === "edit"
                ? "bg-primary text-primary-foreground shadow-primary/30"
                : "bg-primary text-primary-foreground shadow-primary/30"
            }`}
          >
            {saved ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Salvo!
              </>
            ) : (
              mode === "add" ? "Salvar Produto" : "Atualizar Produto"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function NotificationsScreen({ onBack }: { onBack: () => void }) {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const visible = filter === "all" ? notifications : notifications.filter((n) => !n.read);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 pb-28">
        {/* Header */}
        <div className="flex items-center gap-4 pt-12 pb-6">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-card border border-border rounded-2xl flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-xl">Notificações</h1>
            {unreadCount > 0 && (
              <p className="text-muted-foreground text-xs">{unreadCount} não lida{unreadCount !== 1 ? "s" : ""}</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-primary text-sm font-semibold active:scale-95 transition-transform"
            >
              Marcar tudo
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground"
              }`}
            >
              {f === "all" ? "Todas" : "Não lidas"}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {visible.map((n) => (
            <motion.button
              key={n.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setNotifications((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x))}
              className={`w-full flex items-start gap-3.5 bg-card border rounded-2xl p-4 text-left active:scale-98 transition-all ${
                !n.read ? "border-primary/30" : "border-border"
              }`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                !n.read ? "bg-primary/15" : "bg-secondary"
              }`}>
                {notifIcon(n.icon)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-0.5">
                  <p className="font-semibold text-sm leading-tight">{n.title}</p>
                  {!n.read && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />}
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">{n.description}</p>
                <p className="text-muted-foreground/60 text-xs mt-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {n.date}
                </p>
              </div>
            </motion.button>
          ))}
          {visible.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-secondary rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="font-bold text-lg mb-1">Tudo em dia!</p>
              <p className="text-muted-foreground text-sm">Nenhuma notificação não lida</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Bottom Navigation ────────────────────────────────────────────────────────

function BottomNav({
  current,
  onNav,
}: {
  current: Screen;
  onNav: (s: Screen) => void;
}) {
  const items = [
    { icon: <Home className="w-5 h-5" />, label: "Início", screen: "home" as Screen },
    { icon: <Search className="w-5 h-5" />, label: "Buscar", screen: "home" as Screen },
    { icon: <PlusCircle className="w-6 h-6" />, label: "", screen: "add-product" as Screen, fab: true },
    { icon: <List className="w-5 h-5" />, label: "Produtos", screen: "products" as Screen },
    { icon: <Bell className="w-5 h-5" />, label: "Avisos", screen: "notifications" as Screen },
  ];

  const unread = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30">
      <div className="max-w-md mx-auto px-4 pb-6">
        <div className="bg-card border border-border rounded-3xl px-2 py-2 flex items-center justify-around shadow-2xl shadow-black/50">
          {items.map((item, i) => {
            const active = current === item.screen && !item.fab;
            if (item.fab) {
              return (
                <button
                  key={i}
                  onClick={() => onNav(item.screen)}
                  className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center active:scale-90 transition-transform shadow-lg shadow-primary/40 -mt-6"
                >
                  {item.icon}
                </button>
              );
            }
            return (
              <button
                key={i}
                onClick={() => onNav(item.screen)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all active:scale-90 relative ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <span className="relative">
                  {item.icon}
                  {item.screen === "notifications" && unread > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {unread}
                    </span>
                  )}
                </span>
                {item.label && (
                  <span className="text-[10px] font-semibold">{item.label}</span>
                )}
                {active && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -bottom-0.5 w-4 h-0.5 bg-primary rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Desktop Sidebar ──────────────────────────────────────────────────────────

function DesktopSidebar({ current, onNav }: { current: Screen; onNav: (s: Screen) => void }) {
  const items: { icon: React.ReactNode; label: string; screen: Screen }[] = [
    { icon: <Home className="w-5 h-5" />, label: "Início", screen: "home" },
    { icon: <PlusCircle className="w-5 h-5" />, label: "Cadastrar", screen: "add-product" },
    { icon: <List className="w-5 h-5" />, label: "Produtos", screen: "products" },
    { icon: <Bell className="w-5 h-5" />, label: "Notificações", screen: "notifications" },
  ];
  const unread = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="w-64 flex-shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-black text-base leading-none">MercadoApp</p>
            <p className="text-muted-foreground text-xs mt-0.5">Consulta de preços</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const active = current === item.screen;
          return (
            <button
              key={item.label}
              onClick={() => onNav(item.screen)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all active:scale-95 relative ${
                active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              }`}
            >
              {item.icon}
              {item.label}
              {item.screen === "notifications" && unread > 0 && (
                <span className="ml-auto bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {unread}
                </span>
              )}
              {active && !( item.screen === "notifications" && unread > 0) && (
                <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-2">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format"
            alt="João"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-primary"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">João Silva</p>
            <p className="text-muted-foreground text-xs">Funcionário</p>
          </div>
          <button className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors text-muted-foreground hover:text-red-400">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [menuOpen, setMenuOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [editProduct, setEditProduct] = useState<Product | undefined>(undefined);
  const [prevScreen, setPrevScreen] = useState<Screen>("home");

  const navigate = (s: Screen) => {
    setPrevScreen(screen);
    setScreen(s);
  };

  const goBack = () => navigate(prevScreen === screen ? "home" : prevScreen);

  const isLoggedIn = screen !== "login";
  const showNav = isLoggedIn && screen !== "add-product" && screen !== "edit-product";

  // Apply dark class to html
  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.body.style.fontFamily = "'Poppins', sans-serif";
  }, []);

  return (
    <div className="bg-background text-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Mobile layout */}
      <div className="lg:hidden min-h-screen">
        <AnimatePresence mode="wait">
          {screen === "login" && (
            <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoginScreen onLogin={() => navigate("home")} />
            </motion.div>
          )}
          {screen === "home" && (
            <motion.div key="home" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <HomeScreen
                onOpenMenu={() => setMenuOpen(true)}
                onShowDetail={(p) => setDetailProduct(p)}
                onNotifications={() => navigate("notifications")}
              />
            </motion.div>
          )}
          {screen === "products" && (
            <motion.div key="products" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <ProductsScreen
                onBack={goBack}
                onEdit={(p) => { setEditProduct(p); navigate("edit-product"); }}
              />
            </motion.div>
          )}
          {screen === "add-product" && (
            <motion.div key="add-product" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <ProductFormScreen mode="add" onBack={goBack} onSave={() => navigate("products")} />
            </motion.div>
          )}
          {screen === "edit-product" && (
            <motion.div key="edit-product" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <ProductFormScreen mode="edit" product={editProduct} onBack={goBack} onSave={() => navigate("products")} />
            </motion.div>
          )}
          {screen === "notifications" && (
            <motion.div key="notifications" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <NotificationsScreen onBack={goBack} />
            </motion.div>
          )}
        </AnimatePresence>

        {showNav && <BottomNav current={screen} onNav={navigate} />}

        <SideMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          onNav={navigate}
          currentScreen={screen}
        />
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:flex min-h-screen">
        {isLoggedIn && <DesktopSidebar current={screen} onNav={navigate} />}

        <div className="flex-1 overflow-y-auto">
          {screen === "login" && <LoginScreen onLogin={() => navigate("home")} />}
          {screen === "home" && (
            <HomeScreen
              onOpenMenu={() => {}}
              onShowDetail={(p) => setDetailProduct(p)}
              onNotifications={() => navigate("notifications")}
            />
          )}
          {screen === "products" && (
            <ProductsScreen
              onBack={goBack}
              onEdit={(p) => { setEditProduct(p); navigate("edit-product"); }}
            />
          )}
          {screen === "add-product" && (
            <ProductFormScreen mode="add" onBack={goBack} onSave={() => navigate("products")} />
          )}
          {screen === "edit-product" && (
            <ProductFormScreen mode="edit" product={editProduct} onBack={goBack} onSave={() => navigate("products")} />
          )}
          {screen === "notifications" && <NotificationsScreen onBack={goBack} />}
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {detailProduct && (
          <DetailModal
            product={detailProduct}
            onClose={() => setDetailProduct(null)}
            onEdit={() => {
              setEditProduct(detailProduct);
              setDetailProduct(null);
              navigate("edit-product");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
