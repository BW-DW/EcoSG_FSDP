import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './checkout.css';

function Checkout () {
  const navigate = useNavigate();
  const { id } = useParams();

  const shippingInfoSchema = Yup.object().shape({
    name: Yup.string().trim().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    address: Yup.string().trim().required('Address is required'),
    city: Yup.string().trim().required('City is required'),
    state: Yup.string().trim().required('State is required'),
    zip: Yup.string().trim().required('Zip is required'),
  });

  const paymentInfoSchema = Yup.object().shape({
    cardNumber: Yup.string()
      .trim()
      .matches(/^(\d{4}[-\s]?){3}\d{4}$/, 'Invalid card number')
      .required('Card number is required'),
    expirationDate: Yup.string()
      .trim()
      .matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Invalid expiration date')
      .required('Expiration date is required'),
    cvv: Yup.string()
      .trim()
      .matches(/^[0-9]{3,4}$/, 'Invalid CVV')
      .required('CVV is required'),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    // Process the order here
    alert(`Thank you for your donation of $${id}!`);
    navigate(`/receipt/${id}`);
    setSubmitting(false);
  };

  return (
    <div className="checkout">
      <h1>Checkout</h1>
      <Formik
        initialValues={{
          shippingInfo: {
            name: '',
            email: '',
            address: '',
            city: '',
            state: '',
            zip: '',
          },
          paymentInfo: {
            cardNumber: '',
            expirationDate: '',
            cvv: '',
          },
        }}
        validationSchema={Yup.object().shape({
          shippingInfo: shippingInfoSchema,
          paymentInfo: paymentInfoSchema,
        })}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <h2>Shipping Information</h2>
            <label>
              Name:
              <Field type="text" name="shippingInfo.name" />
              <ErrorMessage name="shippingInfo.name" />
            </label>
            <label>
              Email:
              <Field type="email" name="shippingInfo.email" />
              <ErrorMessage name="shippingInfo.email" />
            </label>
            <label>
              Address:
              <Field type="text" name="shippingInfo.address" />
              <ErrorMessage name="shippingInfo.address" />
            </label>
            <label>
              City:
              <Field type="text" name="shippingInfo.city" />
              <ErrorMessage name="shippingInfo.city" />
            </label>
            <label>
              State:
              <Field type="text" name="shippingInfo.state" />
              <ErrorMessage name="shippingInfo.state" />
            </label>
            <label>
              Zip:
              <Field type="text" name="shippingInfo.zip" />
              <ErrorMessage name="shippingInfo.zip" />
            </label>

            <h2>Payment Information</h2>
            <label>
              Card Number:
              <Field type="text" name="paymentInfo.cardNumber" />
              <ErrorMessage name="paymentInfo.cardNumber" />
            </label>
            <label>
              Expiration Date:
              <Field type="text" name="paymentInfo.expirationDate" />
              <ErrorMessage name="paymentInfo.expirationDate" />
            </label>
            <label>
              CVV:
              <Field type="text" name="paymentInfo.cvv" />
              <ErrorMessage name="paymentInfo.cvv" />
            </label>

            <h2>Donation Amount</h2>
            <p>1x ${id}</p>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Confirm Donation'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Checkout;