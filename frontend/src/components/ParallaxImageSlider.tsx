import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Title, Text, Badge, Button, Group, Transition } from '@mantine/core';
import { IconArrowRight, IconArrowLeft, IconExternalLink } from '@tabler/icons-react';
import { useIntersection } from '@mantine/hooks';

const slides = [
  {
    id: 1,
    title: 'Seamlessly Collaborate',
    description: 'Work together with your team in real-time, no matter where you are.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    ctaText: 'Start Collaborating',
    ctaLink: '/signup'
  },
  {
    id: 2,
    title: 'Powerful Analytics',
    description: 'Gain valuable insights into your team\'s productivity and document usage.',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    ctaText: 'Explore Analytics',
    ctaLink: '/features'
  },
  {
    id: 3,
    title: 'Enterprise-grade Security',
    description: 'Your data is protected with industry-leading security measures.',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    ctaText: 'Learn About Security',
    ctaLink: '/security'
  }
];

export default function ParallaxImageSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isAnimating, setIsAnimating] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sliderRef = useRef<HTMLDivElement | null>(null);
  
  // Intersection observer to check if slider is in viewport
  const { ref, entry } = useIntersection({
    threshold: 0.2,
    rootMargin: '0px',
  });
  
  const isInViewport = entry?.isIntersecting;
  
  // Handle mouse movement for parallax effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    
    const { left, top, width, height } = sliderRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    setMousePosition({ x, y });
  };
  
  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection('right');
    setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection('left');
    setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  // Auto-rotate slides
  useEffect(() => {
    if (!isInViewport) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    
    return () => clearInterval(interval);
  }, [activeIndex, isAnimating, isInViewport]);
  
  // Calculate parallax effect based on mouse position
  const getParallaxStyles = (depth: number = 20) => {
    const x = (mousePosition.x - 0.5) * depth;
    const y = (mousePosition.y - 0.5) * depth;
    
    return {
      transform: `translate(${x}px, ${y}px)`,
      transition: 'transform 0.1s ease-out',
    };
  };
  
  const activeSlide = slides[activeIndex];
  
  return (
    <Box 
      ref={(node) => {
        // Set the intersection observer ref
        ref(node);
        // Set the slider ref manually
        sliderRef.current = node;
      }}
      onMouseMove={handleMouseMove}
      sx={{ 
        position: 'relative',
        height: 600,
        overflow: 'hidden',
        '@media (max-width: 768px)': {
          height: 500
        }
      }}
    >
      {/* Background Image with Parallax Effect */}
      {slides.map((slide, index) => (
        <Box
          key={slide.id}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: index === activeIndex ? 1 : 0,
            transition: 'opacity 0.8s ease',
            zIndex: 1,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
              zIndex: 2
            }
          }}
        >
          <Box 
            sx={{
              position: 'absolute',
              top: '-20px',
              left: '-20px',
              width: 'calc(100% + 40px)',
              height: 'calc(100% + 40px)',
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              ...getParallaxStyles(),
            }}
          />
        </Box>
      ))}
      
      {/* Content */}
      <Container size="lg" sx={{ position: 'relative', zIndex: 10, height: '100%' }}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            height: '100%',
            maxWidth: 600,
            color: 'white',
            padding: '0 20px'
          }}
        >
          <Transition
            mounted={!isAnimating}
            transition={{
              in: { opacity: 1, transform: 'translateY(0)' },
              out: { opacity: 0, transform: direction === 'right' ? 'translateY(-20px)' : 'translateY(20px)' },
              common: { transition: 'opacity 0.5s ease, transform 0.5s ease' },
              transitionProperty: 'opacity, transform',
            }}
          >
            {(styles) => (
              <Box style={styles}>
                <Badge 
                  size="xl" 
                  radius="xl" 
                  color="pink" 
                  variant="filled" 
                  mb={20}
                  sx={{
                    padding: '12px 20px',
                    fontSize: 14,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {`Slide ${activeIndex + 1}/${slides.length}`}
                </Badge>
                
                <Title 
                  order={1} 
                  mb={20}
                  sx={{ 
                    fontSize: 48,
                    fontWeight: 800,
                    '@media (max-width: 768px)': {
                      fontSize: 36
                    }
                  }}
                >
                  {activeSlide.title}
                </Title>
                
                <Text 
                  mb={30}
                  sx={{ 
                    fontSize: 20,
                    lineHeight: 1.6,
                    opacity: 0.9,
                    '@media (max-width: 768px)': {
                      fontSize: 18
                    }
                  }}
                >
                  {activeSlide.description}
                </Text>
                
                <Button 
                  component="a"
                  href={activeSlide.ctaLink}
                  size="lg"
                  radius="xl"
                  rightIcon={<IconExternalLink size={16} />}
                  sx={{
                    background: 'white',
                    color: '#333',
                    fontWeight: 600,
                    padding: '0 30px',
                    height: 50,
                    alignSelf: 'flex-start',
                    '&:hover': {
                      background: 'white',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {activeSlide.ctaText}
                </Button>
              </Box>
            )}
          </Transition>
        </Box>
      </Container>
      
      {/* Navigation Buttons */}
      <Group 
        position="apart" 
        sx={{ 
          position: 'absolute', 
          bottom: 40, 
          left: 0, 
          right: 0, 
          zIndex: 10,
          padding: '0 40px',
          '@media (max-width: 768px)': {
            padding: '0 20px'
          }
        }}
      >
        <Button 
          onClick={prevSlide}
          variant="filled"
          radius="xl"
          size="lg"
          sx={{
            width: 50,
            height: 50,
            padding: 0,
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.3)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
            }
          }}
        >
          <IconArrowLeft size={20} />
        </Button>
        
        <Group spacing={10}>
          {slides.map((_, index) => (
            <Box
              key={index}
              onClick={() => {
                if (index > activeIndex) {
                  setDirection('right');
                } else if (index < activeIndex) {
                  setDirection('left');
                }
                setActiveIndex(index);
              }}
              sx={{
                width: index === activeIndex ? 30 : 10,
                height: 10,
                borderRadius: 5,
                background: index === activeIndex ? 
                  'linear-gradient(90deg, #4158D0, #C850C0)' : 
                  'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: index === activeIndex ? 
                    'linear-gradient(90deg, #4158D0, #C850C0)' : 
                    'rgba(255, 255, 255, 0.7)'
                }
              }}
            />
          ))}
        </Group>
        
        <Button 
          onClick={nextSlide}
          variant="filled"
          radius="xl"
          size="lg"
          sx={{
            width: 50,
            height: 50,
            padding: 0,
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.3)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
            }
          }}
        >
          <IconArrowRight size={20} />
        </Button>
      </Group>
    </Box>
  );
}
