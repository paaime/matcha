import Footer from '@/components/Footer';
import Header from '@/components/Header/LandingHeader';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='bg-white'>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
