import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {useLocation} from 'react-router-dom';
import http from '../http';

function Checkout() {
    const navigate = useNavigate();
    const { id } = useParams();
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
  });

  const handleShippingChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process the order here
    alert(`Thank you for your donation of $${id}!`);
    navigate(`/receipt/${id}`);
  };
//   validationSchema: yup.object({
//     name: yup.string().trim()
//     .matches(/^[0-9\b]+$/, 'Amount must be in numbers only')
//         .required('Amount is required'),
//     description: yup.string().trim()
//         .min(3, 'Description must be at least 3 characters')
//         .max(500, 'Description must be at most 500 characters')
//         .required('Description is required')
// });
  

  return (
    <div className="checkout">
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit}>
        <h2>Shipping Information</h2>
        <label>
          Name:
          <input type="text" name="name" value={shippingInfo.name} onChange={handleShippingChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={shippingInfo.email} onChange={handleShippingChange} />
        </label>
        <label>
          Address:
          <input type="text" name="address" value={shippingInfo.address} onChange={handleShippingChange} />
        </label>
        <label>
          City:
          <input type="text" name="city" value={shippingInfo.city} onChange={handleShippingChange} />
        </label>
        <label>
          State:
          <input type="text" name="state" value={shippingInfo.state} onChange={handleShippingChange} />
        </label>
        <label>
          Zip:
          <input type="text" name="zip" value={shippingInfo.zip} onChange={handleShippingChange} />
        </label>

        <h2>Payment Information</h2>
        <label>
          Card Number:
          <input type="text" name="cardNumber" value={paymentInfo.cardNumber} onChange={handlePaymentChange} />
        </label>
        <label>
          Expiration Date:
          <input type="text" name="expirationDate" value={paymentInfo.expirationDate} onChange={handlePaymentChange} />
        </label>
        <label>
          CVV:
          <input type="text" name="cvv" value={paymentInfo.cvv} onChange={handlePaymentChange} />
        </label>

        <h2>Donation Amount</h2>
        <p>1x ${id}</p>

        <button type="submit">Confirm Donation</button>
      </form>
    </div>
  );
}

export default Checkout;