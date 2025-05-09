import React, { useState, useEffect } from 'react';
import { ActionIcon, Transition } from '@mantine/core';
import { IconArrowUp } from '@tabler/icons-react';

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  
  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  
  // Set up scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <Transition mounted={isVisible} transition="fade" duration={400}>
      {(styles) => (
        <ActionIcon
          style={styles}
          onClick={scrollToTop}
          size={44}
          radius="xl"
          variant="filled"
          sx={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            zIndex: 900,
            background: 'linear-gradient(135deg, #4158D0, #C850C0)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            color: 'white',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)'
            }
          }}
        >
          <IconArrowUp size={20} />
        </ActionIcon>
      )}
    </Transition>
  );
}
