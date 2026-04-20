/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Instagram, 
  Phone, 
  ChevronRight, 
  LayoutGrid, 
  Zap, 
  PaintBucket, 
  HardHat,
  X,
  CheckCircle2,
  Trash2,
  Plus,
  Minus,
  HelpCircle
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Cimento CP-II 50kg',
    price: 38.50,
    category: 'fundacao',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    name: 'Areia Lavada (m³)',
    price: 125.00,
    category: 'fundacao',
    image: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    name: 'Cabo Elétrico 2.5mm 100m',
    price: 54.90,
    category: 'eletrica',
    image: 'https://images.unsplash.com/photo-1558444458-5f75bc9ddbdc?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    name: 'Tinta Acrílica Premium 18L',
    price: 189.00,
    category: 'acabamento',
    image: 'https://images.unsplash.com/photo-1562157705-52c1664971be?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '5',
    name: 'Tijolo 8 Furos (Milheiro)',
    price: 780.00,
    category: 'fundacao',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '6',
    name: 'Interruptor Duplo',
    price: 18.50,
    category: 'eletrica',
    image: 'https://images.unsplash.com/photo-1621905252803-01046467367c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '7',
    name: 'Argamassa AC-I 20kg',
    price: 15.90,
    category: 'acabamento',
    image: 'https://images.unsplash.com/photo-1564360533031-628f2ca4b1c2?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '8',
    name: 'Disjuntor Monofásico 20A',
    price: 12.00,
    category: 'eletrica',
    image: 'https://images.unsplash.com/photo-1651558064560-6426466f9175?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '9',
    name: 'Tubo Esgoto 100mm 6m',
    price: 89.90,
    category: 'fundacao',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '10',
    name: 'Lâmpada LED 9W (Kit 5)',
    price: 45.00,
    category: 'eletrica',
    image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=800'
  }
];

const CATEGORIES = [
  { id: 'all', name: 'Todos os Produtos', icon: LayoutGrid },
  { id: 'fundacao', name: 'Fundação & Brutos', icon: HardHat },
  { id: 'eletrica', name: 'Elétrica & Iluminação', icon: Zap },
  { id: 'acabamento', name: 'Acabamento & Tintas', icon: PaintBucket },
];

export default function App() {
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
  const [filter, setFilter] = useState('all');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    if (filter === 'all') return PRODUCTS;
    return PRODUCTS.filter(p => p.category === filter);
  }, [filter]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      // Ensure we compare IDs reliably
      const productId = String(product.id);
      const existingIndex = prev.findIndex(item => String(item.product.id) === productId);
      
      if (existingIndex !== -1) {
        const newCart = [...prev];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + 1
        };
        return newCart;
      }
      
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => String(item.product.id) !== String(productId)));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      const targetId = String(productId);
      return prev.map(item => {
        if (String(item.product.id) === targetId) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const totalItems = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const totalPrice = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }, [cart]);

  const sendWhatsApp = () => {
    if (cart.length === 0) return;
    
    const items = cart.map(item => `- ${item.quantity}x ${item.product.name} (R$ ${item.product.price.toFixed(2)} cada)`).join('\n');
    const message = `Olá! Gostaria de fazer um pedido na VN Construção:\n\n${items}\n\n*Total do Pedido: R$ ${totalPrice.toFixed(2)}*`;
    const url = `https://api.whatsapp.com/send?phone=5584994286142&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-32">
      {/* Header */}
      <header className="bg-[#0a4ea3] text-white pt-12 pb-16 px-6 shadow-lg overflow-hidden relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="container mx-auto max-w-6xl text-center relative z-10"
        >
          {/* Logo with improved appearance: Circular crop to remove black background/colored borders */}
          <div className="relative inline-block mb-6 group">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl group-hover:bg-white/40 transition-all duration-500" />
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl relative bg-white flex items-center justify-center p-1">
               <img 
                src="https://i.imgur.com/FA5AHD7.png" 
                alt="VN Construção" 
                className="w-full h-full object-cover rounded-full scale-110" 
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 uppercase">VN Construção</h1>
          <p className="text-blue-100 text-lg font-light max-w-lg mx-auto">
            Qualidade e confiança para sua obra. <br className="hidden md:block" />
            Peça agora e finalize pelo WhatsApp.
          </p>
        </motion.div>
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-400 opacity-10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-400 opacity-20 rounded-full blur-3xl pointer-events-none" />
      </header>

      {/* Main Layout: Responsive Grid */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          
          {/* Sidebar Navigation */}
          <aside className="lg:sticky lg:top-8 h-fit space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 px-4">Categorias</h2>
              <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 no-scrollbar">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = filter === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setFilter(cat.id)}
                      className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 whitespace-nowrap lg:w-full group ${
                        isActive 
                          ? 'bg-[#0a4ea3] text-white shadow-lg shadow-blue-200 ring-2 ring-blue-50' 
                          : 'bg-transparent text-slate-600 hover:bg-blue-50 hover:text-[#0a4ea3]'
                      }`}
                    >
                      <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-white'}`}>
                        <Icon size={20} />
                      </div>
                      <span className="font-bold text-sm tracking-tight">{cat.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Shop Info Card */}
            <div className="hidden lg:block bg-[#0a4ea3] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
               <div className="relative z-10">
                <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2">Horário de Funcionamento</p>
                <p className="font-bold">Seg a Sex: 08h às 18h</p>
                <p className="font-bold">Sábado: 08h às 13h</p>
                <div className="mt-6 pt-6 border-t border-white/20">
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-100 mb-1">Localização</p>
                  <p className="text-sm">Rua Principal, 123 - Centro</p>
                </div>
               </div>
               <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-white/10 rounded-full blur-xl" />
            </div>
          </aside>

          {/* Product Grid Container */}
          <main>
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                {CATEGORIES.find(c => c.id === filter)?.name || 'Produtos'}
              </h2>
              <span className="bg-white border border-slate-200 px-4 py-1.5 rounded-full text-slate-500 text-sm font-bold shadow-sm">
                {filteredProducts.length} itens encontrados
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col"
                  >
                    <div className="aspect-[4/5] overflow-hidden relative">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-6 left-6">
                        <span className="bg-white/95 backdrop-blur-md text-[#0a4ea3] text-[10px] uppercase font-bold tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
                          {product.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-[#0a4ea3] transition-colors leading-tight">
                        {product.name}
                      </h3>
                      <div className="mt-auto pt-4 flex items-end justify-between">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Preço unitário</p>
                          <p className="text-3xl font-black text-[#0a4ea3]">
                            <span className="text-sm mr-1 font-bold italic">R$</span>
                            {product.price.toFixed(2)}
                          </p>
                        </div>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => addToCart(product)}
                          className="bg-[#0a4ea3] hover:bg-blue-700 text-white p-5 rounded-3xl transition-all shadow-xl shadow-blue-100 flex items-center justify-center"
                        >
                          <Plus size={24} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
                <ShoppingBag className="mx-auto w-16 h-16 text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest">Nenhum produto nesta categoria</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Cart Summary Bar: Fixed at bottom */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-4 right-4 md:left-auto md:right-8 md:w-[400px] z-50"
          >
            <div className="bg-slate-900/95 backdrop-blur-xl text-white p-5 rounded-[32px] shadow-2xl flex items-center justify-between border border-white/10">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl relative shadow-lg shadow-blue-900/40">
                  {totalItems}
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full animate-ping opacity-20" />
                </div>
                <div>
                  <p className="font-black text-lg tracking-tight">Total: R$ {totalPrice.toFixed(2)}</p>
                  <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">{totalItems} itens selecionados</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCheckoutModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl flex items-center gap-2 font-black uppercase text-sm tracking-widest transition-all active:scale-95 shadow-xl shadow-blue-900/40"
              >
                Checkout
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-40">
        {/* Balão de Dúvidas / Material não encontrado */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="bg-white px-4 py-2 rounded-2xl shadow-xl border border-blue-100 hidden md:block">
            <p className="text-[#0a4ea3] text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
              Não achou o que procurava?
            </p>
          </div>
          <motion.a 
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            href="https://api.whatsapp.com/send?phone=5584994286142&text=Olá! Não encontrei o que procurava no catálogo, pode me ajudar?" 
            target="_blank"
            className="w-16 h-16 rounded-[24px] bg-white flex items-center justify-center text-[#0a4ea3] shadow-2xl shadow-blue-100 border border-blue-100 group"
          >
            <HelpCircle size={32} className="group-hover:text-blue-600 transition-colors" />
          </motion.a>
        </motion.div>

        <div className="flex gap-3">
          <motion.a 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            href="https://www.instagram.com/comercialvn/reels/" 
            target="_blank"
            className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-white shadow-lg shadow-pink-200"
          >
            <Instagram size={28} />
          </motion.a>
          <motion.a 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            href="https://api.whatsapp.com/send?phone=5584994286142" 
            target="_blank"
            className="w-14 h-14 rounded-2xl bg-[#25D366] flex items-center justify-center text-white shadow-lg shadow-green-200"
          >
            <Phone size={28} />
          </motion.a>
        </div>
      </div>

      {/* Checkout Modal / Detailed Cart View */}
      <AnimatePresence>
        {isCheckoutModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckoutModalOpen(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50, rotateX: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-xl rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.4)] relative z-10 flex flex-col max-h-[85vh] border border-white/20"
            >
              <div className="px-8 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tight text-[#0a4ea3]">
                    <ShoppingBag size={28} />
                    Carrinho
                  </h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">{totalItems} itens no total</p>
                </div>
                <button 
                  onClick={() => setIsCheckoutModalOpen(false)}
                  className="p-3 bg-white hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-600 transition-all shadow-sm border border-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto flex-grow bg-white no-scrollbar">
                {cart.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingBag className="mx-auto text-slate-100 w-32 h-32 mb-6" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-lg">Seu carrinho está vazio</p>
                    <button 
                      onClick={() => setIsCheckoutModalOpen(false)}
                      className="mt-6 text-[#0a4ea3] font-black uppercase text-sm hover:underline"
                    >
                      Voltar para as compras
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item, idx) => (
                      <div key={item.product.id} className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-blue-100 hover:bg-blue-50/20 transition-all">
                        <div className="flex items-center gap-5">
                          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm border border-slate-50">
                            <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-black text-slate-800 text-lg leading-tight mb-1">{item.product.name}</p>
                            <p className="text-[#0a4ea3] font-black">R$ {item.product.price.toFixed(2)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                          <button 
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-black text-slate-700 w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                          <div className="w-px h-6 bg-slate-100 mx-1" />
                          <button 
                            onClick={() => removeFromCart(item.product.id)}
                            className="w-8 h-8 flex items-center justify-center text-red-100 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="px-8 py-8 border-t border-slate-100 bg-slate-50/80 backdrop-blur-xl">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Valor Total</p>
                    <p className="text-slate-500 text-sm font-medium">Incluindo todos os itens</p>
                  </div>
                  <div className="text-right">
                    <p className="text-5xl font-black text-[#0a4ea3] tracking-tighter">
                      <span className="text-xl mr-2 font-bold italic">R$</span>
                      {totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={sendWhatsApp}
                    disabled={cart.length === 0}
                    className="bg-[#0a4ea3] hover:bg-blue-700 disabled:bg-slate-300 text-white py-5 rounded-[28px] font-black text-xl shadow-[0_20px_40px_rgba(10,78,163,0.3)] transition-all flex items-center justify-center gap-4 relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center gap-3 uppercase tracking-tighter">
                      Enviar agora pelo WhatsApp
                      <CheckCircle2 size={28} />
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                  </motion.button>
                  <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    Você será redirecionado para o WhatsApp para confirmar seu pedido
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Visual Footer */}
      <footer className="py-20 bg-slate-900 text-white mt-12 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
               <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white mb-6 p-1">
                 <img 
                    src="https://i.imgur.com/FA5AHD7.png" 
                    alt="VN Construção" 
                    className="w-full h-full object-cover rounded-xl"
                    referrerPolicy="no-referrer"
                  />
               </div>
               <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">VN Construção</h3>
               <p className="text-slate-400 max-w-sm leading-relaxed">
                 Desde 1995 fornecendo materiais de qualidade extrema para a construção do seu sonho. Confiança que se constrói tijolo por tijolo.
               </p>
            </div>
            <div>
              <h4 className="font-black uppercase tracking-widest text-xs text-blue-400 mb-6 font-mono">Navegação</h4>
              <ul className="space-y-4 text-slate-300 font-bold text-sm uppercase tracking-tight">
                <li><a href="#" className="hover:text-white transition-colors">Catálogo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Trabalhe Conosco</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Unidades</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black uppercase tracking-widest text-xs text-green-400 mb-6 font-mono">Contato Direto</h4>
              <ul className="space-y-4 text-slate-300 font-bold text-sm tracking-tight">
                <li className="flex items-center gap-3">
                  <Phone size={16} className="text-slate-500" />
                  (84) 99428-6142
                </li>
                <li className="flex items-center gap-3">
                  <Instagram size={16} className="text-slate-500" />
                  @comercialvn
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">© 2024 VN Construção - Todos os direitos reservados</p>
            <div className="flex gap-8 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos</a>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-green-600" />
      </footer>
    </div>
  );
}

