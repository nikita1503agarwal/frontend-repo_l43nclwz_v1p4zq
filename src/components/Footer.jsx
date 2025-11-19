export default function Footer(){
  return (
    <footer className="bg-black text-stone-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="text-white font-extrabold text-lg">Barkati Cloth Store</div>
          <p className="text-sm mt-2">Elegance in every thread. Quality you can feel.</p>
        </div>
        <div>
          <div className="text-white font-semibold mb-2">Categories</div>
          <ul className="space-y-1 text-sm">
            <li>Men</li>
            <li>Women</li>
            <li>Kids</li>
          </ul>
        </div>
        <div>
          <div className="text-white font-semibold mb-2">Support</div>
          <ul className="space-y-1 text-sm">
            <li>Contact</li>
            <li>Returns</li>
            <li>Shipping</li>
          </ul>
        </div>
        <div>
          <div className="text-white font-semibold mb-2">Follow</div>
          <div className="flex gap-3 text-white/80">
            <a href="#" className="hover:text-yellow-500">Facebook</a>
            <a href="#" className="hover:text-yellow-500">Instagram</a>
            <a href="#" className="hover:text-yellow-500">Twitter</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs">© {new Date().getFullYear()} Barkati Cloth Store</div>
    </footer>
  )
}
