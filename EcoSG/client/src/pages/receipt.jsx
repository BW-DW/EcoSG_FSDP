import React from 'react';
import './receipt.css';
import { useParams, useNavigate } from 'react-router-dom';

const ReceiptPage = ({ amount, description }) => {
  // const [tutorialList, setTutorialList] = useState([]);
  const { id } = useParams();
  const tickIcon = document.querySelector('#tick-icon');

  document.addEventListener('DOMContentLoaded', () => {
    tickIcon.classList.add('active');
  });
  // const navigate = useNavigate();
  // const { user } = useContext(UserContext);
  // const getTutorials = () => {
  //     http.get('/tutorial').then((res) => {
  //         setTutorialList(res.data);
  //     });
  // };
  // useEffect(() => {
  //     getTutorials();
  // }, []);
  // for (let i = 0; i < tutorialList.length; i++) {
  //     if (tutorialList[i].amount == id) {
  //         newtut=tutorialList[i];
  //       }
  //   };
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
      </div>
    </div>
  );
};

export default ReceiptPage;