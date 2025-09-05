import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ProtectRegRoute = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the 'payment_success' query parameter
  const queryParams = new URLSearchParams(location.search);
  const isPaymentSuccessful = queryParams.get('payment_success') === 'true';

  // Use useEffect to perform the navigation as a side effect
  useEffect(() => {
    // If the payment was not successful, redirect to the pricing plans page
    if (!isPaymentSuccessful) {
      navigate('/plans');
    }
  }, [isPaymentSuccessful, navigate]); // The dependencies array ensures this runs only when necessary

  // If the payment was successful, render the child components (Registration page)
  if (isPaymentSuccessful) {
    return children;
  }

  // Otherwise, return null or a loading indicator while the navigation happens
  return null;
}

export default ProtectRegRoute