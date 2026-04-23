import { useLocation } from 'react-router-dom';
import useLenis from '../../hooks/useLenis';
import useScrollToTop from '../../hooks/useScrollToTop';
import DynamicSEO from './DynamicSEO';
import StructuredData from './StructuredData';
import LiquidBackground from './LiquidBackground';
import CustomCursor from '../ui/CustomCursor';
import Navbar from './Navbar';
import Footer from './Footer';

export default function RootLayout({ children }) {
  const { pathname } = useLocation();
  const isAdminPath = pathname.startsWith('/admin');

  useLenis();
  useScrollToTop();

  return (
    <>
      <DynamicSEO />
      <StructuredData />
      <LiquidBackground />
      <CustomCursor />
      {!isAdminPath && <Navbar />}
      {children}
      {!isAdminPath && <Footer />}
    </>
  );
}

