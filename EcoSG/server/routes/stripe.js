const express = require('express');
const app = express();
const router = express.Router();
const { sign } = require('jsonwebtoken');
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


// router.post("/changeUser", async (req, res) => {
//   let user = req.body;

//       // Return user info
//       let userInfo = {
//           id: user.id,
//           email: user.email,
//           name: user.name,
//           dob: user.dob, // include dob 
//           role: user.role // and roles in response
//       };
//       let accessToken = sign(userInfo, process.env.APP_SECRET,
//           { expiresIn: process.env.TOKEN_EXPIRES_IN });
//       res.json({
//           accessToken: accessToken,
//           user: userInfo
//       });
//   }
// );


module.exports = router;