import React, { useState } from "react";

/*
  Huella Feliz — simple frontend version
  NOTE: This is a Vite React minimal version. For production, wire Tailwind and real Stripe keys.
*/

const SAMPLE_PRODUCTS = [
  {
    id: "hf-collar-001",
    title: "Collar Inteligente Huella Feliz",
    priceUSD: 29.99,
    description: "Collar ajustable con material reflectante y placa personalizable.",
    img: "assets/collar.png",
    sku: "HF-COLLAR-001",
  },
  {
    id: "hf-toy-edu-001",
    title: "Juguete Educativo KidsPlay",
    priceUSD: 14.5,
    description: "Juego didáctico para niños 3-7 años.",
    img: "assets/toy.png",
    sku: "HF-TOY-001",
  }
];

export default function HuellaFelizStore() {
  const [products] = useState(SAMPLE_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  function addToCart(p) {
    setCart(c => {
      const found = c.find(i => i.id === p.id);
      if (found) return c.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...c, { ...p, qty: 1 }];
    });
  }

  async function handleDemoCheckout() {
    if (cart.length === 0) { alert('Carrito vacío'); return; }
    // Call Vercel serverless function
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart, currency: 'usd' })
      });
      const data = await res.json();
      if (data.sessionId) {
        alert('Session creada: ' + data.sessionId + '\\nEn producción redirige a Stripe Checkout aquí.');
      } else {
        alert('Respuesta del servidor: ' + JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      alert('Error creando sesión. Revisa tu backend y variables de entorno.');
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <header style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:48, height:48, borderRadius:24, background:'#000', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>HF</div>
          <div>
            <h1 style={{ margin:0 }}>Huella Feliz</h1>
            <div style={{ fontSize:12, color:'#444' }}>Productos para niños y mascotas</div>
          </div>
        </div>
        <button onClick={() => setShowCheckout(true)} style={{ padding:'8px 12px', background:'#000', color:'#fff', border:'none', borderRadius:6 }}>
          Carrito ({cart.reduce((s,i)=>s+i.qty,0)})
        </button>
      </header>

      <main style={{ marginTop:20 }}>
        <section style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:20 }}>
          <div>
            <h2>Catálogo</h2>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {products.map(p => (
                <div key={p.id} style={{ border:'1px solid #eee', padding:12, borderRadius:8 }}>
                  <img src={p.img} alt={p.title} style={{ width:'100%', height:120, objectFit:'cover', borderRadius:6 }} />
                  <h3>{p.title}</h3>
                  <p style={{ fontSize:13 }}>{p.description}</p>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <strong>${p.priceUSD}</strong>
                    <div style={{ display:'flex', gap:8 }}>
                      <button onClick={() => addToCart(p)} style={{ padding:'6px 8px' }}>Agregar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <aside style={{ border:'1px solid #eee', padding:12, borderRadius:8 }}>
            <h3>Sobre envío</h3>
            <p style={{ fontSize:13 }}>Envíos a todo el país y al mundo. Calcula costos en checkout.</p>
            <h3 style={{ marginTop:12 }}>Garantía</h3>
            <p style={{ fontSize:13 }}>30 días de devolución.</p>
          </aside>
        </section>
      </main>

      {showCheckout && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'#fff', padding:20, width:640, borderRadius:8 }}>
            <h3>Checkout</h3>
            {cart.length === 0 ? <div>Carrito vacío</div> : (
              <div>
                {cart.map((i, idx) => (
                  <div key={idx} style={{ display:'flex', justifyContent:'space-between', padding:8 }}>
                    <div>
                      <div style={{ fontWeight:600 }}>{i.title}</div>
                      <div style={{ fontSize:12 }}>{i.qty} x ${i.priceUSD}</div>
                    </div>
                    <div>
                      <input type="number" value={i.qty} min={1} onChange={(e)=>{ const q = Number(e.target.value)||1; setCart(c=>c.map((it,k)=>k===idx?{...it,qty:q}:it)); }} style={{ width:60 }} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop:12 }}>
                  <button onClick={handleDemoCheckout} style={{ padding:'10px 14px', background:'#000', color:'#fff', border:'none', borderRadius:6 }}>Pagar (demo)</button>
                  <button onClick={()=>setShowCheckout(false)} style={{ marginLeft:8, padding:'10px 14px' }}>Cerrar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}