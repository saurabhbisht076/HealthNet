import React, { useEffect } from "react";
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button, styled } from "@mui/material";
import { PersonAdd, Login, LocalHospital } from "@mui/icons-material";
import { Link } from "react-router-dom";
import './HomePage.css';

const HomePage = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) controls.start('visible');
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const AnimatedButton = styled(Button)(({ theme }) => ({
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: `${theme.shadows[6]}`
    }
  }));

  return (
    <div className="home-container">
      <div className="gradient-background"></div>
      <div className="floating-shapes">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="shape"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <motion.div 
        className="glass-container"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Split Screen Container */}
        <div className="split-screen">
          {/* Left Column */}
          <motion.div className="left-column" variants={itemVariants}>
            <motion.header className="header">
              <motion.div 
                className="logo"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 100 }}
              >
                <span className="gradient-text">HEALTH</span>
                <motion.span 
                  className="pulse-text"
                  animate={{ 
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ repeat: Infinity, duration: 4 }}
                >
                  NET+
                </motion.span>
              </motion.div>
              
              <motion.p className="tagline" variants={itemVariants}>
                Your Health, Our Priority
                <motion.span 
                  className="highlight"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  Transforming Healthcare Experiences
                </motion.span>
              </motion.p>
              {/* Added Hindi Subheading */}
              <motion.p 
                className="subheading"
                variants={itemVariants}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                
              </motion.p>
            </motion.header>

            <motion.div className="auth-buttons" variants={itemVariants}>
              <AnimatedButton
                component={Link}
                variant="contained"
                color="primary"
                startIcon={<PersonAdd />}
                sx={{
                  padding: '1.2rem 2.5rem',
                  borderRadius: '15px',
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                  textTransform: 'none'
                }}
                to="/signup"
              >
                Get Started
              </AnimatedButton>

              <AnimatedButton
                component={Link}
                variant="outlined"
                color="secondary"
                startIcon={<Login />}
                sx={{
                  padding: '1.2rem 2.5rem',
                  borderRadius: '15px',
                  fontSize: '1.1rem',
                  borderWidth: '2px',
                  textTransform: 'none',
                  ml: 3,
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': { borderColor: 'rgba(255,255,255,0.5)' }
                }}
                to="/signin"
              >
                Existing User
              </AnimatedButton>
            </motion.div>
          </motion.div>

          {/* Right Column */}
          <motion.div 
            className="right-column"
            variants={itemVariants}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* <img src="/health.png" alt="health illustration" className="health-image" /> */}
          </motion.div>
        </div>

        {/* Emergency Card with Link */}
        <Link to="/view-location" className="emergency-link">
          <motion.div 
            className="emergency-card"
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { scale: 0.5, opacity: 0 },
              visible: { 
                scale: 1,
                opacity: 1,
                transition: { type: 'spring', stiffness: 100 }
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LocalHospital className="pulse-icon" />
            <span>Emergency Assistance</span>
            <div className="glow-effect"></div>
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
};

export default HomePage;