// import { useNavigate, useParams } from 'react-router-dom';
// import { Formik, Field, Form, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { loadStripe } from '@stripe/stripe-js';

// function Checkout () {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const intid = +id;
//   const cart = [
//     { name: "Donation", amount: intid, quantity: 1 }
//   ];

//   const makePayment = async ()=>{
//     const stripe = await loadStripe("pk_test_51PmZlSP9QuT2EU6lCOj1EMrvH93gjjoocAUf7InpeDpbVDR7qyecX9mnt3Mi0IFCGP0HTqxrzY9qgrk5AWC8jjKg00Ft57tn0U")
  
//     const body ={
//       products: cart
//     }
    
//     const headers={
//       "content-Type":"application/json"
//     }
  
//     const response = await fetch('http://localhost:3001/create_checkout_session',{
//       method: 'POST',
//       headers: headers,
//       body: JSON.stringify(body),
//     });

//     if (!response.ok) {
//         throw new Error(`Failed to create checkout session: ${response.status}`);
//       }
  
//     const session = await response.json();
  
//     try {
//         const result = await stripe.redirectToCheckout({
//           sessionId: session.id,
//         });
//       } catch (error) {
//         console.error(`Error redirecting to checkout: ${error}`);
//       }
//     }

//   return (
//     <div className="checkout">
//       <h1>Checkout</h1>
//             <h2>Checkout</h2>
//             <h2>r u sure u wan to donate?</h2>
//             <h2>Donation Amount</h2>
//             <p>1x ${id}</p>

//             <button onClick={makePayment}>
//               Make Payment
//             </button>
//     </div>
//   );
// };

// export default Checkout;


import { useNavigate, useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import './checkout.css';

function Checkout() {
  const navigate = useNavigate();
  const { id } = useParams();
  const intId = +id;
  const cart = [
    { name: "Donation", amount: intId, quantity: 1 }
  ];

  const makePayment = async () => {
    try {
      const stripe = await loadStripe("pk_test_51PmZlSP9QuT2EU6lCOj1EMrvH93gjjoocAUf7InpeDpbVDR7qyecX9mnt3Mi0IFCGP0HTqxrzY9qgrk5AWC8jjKg00Ft57tn0U");
      const body = {
        products: cart
      };
      const headers = {
        "Content-Type": "application/json"
      };
      const response = await fetch('http://localhost:3001/create_checkout_session', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`Failed to create checkout session: ${response.status}`);
      }
      const session = await response.json();
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Checkout</h1>
      </div>
      <div className="checkout-content">
        <h2>Confirm</h2>
        <p>Are you sure you want to donate?</p>
        <div className="donation-amount">
          <h2>Donation Amount</h2>
          <p>1x ${id}</p>
        </div>
        <button onClick={makePayment} className="btn-submit">
          Make Payment
        </button>
      </div>
    </div>
  );
};

export default Checkout;