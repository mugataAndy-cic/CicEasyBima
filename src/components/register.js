import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css';
import logo from '../assets/cic_insurance.png';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validatePhoneNumber,
  validateRequired,
  formatPhoneNumber
} from '../utils/formValidation';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    idPassportNo: '',
    kraPin: '',
    nationality: '',
    postalAddress: '',
    mobileNo: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    consentMarketing: false,
  });
  
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;

    if (name === 'mobileNo') {
      processedValue = formatPhoneNumber(value);
    }

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : processedValue,
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      const firstNameValidation = validateRequired(formData.firstName, 'First name');
      if (!firstNameValidation.isValid) newErrors.firstName = firstNameValidation.error;

      const lastNameValidation = validateRequired(formData.lastName, 'Last name');
      if (!lastNameValidation.isValid) newErrors.lastName = lastNameValidation.error;

      const genderValidation = validateRequired(formData.gender, 'Gender');
      if (!genderValidation.isValid) newErrors.gender = genderValidation.error;

      const idValidation = validateRequired(formData.idPassportNo, 'ID/Passport Number');
      if (!idValidation.isValid) newErrors.idPassportNo = idValidation.error;
      
      const emailValidation = validateEmail(formData.email);
      if (!emailValidation.isValid) newErrors.email = emailValidation.error;
      
      const phoneValidation = validatePhoneNumber(formData.mobileNo);
      if (!phoneValidation.isValid) newErrors.mobileNo = phoneValidation.error;
    } else if (step === 2) {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) newErrors.password = passwordValidation.error;
      
      const confirmPasswordValidation = validateConfirmPassword(formData.password, formData.confirmPassword);
      if (!confirmPasswordValidation.isValid) newErrors.confirmPassword = confirmPasswordValidation.error;
      
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms and conditions';
      }
    }
    
    return newErrors;
  };

  const nextStep = () => {
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateStep(currentStep);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Form submitted:', formData);
    }
    // Add form submission logic here (e.g., API call)
    
    // For demo purposes, navigate to login after successful registration
    alert('Registration successful! Please login.');
    navigate('/login');
  };

  const renderStepIndicator = () => {
    return (
      <div className="step-indicator">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div 
            key={i}
            className={`step-dot ${currentStep > i ? 'completed' : ''} ${currentStep === i + 1 ? 'active' : ''}`}
          >
            <span>{i + 1}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderStepLabel = () => {
    switch (currentStep) {
      case 1:
        return 'Personal Information';
      case 2:
        return 'Account Security';
      default:
        return '';
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <img src={logo} alt="CIC Insurance" className="register-logo" />
          <h2>Create an Account</h2>
          <p>Join CIC Insurance and get started with your insurance journey</p>
          
          {renderStepIndicator()}
          <h3 className="step-label">{renderStepLabel()}</h3>
        </div>
        
        <form className="register-form" onSubmit={currentStep === totalSteps ? handleSubmit : (e) => e.preventDefault()}>
          {currentStep === 1 && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <select
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                  >
                    <option value="">Select Title</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Miss">Miss</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <select
                    name="gender"
                    id="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {errors.gender && <span className="error-text">{errors.gender}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="middleName">Middle Name</label>
                  <input
                    type="text"
                    id="middleName"
                    name="middleName"
                    placeholder="Middle Name (Optional)"
                    value={formData.middleName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                  {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="idPassportNo">ID/Passport No</label>
                  <input
                    type="text"
                    id="idPassportNo"
                    name="idPassportNo"
                    placeholder="ID/Passport No"
                    value={formData.idPassportNo}
                    onChange={handleChange}
                    required
                  />
                  {errors.idPassportNo && <span className="error-text">{errors.idPassportNo}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="kraPin">KRA Pin</label>
                  <input
                    type="text"
                    id="kraPin"
                    name="kraPin"
                    placeholder="KRA Pin"
                    value={formData.kraPin}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="nationality">Nationality</label>
                  <select
                    name="nationality"
                    id="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                  >
                    <option value="">Select Nationality</option>
                    <option value="Kenyan">Kenyan</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="mobileNo">Mobile No</label>
                  <input
                    type="text"
                    id="mobileNo"
                    name="mobileNo"
                    placeholder="Mobile No"
                    value={formData.mobileNo}
                    onChange={handleChange}
                    required
                  />
                  {errors.mobileNo && <span className="error-text">{errors.mobileNo}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="postalAddress">Postal Address</label>
                <input
                  type="text"
                  id="postalAddress"
                  name="postalAddress"
                  placeholder="Postal Address"
                  value={formData.postalAddress}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
          
          {currentStep === 2 && (
            <>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
              
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                  />
                  By creating an account you are agreeing to our Privacy Policy and Terms of Use
                </label>
                {errors.agreeToTerms && <span className="error-text">{errors.agreeToTerms}</span>}
              </div>
              
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="consentMarketing"
                    checked={formData.consentMarketing}
                    onChange={handleChange}
                  />
                  I consent to receiving marketing information by CIC Insurance Group.
                </label>
              </div>
            </>
          )}
          
          <div className="form-navigation">
            {currentStep > 1 && (
              <button 
                type="button" 
                className="prev-button"
                onClick={prevStep}
              >
                Back
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button 
                type="button" 
                className="next-button"
                onClick={nextStep}
              >
                Next
              </button>
            ) : (
              <button 
                type="submit" 
                className="register-button"
              >
                Register
              </button>
            )}
          </div>
          
          <p className="login-link" style={{ textAlign: 'center', marginTop: '15px' }}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;