// D-FENSE Configuration
// This file contains environment-specific configuration for the D-FENSE application

interface Config {
  apiBaseUrl: string;
  env: 'development' | 'production' | 'test';
  features: {
    enableBackend: boolean;
    enableMockData: boolean;
    enableOfflineMode: boolean;
  };
  app: {
    name: string;
    version: string;
    description: string;
  };
}

// Default configuration
const defaultConfig: Config = {
  apiBaseUrl: 'http://localhost:3001/api',
  env: 'development',
  features: {
    enableBackend: true,
    enableMockData: true,
    enableOfflineMode: true,
  },
  app: {
    name: 'D-FENSE',
    version: '2.0.0',
    description: 'Data-driven Fitness and Evaluation for Nutritional Support and Empowerment',
  },
};

// Environment-specific overrides
const getConfig = (): Config => {
  // Check if we're in browser environment
  if (typeof window !== 'undefined') {
    // Browser environment - check for environment variables or use defaults
    const isDevelopment = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1' ||
                          window.location.hostname.includes('localhost');
    
    return {
      ...defaultConfig,
      env: isDevelopment ? 'development' : 'production',
      apiBaseUrl: isDevelopment 
        ? 'http://localhost:3001/api'
        : 'https://api.dfense.id/api', // Production API URL (adjust as needed)
    };
  }
  
  // Server/build environment - use environment variables or defaults
  return {
    ...defaultConfig,
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL || defaultConfig.apiBaseUrl,
    env: (process.env.NODE_ENV as Config['env']) || defaultConfig.env,
  };
};

export const config = getConfig();

// Helper functions
export const isProduction = () => config.env === 'production';
export const isDevelopment = () => config.env === 'development';
export const isBackendEnabled = () => config.features.enableBackend;
export const isMockDataEnabled = () => config.features.enableMockData;
export const isOfflineModeEnabled = () => config.features.enableOfflineMode;

// API endpoints
export const API_ENDPOINTS = {
  auth: {
    signin: `${config.apiBaseUrl}/auth/signin`,
    signup: `${config.apiBaseUrl}/auth/signup`,
    signout: `${config.apiBaseUrl}/auth/signout`,
    me: `${config.apiBaseUrl}/auth/me`,
    resetPassword: `${config.apiBaseUrl}/auth/reset-password`,
  },
  assessments: `${config.apiBaseUrl}/assessments`,
  health: `${config.apiBaseUrl}/health`,
} as const;

export default config;