const express = require('express');
const app = express();
const router = express.Router();
const stripe = require('stripe')('sk_test_51PmZlSP9QuT2EU6lfXz7PROt8P7JYXlPwF34QC9aGaK4Gdv1WDkRLOFQSVFUQ1Qdo52D4QLFVodwQfbRqVnZbeWJ00Rar9CrVP');

app.use(express.json());

router.post("/create_checkout_session",async(req,res)=>{
  const {products}=req.body;

  const lineitems = products.map((product)=>({
    price_data:{
      currency:"usd",
      product_data:{
        name:product.name,
      },
      unit_amount:product.amount*100,
    },
    quantity:product.quantity
  }));


  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineitems,
    mode:"payment",
    success_url: "http://localhost:3000/receipt",
    cancel_url: "http://localhost:3000/cancel",
  })

  res.json({id:session.id})
});

module.exports = router;