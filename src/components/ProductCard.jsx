export default function ProductCard({ product, onAdd }) {
  return (
    <div className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-xl transition-all">
      <div className="relative">
        <img src={product.images?.[0] || "https://picsum.photos/seed/cloth/600/800"} alt={product.title} className="w-full aspect-[4/5] object-cover group-hover:scale-[1.02] transition" />
        <div className="absolute top-3 right-3 text-xs bg-black/70 text-white px-2 py-1 rounded-full">{product.category}</div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold line-clamp-1">{product.title}</h3>
        <p className="text-stone-500 text-sm line-clamp-2 min-h-[2.5rem]">{product.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold">Rs {product.price}</span>
          <button onClick={()=> onAdd?.(product)} className="px-3 py-1.5 rounded-lg bg-black text-white hover:bg-yellow-500 hover:text-black transition">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
