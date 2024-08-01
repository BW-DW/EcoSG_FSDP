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
      <i class="fas fa-check-circle" id="tick-icon"></i>
        <h2>Transaction Details</h2>
        <ul>
          <li>
            <span>Amount:</span>
            <span>${id}</span>
          </li>
          <li>
            <span>About Donation:</span>
            <span>Your donation will be used to help create more events for the community</span>
          </li>
        </ul>
        <h2>Thank you for your donation!</h2>
        <p>Your contribution will make a big difference in our community.</p>
      </div>
    </div>
  );
};

export default ReceiptPage;