import React, { useState, useEffect, useContext } from 'react';
import './receipt.css';
import { useParams, useNavigate } from 'react-router-dom';
import UserContext from '../contexts/UserContext';

const ReceiptPage = () => {
  const { id } = useParams();
  const [sent, setSent] = useState(false);
  const { user } = useContext(UserContext);

  const handleSendReceipt = async () => {
    try {
      const response = await fetch('http://localhost:3001/send_receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email:user.email }),
      });
      const data = await response.json();
      if (data.success) {
        setSent(true);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="receipt-container">
      <h1>Receipt</h1>
      <div className="receipt-content">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2">
          <path d="M9 12L12 15L19 8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <h2>Transaction Details:</h2>
        <ul>
          <li>
            <span>Payment Success!</span>
          </li>
        </ul>
        <h2>Thank you for your donation!</h2>
        <p>Your contribution will make a big difference in our community.</p>
        <button onClick={handleSendReceipt} className="btn-submit">
          {sent ? 'Sent!' : 'Send copy of receipt to email'}
        </button>
      </div>
    </div>
  );
};

export default ReceiptPage;