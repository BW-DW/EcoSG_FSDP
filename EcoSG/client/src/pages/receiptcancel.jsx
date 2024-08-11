import React from 'react';
import './receipt.css';
import { useParams, useNavigate } from 'react-router-dom';

const ReceiptCancel = ({ amount, description }) => {
  // const [tutorialList, setTutorialList] = useState([]);
  const { id } = useParams();
  const crossIcon = document.querySelector('#cross-icon');

  document.addEventListener('DOMContentLoaded', () => {
    crossIcon.classList.add('active');
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
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M18 6 6 18M6 6l12 12"/>
</svg>
        <h2>Transaction Details:</h2>
        <ul>
          <li>
            <span>Payment Cancelled</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ReceiptCancel;