// Create Checkout Sessions from body params.
const session = await stripe.checkout.sessions.create({
  line_items: [
    {
      // Provide the exact Price ID (for example, price_1234) of the product you want to sell
      price: '{{PRICE_ID}}',
      quantity: 1,
    },
  ],
  mode: 'payment',
  success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${origin}/?canceled=true`,
});
return NextResponse.redirect(session.url, 303)