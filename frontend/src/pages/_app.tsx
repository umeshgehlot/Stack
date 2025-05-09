import { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAuthPage = router.pathname === '/signin' || router.pathname === '/signup' || router.pathname === '/forgot-password';
  
  // Pages that should have a transparent navbar at the top
  const transparentNavbarPages = ['/', '/features', '/pricing', '/about'];
  const shouldHaveTransparentNavbar = transparentNavbarPages.includes(router.pathname);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: 'light',
        primaryColor: 'blue',
      }}
    >
      {!isAuthPage && <Navbar transparent={shouldHaveTransparentNavbar} />}
      <Component {...pageProps} />
    </MantineProvider>
  );
}

export default MyApp;