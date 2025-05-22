import React, { useState, useEffect, useContext, useCallback } from 'react';
import { ThemeContext, ThemeProvider } from './ThemeContext';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import './styles/main.css';
import logo from './assets/enhanced/cic_insurance.png';
import picture1 from './assets/picture1.jpg';
import picture2 from './assets/picture2.jpg';
import picture3 from './assets/picture3.jpg';
import picture4 from './assets/picture4.jpg';
import picture5 from './assets/picture5.jpg';
import picture6 from './assets/picture6.jpg';

import CoverPage from './components/CoverPage';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './components/Dashboard';
import Register from './components/register';
import QuoteFormSummary from './components/quoteformsummary';
import App from './App';
import FAQs from './components/FAQs';
import AnalyticsPage from './components/AnalyticsPage';
import MyProfilePage from './components/MyProfilePage';
import PoliciesPage from './components/PoliciesPage';
import ClaimsPage from './components/ClaimsPage';
import PaymentsPage from './components/PaymentsPage';
import SupportPage from './components/SupportPage';
import SettingsPage from './components/SettingsPage';
import DatePickerDemo from './components/DatePickerDemo';

// Import authentication utilities
import {
  USER_TYPES,
  validateIdentifier,
  validatePassword,
  login,
  getIdentifierLabel,
  getIdentifierPlaceholder
} from './utils/auth';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log to error reporting service in production, console in development
    if (process.env.NODE_ENV === 'development') {
      console.error("React Error Boundary caught an error:", error, errorInfo);
    }
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div style={{
          padding: '20px',
          margin: '20px',
          border: '1px solid #fff',
          borderRadius: '4px',
          backgroundColor: '#f8d7da',
          color: '#721c24'
        }}>
          <h2>Something went wrong.</h2>
          <p>Please try refreshing the page. If the problem persists, contact support.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

function LoginSignup() {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [formData, setFormData] = useState({
    userType: 'customer',
    idNumber: '',
    password: '',
    rememberMe: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [focusedInputs, setFocusedInputs] = useState({});
  const [validatedFields, setValidatedFields] = useState({});

  const slides = [
    { image: picture1, description: 'Welcome to CIC EasyBima' },
    { image: picture2, description: 'Your trusted insurance partner' },
    { image: picture3, description: 'Easy insurance solutions' },
    { image: picture4, description: 'Guide to insurance' },
    { image: picture5, description: 'Guides through life' },
    { image: picture6, description: 'Your complete insurance solution' },
  ];

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prevSlide) => (prevSlide + 1) % slides.length);
      setIsTransitioning(false);
    }, 50);
  }, [slides.length, isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
      setIsTransitioning(false);
    }, 50);
  }, [slides.length, isTransitioning]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    let isMounted = true;
    const preloadImages = async () => {
      try {
        setIsLoading(true);
        const totalImages = slides.length;
        let loadedImages = 0;
        await Promise.all(slides.map(slide => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.setAttribute('importance', 'high');
            img.setAttribute('loading', 'eager');
            img.setAttribute('decoding', 'sync');
            img.src = slide.image;
            img.onload = () => {
              loadedImages++;
              if (isMounted) {
                console.log(`Loaded image ${loadedImages}/${totalImages}`);
              }
              resolve();
            };
            img.onerror = reject;
          });
        }));
        if (isMounted) {
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error loading images:', err);
        if (isMounted) {
          setError('Failed to load high-resolution images');
          setIsLoading(false);
        }
      }
    };
    preloadImages();
    return () => {
      isMounted = false;
    };
  }, [slides]);

  useEffect(() => {
    let interval;
    if (!isPaused) {
      interval = setInterval(() => {
        if (document && !document.hidden && !isTransitioning) {
          setCurrentImageIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }
      }, 5000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPaused, slides.length, isTransitioning]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Login attempt with:', formData);

      const result = await login({
        identifier: formData.idNumber,
        userType: formData.userType,
        password: formData.password
      });

      if (result.success) {
        console.log('Login successful, redirecting to dashboard');
        setTimeout(() => {
          navigate('/dashboard');
        }, 100);
      } else {
        setLoginError(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    const identifierValidation = validateIdentifier(formData.idNumber, formData.userType);
    if (!identifierValidation.isValid) {
      errors.idNumber = identifierValidation.error;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.error;
    }

    return errors;
  };

  const handleInputFocus = (e) => {
    const { name } = e.target;
    setFocusedInputs(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    setFocusedInputs(prev => ({
      ...prev,
      [name]: false
    }));

    if (value.trim()) {
      validateField(name, value).then(isValid => {
        setValidatedFields(prev => ({
          ...prev,
          [name]: isValid ? 'valid' : 'invalid'
        }));
      });
    }
  };

  const validateField = async (name, value) => {
    let error = '';
    let isValid = false;

    switch (name) {
      case 'idNumber':
        const identifierValidation = validateIdentifier(value, formData.userType);
        isValid = identifierValidation.isValid;
        break;
      case 'password':
        const passwordValidation = validatePassword(value);
        isValid = passwordValidation.isValid;
        break;
      default:
        isValid = true;
        break;
    }

    if (!isValid) {
      setFormErrors(prev => ({
        ...prev,
        [name]: error
      }));
      return false;
    }

    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));

    return isValid;
  };

  return (
    <div className={`login-signup-page ${theme}-mode`}>
      <div className="split-screen" style={{ display: 'flex', flexDirection: 'row', minHeight: '100vh' }}>
        <div
          className="left-panel gradient-bg"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ position: 'relative', flex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
        >
          <div className="slider-container">
            {slides.map((slide, index) => (
              <img
                key={slide.image}
                src={slide.image}
                alt={`Slide ${index + 1}`}
                className={`slider-image ${index === currentImageIndex ? 'active' : ''}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: index === currentImageIndex ? 1 : 0,
                  transition: 'opacity 1s ease-in-out'
                }}
              />
            ))}
          </div>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3), rgba(0,0,0,0.7))', zIndex: 1 }} />
          <div className="slide-description" style={{ zIndex: 2, position: 'absolute', bottom: 30, left: 0, width: '100%', color: '#fff', textAlign: 'center', fontSize: '1.2rem', fontWeight: 500, textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
            {slides[currentImageIndex].description}
          </div>
          <div className="slider-controls" style={{ zIndex: 3, position: 'absolute', bottom: 10, left: 0, width: '100%', display: 'flex', justifyContent: 'center', gap: 8 }}>
            {slides.map((slide, index) => (
              <div
                key={slide.image}
                className={`slide-dot ${currentImageIndex === index ? 'active' : ''}`}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: currentImageIndex === index ? '#fff' : 'rgba(255,255,255,0.5)',
                  margin: '0 4px',
                  cursor: 'pointer',
                  border: currentImageIndex === index ? '2px solid #800000' : 'none',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>
        <div className="right-panel" style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: '#f6f7fa'
          }}>
          <div className="login-container">
            <img src={logo} alt="cic insurance" className="logo throbbing-logo" style={{ display: 'block', margin: '0 auto 30px', maxWidth: '150px' }} />
            <h1 style={{ textAlign: 'center', marginBottom: '10px', color: '#800000' }}>Sign in to CIC EasyBima</h1>
            <p className="tagline" style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>Getting insured with us is easy as 1-2-3</p>

            {loginError && (
              <div className="error-message error-shake" style={{
                color: '#721c24',
                backgroundColor: '#f8d7da',
                padding: '10px 15px',
                borderRadius: '5px',
                marginBottom: '20px',
                textAlign: 'center',
                border: '1px solid #f5c6cb'
              }}>
                {loginError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="user-type" style={{ marginBottom: '20px', textAlign: 'center' }}>
                <label style={{ marginRight: '10px' }}>
                  <input
                    type="radio"
                    name="userType"
                    value="customer"
                    checked={formData.userType === 'customer'}
                    onChange={handleInputChange}
                  />
                  Customer
                </label>
                <label>
                  <input
                    type="radio"
                    name="userType"
                    value="intermediary"
                    checked={formData.userType === 'intermediary'}
                    onChange={handleInputChange}
                  />
                  Intermediary
                </label>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label htmlFor="idNumber" style={{ display: 'block', marginBottom: '5px' }}>
                  {formData.userType === USER_TYPES.INTERMEDIARY ? 'KRA PIN *' : 'ID/Passport Number *'}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    id="idNumber"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    placeholder={formData.userType === USER_TYPES.INTERMEDIARY
                      ? "Enter your KRA PIN"
                      : "Enter your ID/Passport Number"}
                    className={formErrors.idNumber ? 'error error-shake' : ''}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${focusedInputs.idNumber ? '#4a90e2' : '#ccc'}`,
                      borderRadius: '5px',
                      boxShadow: focusedInputs.idNumber ? '0 0 3px rgba(74, 144, 226, 0.5)' : 'none'
                    }}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                  {validatedFields.idNumber === 'valid' && (
                    <span className="success-checkmark">✓</span>
                  )}
                </div>
                {formErrors.idNumber && (
                  <span className="error-text" style={{ color: 'red', fontSize: '12px' }}>{formErrors.idNumber}</span>
                )}
                <small style={{
                  display: 'block',
                  marginTop: '5px',
                  fontSize: '11px',
                  color: '#666'
                }}>
                  {formData.userType === USER_TYPES.INTERMEDIARY
                    ? 'Format: 11 alphanumeric characters (e.g., A012345678B)'
                    : 'Format: 8-10 digits (e.g., 12345678)'}
                </small>
              </div>

              <div className="form-group password-toggle" style={{ marginBottom: '20px' }}>
                <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password</label>
                <div className="password-input-container" style={{ position: 'relative' }}>
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className={formErrors.password ? 'error error-shake' : ''}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${focusedInputs.password ? '#4a90e2' : '#ccc'}`,
                      borderRadius: '5px',
                      boxShadow: focusedInputs.password ? '0 0 3px rgba(74, 144, 226, 0.5)' : 'none'
                    }}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                  {validatedFields.password === 'valid' && (
                    <span className="success-checkmark">✓</span>
                  )}
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px'
                    }}
                  >
                    {passwordVisible ? '🙈' : '👁️'}
                  </button>
                </div>
                {formErrors.password && (
                  <span className="error-text" style={{ color: 'red', fontSize: '12px' }}>{formErrors.password}</span>
                )}
              </div>

              <div className="form-options" style={{ marginBottom: '20px', textAlign: 'center' }}>
                <Link to="/forgot-password" className="forgot-password" style={{ color: 'blue', textDecoration: 'underline' }}>
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className={`btn modern-btn ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
                style={{
                  backgroundColor: '#800000',
                  color: 'white',
                  width: '100%',
                  padding: '12px',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#9a0000'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#800000'}
              >
                {isSubmitting ? <span className="spinner"></span> : 'Sign In'}
              </button>

              {/* Direct link to dashboard for testing */}
              {/* <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <Link to="/dashboard" style={{ color: '#800000', textDecoration: 'underline', fontWeight: 600 }}>
                  Go to Dashboard (Direct Link)
                </Link>
              </div> */}
            </form>

            <p className="register-link" style={{ textAlign: 'center', marginTop: '20px' }}>
              Don't have an account? <Link to="/register" style={{ color: 'maroon', textDecoration: 'underline' }}>Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<CoverPage />} />
            <Route path="/home" element={<App />} />
            <Route path="/login" element={<LoginSignup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/profile" element={<MyProfilePage />} />
            <Route path="/policies" element={<PoliciesPage />} />
            <Route path="/claims" element={<ClaimsPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="/quoteformsummary" element={<QuoteFormSummary />} />
            <Route path="/datepicker" element={<DatePickerDemo />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </ThemeProvider>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  if (process.env.NODE_ENV === 'development') {
    console.error("Root element with id 'root' not found. Ensure it exists in index.html.");
  }
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <AppWrapper />
      </React.StrictMode>
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error rendering React application:", error);
    }
    // Fallback rendering directly to the body if root fails
    document.body.innerHTML = `
      <div style="padding: 20px; margin: 20px; border: 1px solid #fff; border-radius: 4px;
                  background-color: #f8d7da; color: #721c24; font-family: sans-serif;">
        <h2>Something went wrong while loading the application.</h2>
        <p>Please try refreshing the page. If the problem persists, contact support.</p>
        <button onclick="window.location.reload()"
                style="padding: 8px 16px; background-color: #dc3545; color: white;
                       border: none; border-radius: 4px; cursor: pointer;">
          Refresh Page
        </button>
      </div>
    `;
  }
}