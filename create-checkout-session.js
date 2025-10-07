// api/create-checkout-session.js
// Vercel Serverless function — Node.js
const Stripe = require('stripe')

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send({ error: 'Method not allowed' })
  try {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
    const { items, currency = 'usd', successUrl, cancelUrl } = req.body || {}

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items' })
    }

    const line_items = items.map(i => ({
      price_data: {
        currency: currency,
        product_data: { name: i.title },
        unit_amount: Math.round(i.priceUSD * 100),
      },
      quantity: i.qty || 1,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: successUrl || `${process.env.FRONTEND_URL || 'https://your-domain.com'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL || 'https://your-domain.com'}/cancel`,
      shipping_address_collection: { allowed_countries: ['CL','US','ES','AR','BR'] },
    })

    return res.json({ sessionId: session.id })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error', details: err.message })
  }
}