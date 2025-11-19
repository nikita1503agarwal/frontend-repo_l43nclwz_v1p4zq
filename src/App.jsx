import { useEffect, useMemo, useState } from "react";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import Footer from "./components/Footer";

const API = import.meta.env.VITE_BACKEND_URL || "";

export default function App(){
  const [route, setRoute] = useState("home");
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(()=>{
    if(token && !user){
      fetch(`${API}/me`, { headers: { Authorization: `Bearer ${token}`}})
        .then(r=> r.ok ? r.json(): null)
        .then(u=> u && setUser(u));
    }
  }, [token]);

  useEffect(()=>{
    const url = new URL(`${API}/products`);
    if(search) url.searchParams.set("q", search);
    fetch(url).then(r=> r.json()).then(setProducts);
  }, [search]);

  const addToCart = (p)=>{
    setCart(prev=>{
      const exists = prev.find(i=> i.id === p.id);
      if(exists){
        return prev.map(i=> i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: p.id, title: p.title, price: p.price, image: p.images?.[0], quantity: 1 }];
    });
  };

  const total = useMemo(()=> cart.reduce((s,i)=> s + i.price * i.quantity, 0), [cart]);

  const checkout = async ()=>{
    const payload = {
      name: user?.name || "Guest",
      email: user?.email || "guest@example.com",
      address: "",
      payment_method: "JazzCash",
      items: cart.map(i=> ({ product_id: i.id, title: i.title, price: i.price, quantity: i.quantity, image: i.image }))
    };
    const r = await fetch(`${API}/orders`, { method: "POST", headers: { "Content-Type": "application/json", ...(token? { Authorization: `Bearer ${token}`}: {}) }, body: JSON.stringify(payload)});
    const order = await r.json();
    // Mock JazzCash payment via backend notify (success)
    await fetch(`${API}/payment/jazzcash/notify`, { method: "POST", headers: { "Content-Type": "application/json"}, body: JSON.stringify({ order_id: order.id, success: true })});
    alert("Payment successful! Order placed.");
    setCart([]);
    setRoute("home");
  };

  const authDemo = async ()=>{
    const email = prompt("Enter email");
    const password = "password";
    const name = "Guest";
    let res = await fetch(`${API}/auth/login`, { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({ email, password })});
    if(!res.ok){
      await fetch(`${API}/auth/register`, { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({ name, email, password })});
      res = await fetch(`${API}/auth/login`, { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({ email, password })});
    }
    const data = await res.json();
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  return (
    <div className="min-h-screen bg-white text-stone-900">
      <Navbar cartCount={cart.length} onNavigate={setRoute} />

      {route === "home" && (
        <>
          <Hero onSearch={setSearch} />
          <section className="max-w-7xl mx-auto px-6 py-10">
            <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(p => (
                <ProductCard key={p.id} product={p} onAdd={addToCart} />
              ))}
            </div>
          </section>
        </>
      )}

      {route === "cart" && (
        <section className="max-w-5xl mx-auto px-6 py-10">
          <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
          <div className="bg-white border rounded-xl divide-y">
            {cart.map((i,idx)=> (
              <div key={idx} className="flex items-center gap-4 p-4">
                <img src={i.image} alt="" className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="font-semibold">{i.title}</div>
                  <div className="text-sm text-stone-500">Rs {i.price}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=> setCart(c=> c.map((x,k)=> k===idx? {...x, quantity: Math.max(1, x.quantity-1)}: x))} className="px-2 py-1 border rounded">-</button>
                  <span>{i.quantity}</span>
                  <button onClick={()=> setCart(c=> c.map((x,k)=> k===idx? {...x, quantity: x.quantity+1}: x))} className="px-2 py-1 border rounded">+</button>
                </div>
                <button onClick={()=> setCart(c=> c.filter((_,k)=> k!==idx))} className="px-3 py-1 rounded bg-red-50 text-red-600 border border-red-200">Remove</button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-lg font-bold">Total: Rs {total}</div>
            <button onClick={checkout} className="px-5 py-3 rounded-xl bg-black text-white hover:bg-yellow-500 hover:text-black">Checkout (JazzCash)</button>
          </div>
        </section>
      )}

      {route === "profile" && (
        <section className="max-w-3xl mx-auto px-6 py-10">
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          {!user ? (
            <div className="space-y-3">
              <p>Login or Sign up to view orders.</p>
              <button onClick={authDemo} className="px-4 py-2 rounded-lg bg-black text-white">Login / Sign Up</button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>Name: {user.name}</div>
              <div>Email: {user.email}</div>
            </div>
          )}
        </section>
      )}

      {route === "contact" && (
        <section className="max-w-3xl mx-auto px-6 py-10">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <form onSubmit={async (e)=>{ e.preventDefault(); const fd = new FormData(e.currentTarget); const payload = { name: fd.get('name'), email: fd.get('email'), message: fd.get('message')}; await fetch(`${API}/messages`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload)}); alert('Message sent'); e.currentTarget.reset(); }} className="space-y-3 bg-white border rounded-xl p-6">
            <input name="name" required placeholder="Name" className="w-full px-4 py-2 rounded border" />
            <input name="email" required type="email" placeholder="Email" className="w-full px-4 py-2 rounded border" />
            <textarea name="message" required placeholder="Message" className="w-full px-4 py-2 rounded border min-h-32" />
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded bg-black text-white">Send</button>
              <a className="px-4 py-2 rounded bg-green-500 text-white" href="https://wa.me/923001234567" target="_blank" rel="noreferrer">WhatsApp</a>
            </div>
          </form>
        </section>
      )}

      {route === "admin" && (
        <section className="max-w-6xl mx-auto px-6 py-10">
          <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
          {!user ? (
            <div className="space-y-2">
              <p>Login as admin (we'll create a user and you can set role in DB).</p>
              <button onClick={authDemo} className="px-4 py-2 rounded bg-black text-white">Login</button>
            </div>
          ) : (
            <Admin token={token} />
          )}
        </section>
      )}

      <Footer />
    </div>
  );
}

function Admin({ token }){
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [prompt, setPrompt] = useState("");

  const adminFetch = async (path, opts={})=>{
    const r = await fetch(`${API}${path}`, { ...opts, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(opts.headers || {}) }});
    if(!r.ok) throw new Error('Request failed');
    return r.json();
  };

  useEffect(()=>{
    (async ()=>{
      try {
        setStats(await adminFetch('/admin/stats'));
        setProducts(await fetch(`${API}/products`).then(r=> r.json()));
        setOrders(await adminFetch('/admin/orders'));
        setUsers(await adminFetch('/admin/users'));
        setPrompt((await fetch(`${API}/chatbot/prompt`).then(r=> r.json())).prompt);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const saveProduct = async (e)=>{
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    payload.price = parseFloat(payload.price);
    payload.images = payload.images? payload.images.split(',').map(s=> s.trim()): [];
    payload.colors = payload.colors? payload.colors.split(',').map(s=> s.trim()): [];
    payload.sizes = payload.sizes? payload.sizes.split(',').map(s=> s.trim()): [];
    const created = await adminFetch('/admin/products', { method: 'POST', body: JSON.stringify(payload) });
    setProducts(p=> [created, ...p]);
    e.currentTarget.reset();
  };

  const updateStatus = async (orderId, status)=>{
    const updated = await adminFetch(`/admin/orders/${orderId}/status`, { method: 'PUT', body: JSON.stringify({ status })});
    setOrders(os=> os.map(o=> o.id===orderId? updated: o));
  };

  const savePrompt = async ()=>{
    const p = await adminFetch('/admin/chatbot/prompt', { method: 'POST', body: JSON.stringify({ prompt })});
    setPrompt(p.prompt);
  };

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      <div className="lg:col-span-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total Sales" value={`Rs ${stats?.total_sales ?? 0}`} />
        <Card title="Orders" value={stats?.total_orders ?? 0} />
        <Card title="Users" value={stats?.total_users ?? 0} />
        <Card title="Products" value={stats?.total_products ?? 0} />
      </div>

      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-xl font-semibold">Manage Products</h3>
        <form onSubmit={saveProduct} className="grid grid-cols-2 gap-3 bg-white border rounded-xl p-4">
          <input name="title" required placeholder="Title" className="col-span-2 px-3 py-2 rounded border" />
          <input name="price" required type="number" step="0.01" placeholder="Price" className="px-3 py-2 rounded border" />
          <input name="category" required placeholder="Category (Men/Women/Kids)" className="px-3 py-2 rounded border" />
          <input name="images" placeholder="Image URLs (comma separated)" className="col-span-2 px-3 py-2 rounded border" />
          <input name="colors" placeholder="Colors (comma separated)" className="px-3 py-2 rounded border" />
          <input name="sizes" placeholder="Sizes (comma separated)" className="px-3 py-2 rounded border" />
          <textarea name="description" placeholder="Description" className="col-span-2 px-3 py-2 rounded border" />
          <button className="col-span-2 px-4 py-2 rounded bg-black text-white">Add Product</button>
        </form>
        <div className="grid md:grid-cols-2 gap-3">
          {products.map(p=> (
            <div key={p.id} className="border rounded-xl p-3 flex gap-3">
              <img src={p.images?.[0]} className="w-20 h-20 rounded object-cover" />
              <div className="flex-1">
                <div className="font-semibold">{p.title}</div>
                <div className="text-sm">Rs {p.price} • {p.category}</div>
              </div>
              <button onClick={async ()=>{ await adminFetch(`/admin/products/${p.id}`, { method: 'DELETE' }); setProducts(ps=> ps.filter(x=> x.id!==p.id)); }} className="px-3 py-1 rounded bg-red-50 text-red-600 border">Delete</button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Orders</h3>
        <div className="space-y-3">
          {orders.map(o=> (
            <div key={o.id} className="border rounded-xl p-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{o.name} — Rs {o.total}</div>
                <div className="text-sm">{o.status} / {o.payment_status}</div>
              </div>
              <div className="flex gap-2 mt-2">
                {['Pending','Packed','Shipped','Delivered'].map(s=> (
                  <button key={s} onClick={()=> updateStatus(o.id, s)} className={`px-2 py-1 rounded border ${o.status===s? 'bg-yellow-100 border-yellow-300':'bg-white'}`}>{s}</button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-6">Chatbot Prompt</h3>
        <textarea value={prompt} onChange={(e)=> setPrompt(e.target.value)} className="w-full min-h-32 rounded border p-2" />
        <button onClick={savePrompt} className="px-4 py-2 rounded bg-black text-white">Save Prompt</button>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Users</h3>
        <div className="space-y-2">
          {users.map(u=> (
            <div key={u.id} className="border rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="font-semibold">{u.name}</div>
                <div className="text-sm text-stone-500">{u.email}</div>
              </div>
              <div className="flex gap-2">
                {!u.blocked ? (
                  <button onClick={async ()=>{ await adminFetch(`/admin/users/${u.id}/block`, { method: 'POST' }); setUsers(us=> us.map(x=> x.id===u.id? { ...x, blocked: true }: x)); }} className="px-3 py-1 rounded border">Block</button>
                ) : (
                  <button onClick={async ()=>{ await adminFetch(`/admin/users/${u.id}/unblock`, { method: 'POST' }); setUsers(us=> us.map(x=> x.id===u.id? { ...x, blocked: false }: x)); }} className="px-3 py-1 rounded border">Unblock</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }){
  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="text-sm text-stone-500">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}
