import { useState, useEffect, useRef } from "react";

// ── Initial product data ──────────────────────────────────────────────────────
const INITIAL_PRODUCTS = [
  { id: 1, name: "Wahl Magic Clip", category: "Clippers", price: 89.99, stock: 12, image: "✂️", desc: "Professionele draadloze tondeuse, ideaal voor fade cuts." },
  { id: 2, name: "Andis Master", category: "Clippers", price: 124.99, stock: 8, image: "⚡", desc: "Krachtige AC-motor tondeuse, barbershop favoriet." },
  { id: 3, name: "BaByliss FX870", category: "Trimmers", price: 69.99, stock: 20, image: "🔪", desc: "Precisie trimmer voor haarlijnen en baarden." },
  { id: 4, name: "Oster Fast Feed", category: "Clippers", price: 79.99, stock: 5, image: "💈", desc: "Aanpasbare meslengte, perfect voor blends." },
  { id: 5, name: "Kappersschaar 6\"", category: "Scissors", price: 45.99, stock: 15, image: "✂️", desc: "Japans staal, ergonomisch handvat." },
  { id: 6, name: "Barber Cape Pro", category: "Accessories", price: 18.99, stock: 30, image: "🧥", desc: "Waterdicht, met klittenband kraag." },
  { id: 7, name: "Shaving Cream Gold", category: "Products", price: 12.99, stock: 25, image: "🫧", desc: "Premium scheerschuim, 500ml." },
  { id: 8, name: "Edge Up Blade Pack", category: "Blades", price: 9.99, stock: 50, image: "🗡️", desc: "10 stuks vervangmesjes, universeel." },
];

const CATEGORIES = ["Alle", "Clippers", "Trimmers", "Scissors", "Accessories", "Products", "Blades"];

const FAQ_DATA = [
  { q: "Hoe lang duurt levering?", a: "Bestellingen worden binnen 2-4 werkdagen geleverd. Voor Suriname kan dit 5-7 werkdagen zijn." },
  { q: "Kan ik retourneren?", a: "Ja, binnen 14 dagen na ontvangst. Product moet ongebruikt zijn in originele verpakking." },
  { q: "Accepteren jullie betaling via WhatsApp?", a: "Wij accepteren bankoverschrijving, Suripay en cash bij afhalen. WhatsApp ons voor details." },
  { q: "Is er garantie op gereedschap?", a: "Ja, alle elektrische apparaten hebben 12 maanden fabrieksgarantie." },
  { q: "Leveren jullie ook buiten Suriname?", a: "Momenteel leveren wij alleen binnen Suriname en de Caribische eilanden." },
];

export default function HeadlineShop() {
  const [page, setPage] = useState("shop");
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Alle");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);
  const [adminPass, setAdminPass] = useState("");
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [notification, setNotification] = useState(null);
  const [checkoutData, setCheckoutData] = useState({ name: "", email: "", phone: "", address: "", notes: "" });
  const [newProduct, setNewProduct] = useState({ name: "", category: "Clippers", price: "", stock: "", image: "✂️", desc: "" });
  const [complaintData, setComplaintData] = useState({ name: "", email: "", order: "", message: "" });
  const [openFaq, setOpenFaq] = useState(null);
  const [orders, setOrders] = useState([]);

  const showNotif = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    showNotif(`${product.name} toegevoegd aan winkelmandje!`);
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === "Alle" || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const placeOrder = () => {
    if (!checkoutData.name || !checkoutData.email || !checkoutData.phone || !checkoutData.address) {
      showNotif("Vul alle verplichte velden in!", "error"); return;
    }
    const order = {
      id: `HL-${Date.now()}`,
      date: new Date().toLocaleDateString("nl-NL"),
      customer: checkoutData,
      items: cart,
      total: cartTotal,
      status: "Verwerking"
    };
    setOrders(prev => [order, ...prev]);
    setOrderPlaced(order);
    setCart([]);
    setPage("confirmation");
    setCartOpen(false);
  };

  const adminLogin = () => {
    if (adminPass === "headline2024") { setAdminLoggedIn(true); showNotif("Welkom terug, Admin!"); }
    else showNotif("Verkeerd wachtwoord!", "error");
  };

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) { showNotif("Vul alle velden in!", "error"); return; }
    const product = { ...newProduct, id: Date.now(), price: parseFloat(newProduct.price), stock: parseInt(newProduct.stock) };
    setProducts(prev => [...prev, product]);
    setNewProduct({ name: "", category: "Clippers", price: "", stock: "", image: "✂️", desc: "" });
    showNotif("Product toegevoegd!");
  };

  const removeProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showNotif("Product verwijderd!");
  };

  const submitComplaint = () => {
    if (!complaintData.name || !complaintData.email || !complaintData.message) { showNotif("Vul alle velden in!", "error"); return; }
    showNotif("Klacht ontvangen! We nemen binnen 24u contact op.");
    setComplaintData({ name: "", email: "", order: "", message: "" });
  };

  const updateOrderStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    showNotif("Status bijgewerkt!");
  };

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#0a0a0a", minHeight: "100vh", color: "#f0ece4" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; }
        .font-display { font-family: 'Playfair Display', serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
        .btn-gold {
          background: linear-gradient(135deg, #c9a84c, #e8c96b, #c9a84c);
          color: #0a0a0a;
          border: none;
          padding: 12px 28px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-gold:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(201,168,76,0.4); }
        .btn-outline {
          background: transparent;
          color: #c9a84c;
          border: 1px solid #c9a84c;
          padding: 10px 22px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 13px;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-outline:hover { background: #c9a84c; color: #0a0a0a; }
        .btn-danger {
          background: #8b1a1a;
          color: #fff;
          border: none;
          padding: 8px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          cursor: pointer;
        }
        .btn-danger:hover { background: #a32020; }
        .card {
          background: #141414;
          border: 1px solid #2a2a2a;
          transition: all 0.2s;
        }
        .card:hover { border-color: #c9a84c; }
        input, select, textarea {
          background: #1a1a1a;
          border: 1px solid #333;
          color: #f0ece4;
          padding: 10px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          width: 100%;
          outline: none;
          transition: border-color 0.2s;
        }
        input:focus, select:focus, textarea:focus { border-color: #c9a84c; }
        select option { background: #1a1a1a; }
        .nav-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #888;
          cursor: pointer;
          transition: color 0.2s;
          border: none;
          background: none;
        }
        .nav-link:hover, .nav-link.active { color: #c9a84c; }
        .gold { color: #c9a84c; }
        .divider { border: none; border-top: 1px solid #2a2a2a; margin: 24px 0; }
        .overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.8);
          z-index: 100;
          display: flex; justify-content: flex-end;
        }
        .cart-panel {
          background: #111;
          width: min(420px, 100vw);
          height: 100%;
          overflow-y: auto;
          padding: 32px 24px;
          border-left: 1px solid #2a2a2a;
          display: flex; flex-direction: column; gap: 24px;
        }
        .badge {
          background: #c9a84c;
          color: #0a0a0a;
          font-size: 10px;
          font-weight: 700;
          border-radius: 50%;
          width: 18px; height: 18px;
          display: inline-flex; align-items: center; justify-content: center;
          position: absolute; top: -6px; right: -6px;
        }
        .notif {
          position: fixed; top: 24px; right: 24px;
          z-index: 999;
          padding: 14px 22px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          border-left: 3px solid;
          animation: slideIn 0.3s ease;
          max-width: 320px;
        }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .faq-item { border-bottom: 1px solid #222; }
        .status-badge {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 10px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #333; }
        ::-webkit-scrollbar-thumb:hover { background: #c9a84c; }
      `}</style>

      {/* Notification */}
      {notification && (
        <div className="notif" style={{
          background: notification.type === "error" ? "#1a0a0a" : "#0a1a0a",
          borderColor: notification.type === "error" ? "#8b1a1a" : "#c9a84c",
          color: notification.type === "error" ? "#ff6b6b" : "#c9a84c"
        }}>
          {notification.msg}
        </div>
      )}

      {/* Cart Overlay */}
      {cartOpen && (
        <div className="overlay" onClick={() => setCartOpen(false)}>
          <div className="cart-panel" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 className="font-display gold" style={{ fontSize: 22 }}>Winkelmandje</h2>
              <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", color: "#888", fontSize: 22, cursor: "pointer" }}>×</button>
            </div>
            {cart.length === 0 ? (
              <p className="font-body" style={{ color: "#555", marginTop: 40, textAlign: "center" }}>Je mandje is leeg.</p>
            ) : (
              <>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: "flex", gap: 14, alignItems: "center", paddingBottom: 16, borderBottom: "1px solid #222" }}>
                      <div style={{ fontSize: 28, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "#1a1a1a" }}>{item.image}</div>
                      <div style={{ flex: 1 }}>
                        <p className="font-body" style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</p>
                        <p style={{ color: "#c9a84c", fontSize: 14, fontFamily: "DM Sans" }}>SRD {(item.price * item.qty).toFixed(2)}</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button onClick={() => updateQty(item.id, -1)} style={{ background: "#222", border: "none", color: "#fff", width: 26, height: 26, cursor: "pointer", fontSize: 16 }}>−</button>
                        <span className="font-body" style={{ fontSize: 14, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} style={{ background: "#222", border: "none", color: "#fff", width: 26, height: 26, cursor: "pointer", fontSize: 16 }}>+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 18 }}>×</button>
                    </div>
                  ))}
                </div>
                <hr className="divider" />
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                  <span className="font-body" style={{ color: "#888" }}>Totaal</span>
                  <span className="font-display gold" style={{ fontSize: 20 }}>SRD {cartTotal.toFixed(2)}</span>
                </div>
                <button className="btn-gold" style={{ width: "100%" }} onClick={() => { setCartOpen(false); setPage("checkout"); }}>
                  Afrekenen →
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <header style={{ borderBottom: "1px solid #1e1e1e", position: "sticky", top: 0, zIndex: 50, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(10px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 70, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div onClick={() => setPage("shop")} style={{ cursor: "pointer" }}>
            <div className="font-display" style={{ fontSize: 22, letterSpacing: 2, color: "#c9a84c" }}>HEADLINE</div>
            <div className="font-body" style={{ fontSize: 10, letterSpacing: 4, color: "#555", marginTop: -4, textTransform: "uppercase" }}>Barber Supply</div>
          </div>
          <nav style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {["shop", "faq", "complaint"].map(p => (
              <button key={p} className={`nav-link ${page === p ? "active" : ""}`} onClick={() => setPage(p)}>
                {p === "shop" ? "Shop" : p === "faq" ? "FAQ" : "Klachten"}
              </button>
            ))}
            <button className="nav-link" onClick={() => setPage("admin")} style={{ color: "#444" }}>Admin</button>
            <button onClick={() => setCartOpen(true)} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", fontSize: 20 }}>
              🛒
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </button>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>

        {/* ── SHOP PAGE ─────────────────────────────────────────────────── */}
        {page === "shop" && (
          <div>
            {/* Hero */}
            <div style={{ textAlign: "center", paddingBottom: 56, borderBottom: "1px solid #1e1e1e", marginBottom: 48 }}>
              <div className="font-body" style={{ color: "#c9a84c", letterSpacing: 4, fontSize: 12, textTransform: "uppercase", marginBottom: 16 }}>
                💈 Professioneel Barbersgereedschap
              </div>
              <h1 className="font-display" style={{ fontSize: "clamp(40px, 6vw, 80px)", lineHeight: 1.1, marginBottom: 20 }}>
                Alles voor de<br /><span className="gold">perfecte cut</span>
              </h1>
              <p className="font-body" style={{ color: "#666", fontSize: 16, maxWidth: 480, margin: "0 auto 32px" }}>
                Professionele tools voor serieuze barbers. Topsmerken, scherpe prijzen, levering in Suriname.
              </p>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32, alignItems: "center" }}>
              <input
                placeholder="Zoek producten..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ maxWidth: 280 }}
              />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={selectedCategory === cat ? "btn-gold" : "btn-outline"}
                    style={{ padding: "8px 16px", fontSize: 12 }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
              {filteredProducts.map(product => (
                <div key={product.id} className="card" style={{ padding: 24 }}>
                  <div style={{ fontSize: 48, textAlign: "center", marginBottom: 16, background: "#0d0d0d", padding: "24px 0", letterSpacing: 4 }}>
                    {product.image}
                  </div>
                  <div className="font-body" style={{ fontSize: 11, color: "#c9a84c", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
                    {product.category}
                  </div>
                  <h3 className="font-display" style={{ fontSize: 18, marginBottom: 8 }}>{product.name}</h3>
                  <p className="font-body" style={{ color: "#666", fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>{product.desc}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <span className="font-display gold" style={{ fontSize: 22 }}>SRD {product.price.toFixed(2)}</span>
                    <span className="font-body" style={{ fontSize: 12, color: product.stock > 5 ? "#4a9" : "#c84", fontFamily: "DM Sans" }}>
                      {product.stock > 0 ? `${product.stock} op voorraad` : "Uitverkocht"}
                    </span>
                  </div>
                  <button
                    className="btn-gold"
                    style={{ width: "100%", opacity: product.stock === 0 ? 0.4 : 1 }}
                    onClick={() => product.stock > 0 && addToCart(product)}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? "Uitverkocht" : "In mandje"}
                  </button>
                </div>
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <p className="font-body" style={{ textAlign: "center", color: "#555", marginTop: 60, fontSize: 16 }}>
                Geen producten gevonden. Probeer een andere zoekopdracht.
              </p>
            )}
          </div>
        )}

        {/* ── CHECKOUT PAGE ─────────────────────────────────────────────── */}
        {page === "checkout" && (
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <button className="nav-link" onClick={() => setPage("shop")} style={{ marginBottom: 32, display: "flex", alignItems: "center", gap: 8 }}>
              ← Terug naar shop
            </button>
            <h1 className="font-display" style={{ fontSize: 36, marginBottom: 8 }}>Afrekenen</h1>
            <p className="font-body" style={{ color: "#666", marginBottom: 40 }}>Vul je gegevens in om je bestelling te plaatsen.</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label className="font-body" style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 6, letterSpacing: 1 }}>VOLLEDIGE NAAM *</label>
                <input value={checkoutData.name} onChange={e => setCheckoutData(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" />
              </div>
              <div>
                <label className="font-body" style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 6, letterSpacing: 1 }}>E-MAILADRES *</label>
                <input value={checkoutData.email} onChange={e => setCheckoutData(p => ({ ...p, email: e.target.value }))} placeholder="john@example.com" type="email" />
              </div>
              <div>
                <label className="font-body" style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 6, letterSpacing: 1 }}>TELEFOONNUMMER *</label>
                <input value={checkoutData.phone} onChange={e => setCheckoutData(p => ({ ...p, phone: e.target.value }))} placeholder="+597 XXX XXXX" />
              </div>
              <div>
                <label className="font-body" style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 6, letterSpacing: 1 }}>AFLEVERADRES *</label>
                <input value={checkoutData.address} onChange={e => setCheckoutData(p => ({ ...p, address: e.target.value }))} placeholder="Straat, Paramaribo" />
              </div>
            </div>
            <div style={{ marginBottom: 32 }}>
              <label className="font-body" style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 6, letterSpacing: 1 }}>OPMERKINGEN (OPTIONEEL)</label>
              <textarea value={checkoutData.notes} onChange={e => setCheckoutData(p => ({ ...p, notes: e.target.value }))} rows={3} placeholder="Speciale instructies voor levering..." />
            </div>

            {/* Order summary */}
            <div className="card" style={{ padding: 24, marginBottom: 24 }}>
              <h3 className="font-display" style={{ fontSize: 18, marginBottom: 16, color: "#c9a84c" }}>Jouw Bestelling</h3>
              {cart.map(item => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #1e1e1e" }}>
                  <span className="font-body" style={{ fontSize: 14 }}>{item.name} × {item.qty}</span>
                  <span className="font-body gold" style={{ fontSize: 14 }}>SRD {(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                <span className="font-body" style={{ color: "#888" }}>Totaal</span>
                <span className="font-display gold" style={{ fontSize: 22 }}>SRD {cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="card" style={{ padding: 16, marginBottom: 24, borderColor: "#2a2010" }}>
              <p className="font-body" style={{ fontSize: 13, color: "#888" }}>
                💳 <strong style={{ color: "#c9a84c" }}>Betaling:</strong> Na bevestiging ontvang je onze betaalinstructies per e-mail. We accepteren bankoverschrijving en Suripay.
              </p>
            </div>

            <button className="btn-gold" style={{ width: "100%", fontSize: 16, padding: "16px" }} onClick={placeOrder}>
              Bestelling Plaatsen →
            </button>
          </div>
        )}

        {/* ── CONFIRMATION PAGE ─────────────────────────────────────────── */}
        {page === "confirmation" && orderPlaced && (
          <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", paddingTop: 40 }}>
            <div style={{ fontSize: 64, marginBottom: 24 }}>✅</div>
            <h1 className="font-display gold" style={{ fontSize: 42, marginBottom: 16 }}>Bestelling Geplaatst!</h1>
            <p className="font-body" style={{ color: "#888", marginBottom: 8, fontSize: 16 }}>
              Bedankt, <strong style={{ color: "#f0ece4" }}>{orderPlaced.customer.name}</strong>!
            </p>
            <p className="font-body" style={{ color: "#888", marginBottom: 32 }}>
              Bevestiging wordt gestuurd naar <strong style={{ color: "#c9a84c" }}>{orderPlaced.customer.email}</strong>
            </p>
            <div className="card" style={{ padding: 24, textAlign: "left", marginBottom: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <span className="font-body" style={{ color: "#888", fontSize: 13 }}>Ordernummer</span>
                <span className="font-display gold">{orderPlaced.id}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <span className="font-body" style={{ color: "#888", fontSize: 13 }}>Datum</span>
                <span className="font-body" style={{ fontSize: 14 }}>{orderPlaced.date}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="font-body" style={{ color: "#888", fontSize: 13 }}>Totaal</span>
                <span className="font-display gold" style={{ fontSize: 20 }}>SRD {orderPlaced.total.toFixed(2)}</span>
              </div>
            </div>
            <div className="card" style={{ padding: 16, marginBottom: 32, borderColor: "#2a2010" }}>
              <p className="font-body" style={{ fontSize: 13, color: "#888", lineHeight: 1.6 }}>
                📱 We nemen binnen <strong style={{ color: "#c9a84c" }}>2 uur</strong> contact met je op via <strong style={{ color: "#c9a84c" }}>{orderPlaced.customer.phone}</strong> met de betaalinstructies.
              </p>
            </div>
            <button className="btn-gold" onClick={() => setPage("shop")}>Verder Winkelen</button>
          </div>
        )}

        {/* ── FAQ PAGE ──────────────────────────────────────────────────── */}
        {page === "faq" && (
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <h1 className="font-display" style={{ fontSize: 42, marginBottom: 8 }}>Veelgestelde<br /><span className="gold">Vragen</span></h1>
            <p className="font-body" style={{ color: "#666", marginBottom: 48 }}>Staat je vraag er niet bij? Neem contact op via WhatsApp.</p>
            {FAQ_DATA.map((item, i) => (
              <div key={i} className="faq-item">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", textAlign: "left" }}
                >
                  <span className="font-display" style={{ fontSize: 18, color: "#f0ece4" }}>{item.q}</span>
                  <span style={{ color: "#c9a84c", fontSize: 22, transition: "transform 0.2s", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
                </button>
                {openFaq === i && (
                  <p className="font-body" style={{ color: "#888", paddingBottom: 20, lineHeight: 1.7, fontSize: 15 }}>{item.a}</p>
                )}
              </div>
            ))}
            <div className="card" style={{ padding: 28, marginTop: 48, display: "flex", alignItems: "center", gap: 20 }}>
              <span style={{ fontSize: 36 }}>📱</span>
              <div>
                <p className="font-display" style={{ fontSize: 18, marginBottom: 4 }}>Nog vragen?</p>
                <p className="font-body" style={{ color: "#888", fontSize: 14 }}>Stuur ons een WhatsApp bericht voor directe hulp.</p>
              </div>
              <a href="https://wa.me/5978001234" target="_blank" rel="noreferrer" style={{ marginLeft: "auto" }}>
                <button className="btn-gold">WhatsApp ons</button>
              </a>
            </div>
          </div>
        )}

        {/* ── COMPLAINT PAGE ────────────────────────────────────────────── */}
        {page === "complaint" && (
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <h1 className="font-display" style={{ fontSize: 42, marginBottom: 8 }}>Klachten &<br /><span className="gold">Feedback</span></h1>
            <p className="font-body" style={{ color: "#666", marginBottom: 40 }}>We nemen elke klacht serieus. Reactie binnen 24 uur.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="font-body" style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 6, letterSpacing: 1 }}>NAAM *</label>
                <input value={complaintData.name} onChange={e => setComplaintData(p => ({ ...p, name: e.target.value }))} placeholder="Jouw naam" />
              </div>
              <div>
                <label className="font-body" style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 6, letterSpacing: 1 }}>E-MAILADRES *</label>
                <input value={complaintData.email} onChange={e => setComplaintData(p => ({ ...p, email: e.target.value }))} type="email" placeholder="jouw@email.com" />
              </div>
              <div>
                <label className="font-body" style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 6, letterSpacing: 1 }}>ORDERNUMMER (OPTIONEEL)</label>
                <input value={complaintData.order} onChange={e => setComplaintData(p => ({ ...p, order: e.target.value }))} placeholder="HL-..." />
              </div>
              <div>
                <label className="font-body" style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 6, letterSpacing: 1 }}>BERICHT *</label>
                <textarea value={complaintData.message} onChange={e => setComplaintData(p => ({ ...p, message: e.target.value }))} rows={6} placeholder="Beschrijf je klacht of feedback zo gedetailleerd mogelijk..." />
              </div>
              <button className="btn-gold" onClick={submitComplaint} style={{ alignSelf: "flex-start" }}>Klacht Versturen →</button>
            </div>
          </div>
        )}

        {/* ── ADMIN PAGE ────────────────────────────────────────────────── */}
        {page === "admin" && (
          <div>
            {!adminLoggedIn ? (
              <div style={{ maxWidth: 400, margin: "60px auto", textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 24 }}>🔐</div>
                <h2 className="font-display" style={{ fontSize: 32, marginBottom: 8 }}>Admin Toegang</h2>
                <p className="font-body" style={{ color: "#666", marginBottom: 32 }}>Alleen voor bevoegd personeel.</p>
                <input type="password" placeholder="Wachtwoord" value={adminPass} onChange={e => setAdminPass(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && adminLogin()} style={{ marginBottom: 16 }} />
                <button className="btn-gold" style={{ width: "100%" }} onClick={adminLogin}>Inloggen</button>
                <p className="font-body" style={{ color: "#444", fontSize: 12, marginTop: 16 }}>Demo wachtwoord: headline2024</p>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
                  <h1 className="font-display" style={{ fontSize: 36 }}>Admin <span className="gold">Dashboard</span></h1>
                  <button className="btn-outline" onClick={() => setAdminLoggedIn(false)}>Uitloggen</button>
                </div>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 48 }}>
                  {[
                    { label: "Producten", value: products.length, icon: "📦" },
                    { label: "Bestellingen", value: orders.length, icon: "📋" },
                    { label: "Omzet", value: `SRD ${orders.reduce((s, o) => s + o.total, 0).toFixed(2)}`, icon: "💰" },
                    { label: "Items in mandje", value: cartCount, icon: "🛒" },
                  ].map(stat => (
                    <div key={stat.label} className="card" style={{ padding: 20, textAlign: "center" }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
                      <div className="font-display gold" style={{ fontSize: 24 }}>{stat.value}</div>
                      <div className="font-body" style={{ fontSize: 12, color: "#666", marginTop: 4, letterSpacing: 1, textTransform: "uppercase" }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Add Product */}
                <div className="card" style={{ padding: 28, marginBottom: 40 }}>
                  <h3 className="font-display" style={{ fontSize: 22, marginBottom: 24, color: "#c9a84c" }}>+ Product Toevoegen</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 14 }}>
                    <div>
                      <label className="font-body" style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 5 }}>NAAM</label>
                      <input value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} placeholder="Productnaam" />
                    </div>
                    <div>
                      <label className="font-body" style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 5 }}>CATEGORIE</label>
                      <select value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))}>
                        {CATEGORIES.filter(c => c !== "Alle").map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="font-body" style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 5 }}>PRIJS (SRD)</label>
                      <input type="number" value={newProduct.price} onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))} placeholder="0.00" />
                    </div>
                    <div>
                      <label className="font-body" style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 5 }}>VOORRAAD</label>
                      <input type="number" value={newProduct.stock} onChange={e => setNewProduct(p => ({ ...p, stock: e.target.value }))} placeholder="0" />
                    </div>
                    <div>
                      <label className="font-body" style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 5 }}>EMOJI ICON</label>
                      <input value={newProduct.image} onChange={e => setNewProduct(p => ({ ...p, image: e.target.value }))} placeholder="✂️" />
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label className="font-body" style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 5 }}>BESCHRIJVING</label>
                    <input value={newProduct.desc} onChange={e => setNewProduct(p => ({ ...p, desc: e.target.value }))} placeholder="Korte productomschrijving" />
                  </div>
                  <button className="btn-gold" onClick={addProduct}>Product Toevoegen</button>
                </div>

                {/* Product List */}
                <div style={{ marginBottom: 40 }}>
                  <h3 className="font-display" style={{ fontSize: 22, marginBottom: 20 }}>Alle Producten ({products.length})</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {products.map(p => (
                      <div key={p.id} className="card" style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                        <span style={{ fontSize: 24 }}>{p.image}</span>
                        <div style={{ flex: 1 }}>
                          <span className="font-body" style={{ fontSize: 15, fontWeight: 500 }}>{p.name}</span>
                          <span className="font-body" style={{ fontSize: 12, color: "#666", marginLeft: 12 }}>{p.category}</span>
                        </div>
                        <span className="font-body gold" style={{ fontSize: 14 }}>SRD {p.price.toFixed(2)}</span>
                        <span className="font-body" style={{ fontSize: 12, color: "#666" }}>Voorraad: {p.stock}</span>
                        <button className="btn-danger" onClick={() => removeProduct(p.id)}>Verwijderen</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Orders */}
                <div>
                  <h3 className="font-display" style={{ fontSize: 22, marginBottom: 20 }}>Bestellingen ({orders.length})</h3>
                  {orders.length === 0 ? (
                    <p className="font-body" style={{ color: "#555" }}>Nog geen bestellingen.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {orders.map(o => (
                        <div key={o.id} className="card" style={{ padding: 20 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                            <div>
                              <div className="font-display gold" style={{ fontSize: 16 }}>{o.id}</div>
                              <div className="font-body" style={{ fontSize: 13, color: "#888", marginTop: 4 }}>{o.customer.name} — {o.customer.email}</div>
                              <div className="font-body" style={{ fontSize: 13, color: "#888" }}>{o.customer.phone} — {o.customer.address}</div>
                              <div className="font-body" style={{ fontSize: 13, color: "#666", marginTop: 8 }}>
                                {o.items.map(i => `${i.name} ×${i.qty}`).join(", ")}
                              </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div className="font-display gold" style={{ fontSize: 20 }}>SRD {o.total.toFixed(2)}</div>
                              <div className="font-body" style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>{o.date}</div>
                              <select
                                value={o.status}
                                onChange={e => updateOrderStatus(o.id, e.target.value)}
                                style={{ width: "auto", fontSize: 12, padding: "6px 12px" }}
                              >
                                {["Verwerking", "Betaald", "Verzonden", "Afgeleverd", "Geannuleerd"].map(s => (
                                  <option key={s}>{s}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #1e1e1e", marginTop: 80, padding: "40px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div className="font-display gold" style={{ fontSize: 20, letterSpacing: 2 }}>HEADLINE</div>
            <div className="font-body" style={{ fontSize: 11, color: "#444", letterSpacing: 3, textTransform: "uppercase" }}>Barber Supply · Suriname</div>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {["shop", "faq", "complaint"].map(p => (
              <button key={p} className="nav-link" onClick={() => setPage(p)} style={{ fontSize: 12 }}>
                {p === "shop" ? "Shop" : p === "faq" ? "FAQ" : "Klachten"}
              </button>
            ))}
          </div>
          <div className="font-body" style={{ fontSize: 12, color: "#444" }}>
            © 2024 Headlineshop.sr · Alle rechten voorbehouden
          </div>
        </div>
      </footer>
    </div>
  );
}
