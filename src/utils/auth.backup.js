/**
 * Authentication utility functions for CIC EasyBima
 * Centralizes authentication logic, validation, and user management
 */

// User type constants
export const USER_TYPES = {
  CUSTOMER: 'customer',
  INTERMEDIARY: 'intermediary'
};

// Regular expressions for validation
const VALIDATION_REGEX = {
  // Customer ID should be 8-10 digits
  CUSTOMER_ID: /^[0-9]{8,10}$/,
  // KRA PIN should be 11 alphanumeric characters (uppercase)
  KRA_PIN: /^[A-Z0-9]{11}$/,
  // Email validation
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  // Password should be at least 6 characters
  PASSWORD: /^.{6,}$/
};

/**
 * Validates a customer ID
 * @param {string} id - The customer ID to validate
 * @returns {boolean} - Whether the ID is valid
 */
export const validateCustomerId = (id) => {
  if (!id || typeof id !== 'string') return false;
  return VALIDATION_REGEX.CUSTOMER_ID.test(id);
};

/**
 * Validates a KRA PIN for intermediaries
 * @param {string} kraPin - The KRA PIN to validate
 * @returns {boolean} - Whether the KRA PIN is valid
 */
export const validateKraPin = (kraPin) => {
  if (!kraPin || typeof kraPin !== 'string') return false;
  return VALIDATION_REGEX.KRA_PIN.test(kraPin);
};

/**
 * Validates an identifier based on user type
 * @param {string} identifier - The identifier to validate (ID or KRA PIN)
 * @param {string} userType - The user type (customer or intermediary)
 * @returns {Object} - Validation result with isValid and error message
 */
export const validateIdentifier = (identifier, userType) => {
  if (!identifier || !identifier.trim()) {
    return {
      isValid: false,
      error: userType === USER_TYPES.CUSTOMER 
        ? 'ID Number is required' 
        : 'KRA PIN is required'
    };
  }

  // Check if it's an email (for both user types)
  if (VALIDATION_REGEX.EMAIL.test(identifier)) {
    return { isValid: true, error: '' };
  }

  // Validate based on user type
  if (userType === USER_TYPES.INTERMEDIARY) {
    if (!validateKraPin(identifier)) {
      return { 
        isValid: false, 
        error: 'Please enter a valid KRA PIN (11 alphanumeric characters)'
      };
    }
  } else {
    if (!validateCustomerId(identifier)) {
      return { 
        isValid: false, 
        error: 'Please enter a valid ID Number (8-10 digits)'
      };
    }
  }

  return { isValid: true, error: '' };
};

/**
 * Validates a password
 * @param {string} password - The password to validate
 * @returns {Object} - Validation result with isValid and error message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (!VALIDATION_REGEX.PASSWORD.test(password)) {
    return { isValid: false, error: 'Password must be at least 6 characters' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Performs login and stores authentication data
 * @param {Object} userData - User data including identifier and userType
 * @returns {Promise<Object>} - Login result
 */
export const login = async (userData) => {
  try {
    // In a real app, this would make an API call
    // For demo purposes, we're just simulating a successful login
    
    // Store authentication data
    sessionStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('authToken', 'demo-token-123');
    localStorage.setItem('user', JSON.stringify({
      id: userData.identifier,
      userType: userData.userType
    }));
    
    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      error: 'Login failed. Please try again.'
    };
  }
};

/**
 * Logs out the current user
 * @returns {Promise<Object>} - Logout result
 */
export const logout = async () => {
  try {
    // Clear authentication data
    sessionStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { 
      success: false, 
      error: 'Logout failed. Please try again.'
    };
  }
};

/**
 * Checks if a user is authenticated
 * @returns {boolean} - Whether the user is authenticated
 */
export const isAuthenticated = () => {
  const sessionAuth = sessionStorage.getItem('isAuthenticated') === 'true';
  const token = localStorage.getItem('authToken');
  const expiresAt = localStorage.getItem('expiresAt');
  
  if (!token || !expiresAt) {
    return false;
  }
  
  // Check if token is expired
  const isTokenValid = new Date().getTime() < parseInt(expiresAt);
  
  return sessionAuth && !!token && isTokenValid;
};

/**
 * Gets the current user data
 * @returns {Object|null} - User data or null if not authenticated
 */
export const getCurrentUser = () => {
  if (!isAuthenticated()) return null;
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Gets the label for the identifier input based on user type
 * @param {string} userType - The user type
 * @returns {string} - The label for the identifier input
 */
export const getIdentifierLabel = (userType) => {
  return userType === USER_TYPES.INTERMEDIARY ? 'KRA PIN' : 'ID/Passport Number';
};

/**
 * Gets the placeholder for the identifier input based on user type
 * @param {string} userType - The user type
 * @returns {string} - The placeholder for the identifier input
 */
export const getIdentifierPlaceholder = (userType) => {
  return userType === USER_TYPES.INTERMEDIARY 
    ? 'Enter your KRA PIN' 
    : 'Enter your ID/Passport Number';
};
