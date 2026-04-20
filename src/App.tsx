/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
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
  CheckCircle2
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
    price: 35,
    category: 'fundacao',
    image: 'https://images.unsplash.com/photo-1581092919535-7146ff1a5901?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    name: 'Areia Lavada (m³)',
    price: 120,
    category: 'fundacao',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    name: 'Cabo Elétrico 2.5mm 100m',
    price: 50,
    category: 'eletrica',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    name: 'Tinta Acrílica Premium 18L',
    price: 180,
    category: 'acabamento',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '5',
    name: 'Tijolo 8 Furos (Milheiro)',
    price: 750,
    category: 'fundacao',
    image: 'https://images.unsplash.com/photo-1590069230002-70cc8849c7dd?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '6',
    name: 'Interruptor Duplo',
    price: 15,
    category: 'eletrica',
    image: 'https://images.unsplash.com/photo-1621905252507-b354bcadc0d6?auto=format&fit=crop&q=80&w=800'
  }
];

const CATEGORIES = [
  { id: 'all', name: 'Todos', icon: LayoutGrid },
  { id: 'fundacao', name: 'Fundação', icon: HardHat },
  { id: 'eletrica', name: 'Elétrica', icon: Zap },
  { id: 'acabamento', name: 'Acabamento', icon: PaintBucket },
];

export default function App() {
  const [cart, setCart] = useState<Product[]>([]);
  const [filter, setFilter] = useState('all');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    if (filter === 'all') return PRODUCTS;
    return PRODUCTS.filter(p => p.category === filter);
  }, [filter]);

  const addToCart = (product: Product) => {
    setCart(prev => [...prev, product]);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const totalPrice = useMemo(() => cart.reduce((acc, p) => acc + p.price, 0), [cart]);

  const sendWhatsApp = () => {
    if (cart.length === 0) return;
    
    const items = cart.map(p => `- ${p.name} (R$ ${p.price})`).join('\n');
    const message = `Olá! Gostaria de fazer um pedido:\n\n${items}\n\n*Total: R$ ${totalPrice}*`;
    const url = `https://api.whatsapp.com/send?phone=5584994286142&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-32">
      {/* Header */}
      <header className="bg-[#0a4ea3] text-white py-12 px-6 shadow-lg overflow-hidden relative">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto max-w-4xl text-center relative z-10"
        >
          <img 
            src="https://i.imgur.com/FA5AHD7.png" 
            alt="VN Construção" 
            className="h-24 mx-auto mb-6 drop-shadow-xl"
            referrerPolicy="no-referrer"
          />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">VN Construção</h1>
          <p className="text-blue-100 text-lg font-light">Os melhores materiais para sua obra, direto no seu WhatsApp.</p>
        </motion.div>
        
        {/* Background Accent */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-400 opacity-10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-400 opacity-20 rounded-full blur-3xl pointer-events-none" />
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-4xl px-4 py-8">
        
        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 whitespace-nowrap border ${
                  filter === cat.id 
                    ? 'bg-[#0a4ea3] text-white border-[#0a4ea3] shadow-md shadow-blue-200 ring-2 ring-blue-100' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-[#0a4ea3] text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md shadow-sm">
                      {product.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-slate-800 mb-1 group-hover:text-[#0a4ea3] transition-colors">
                    {product.name}
                  </h3>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400 font-medium leading-none mb-1">Preço unitário</p>
                      <p className="text-2xl font-bold text-[#0a4ea3]">R$ {product.price}</p>
                    </div>
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-[#0a4ea3] hover:bg-blue-700 text-white p-3 rounded-xl transition-all active:scale-95 shadow-md shadow-blue-100"
                    >
                      <ShoppingBag size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* Cart Summary Bar */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md z-50"
          >
            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold relative">
                  {cart.length}
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                  </span>
                </div>
                <div>
                  <p className="font-semibold">{cart.length} itens no carrinho</p>
                  <p className="text-blue-300 text-sm font-medium">Total: R$ {totalPrice}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCheckoutModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl flex items-center gap-2 font-semibold transition-all active:scale-95 shadow-lg shadow-blue-900/20"
              >
                Finalizar
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        <motion.a 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          href="https://www.instagram.com/comercialvn/reels/" 
          target="_blank"
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-white shadow-lg shadow-pink-200"
        >
          <Instagram size={28} />
        </motion.a>
        <motion.a 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          href="https://api.whatsapp.com/send?phone=5584994286142" 
          target="_blank"
          className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-lg shadow-green-200"
        >
          <Phone size={28} />
        </motion.a>
      </div>

      {/* Checkout Modal / Cart View */}
      <AnimatePresence>
        {isCheckoutModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckoutModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ShoppingBag className="text-blue-600" />
                  Seu Pedido
                </h2>
                <button 
                  onClick={() => setIsCheckoutModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-grow bg-slate-50/50">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="mx-auto text-slate-200 w-16 h-16 mb-4" />
                    <p className="text-slate-500">Seu carrinho está vazio.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <p className="font-semibold text-slate-800">{item.name}</p>
                            <p className="text-blue-600 font-bold text-sm">R$ {item.price}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFromCart(idx)}
                          className="text-slate-300 hover:text-red-500 p-2 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-100 bg-white">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-slate-500 font-medium">Total do Pedido</p>
                  <p className="text-3xl font-bold text-[#0a4ea3]">R$ {totalPrice}</p>
                </div>
                <button 
                  onClick={sendWhatsApp}
                  disabled={cart.length === 0}
                  className="w-full bg-[#0a4ea3] hover:bg-blue-700 disabled:bg-slate-300 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Finalizar no WhatsApp
                    <CheckCircle2 size={24} />
                  </span>
                  <div className="absolute inset-0 bg-blue-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 mt-12 bg-white">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <img 
            src="https://i.imgur.com/FA5AHD7.png" 
            alt="VN Construção" 
            className="h-12 mx-auto mb-4 grayscale opacity-50"
            referrerPolicy="no-referrer"
          />
          <p className="text-slate-400 text-sm">© 2024 VN Construção - Sistema de Vendas Digital</p>
          <div className="flex justify-center gap-4 mt-4 text-slate-400">
            <a href="#" className="hover:text-blue-600 transition-colors">Produtos</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Sobre Nós</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

