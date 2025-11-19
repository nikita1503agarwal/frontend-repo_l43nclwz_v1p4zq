import { motion } from "framer-motion";

export default function Hero({ onSearch }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-black via-stone-900 to-black text-white">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-[32rem] h-[32rem] bg-white/5 rounded-full blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Barkati Cloth Store
            </h1>
            <p className="text-stone-300 mt-4 max-w-prose">
              Elegant clothing for Men, Women, and Kids. Discover premium fabrics and timeless styles.
            </p>
            <div className="mt-6 flex gap-3">
              <input onChange={(e)=> onSearch?.(e.target.value)} placeholder="Search products..." className="w-full max-w-md px-4 py-3 rounded-xl bg-stone-800/70 border border-stone-700 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
              <button className="px-5 py-3 rounded-xl bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition">Search</button>
            </div>
            <div className="mt-6 flex gap-3 text-sm text-stone-300">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">Men</span>
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">Women</span>
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">Kids</span>
              <button className="ml-auto px-3 py-1 rounded-full bg-stone-800 border border-stone-700" onClick={()=>{
                const urdu = document.documentElement.dir === 'rtl' ? 'ltr' : 'rtl';
                document.documentElement.dir = urdu;
              }}>Urdu/English</button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="relative">
            <div className="aspect-[4/5] rounded-3xl bg-[url('https://images.unsplash.com/photo-1629380321590-3b3f75d66dec?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwcG90dGVyeSUyMGhhbmRtYWRlfGVufDB8MHx8fDE3NjM1MTI1ODN8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80')] bg-cover bg-center shadow-2xl shadow-yellow-500/10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
