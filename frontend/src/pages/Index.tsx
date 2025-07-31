import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to home page as this is now handled by the Layout
  return <Navigate to="/" replace />;
};

export default Index;
