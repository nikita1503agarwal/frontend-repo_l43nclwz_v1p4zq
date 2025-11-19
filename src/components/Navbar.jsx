import { ShoppingCart, User, Menu, MessageSquare } from "lucide-react";

export default function Navbar({ cartCount, onNavigate }){
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
        <button className="md:hidden p-2 hover:bg-stone-100 rounded-lg" onClick={()=> onNavigate?.("menu")}>
          <Menu size={20} />
        </button>
        <div className="font-extrabold text-xl">Barkati <span className="text-yellow-600">Cloth</span></div>
        <nav className="hidden md:flex gap-6 text-sm ml-8">
          <button onClick={()=> onNavigate?.("home")} className="hover:text-yellow-600">Home</button>
          <button onClick={()=> onNavigate?.("contact")} className="hover:text-yellow-600">Contact</button>
          <button onClick={()=> onNavigate?.("profile")} className="hover:text-yellow-600">Profile</button>
          <button onClick={()=> onNavigate?.("admin")} className="hover:text-yellow-600">Admin</button>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button className="relative p-2 hover:bg-stone-100 rounded-lg" onClick={()=> onNavigate?.("cart")}>
            <ShoppingCart />
            {cartCount > 0 && <span className="absolute -top-1 -right-1 text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded-full">{cartCount}</span>}
          </button>
          <button className="p-2 hover:bg-stone-100 rounded-lg" onClick={()=> onNavigate?.("profile")}><User /></button>
          <a className="p-2 hover:bg-stone-100 rounded-lg" href="https://wa.me/923001234567" target="_blank" rel="noreferrer"><MessageSquare /></a>
        </div>
      </div>
    </header>
  )
}
