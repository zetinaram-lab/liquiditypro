// ============================================
// Production-Safe Logger
// ============================================
// Only logs in development mode
// Prevents INFO_LEAKAGE security vulnerability

const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (isDev) {
      console.warn(...args);
    }
  },
  
  error: (...args: any[]) => {
    if (isDev) {
      console.error(...args);
    }
    // En producción podrías enviar a servicio de error tracking
    // como Sentry, LogRocket, etc.
  },
  
  info: (...args: any[]) => {
    if (isDev) {
      console.info(...args);
    }
  },
  
  debug: (...args: any[]) => {
    if (isDev) {
      console.debug(...args);
    }
  },
  
  table: (...args: any[]) => {
    if (isDev) {
      console.table(...args);
    }
  },
};

// Helper para errores críticos que SÍ deben loggearse en producción
// (pero sin exponer datos sensibles)
export const logCriticalError = (message: string, metadata?: Record<string, any>) => {
  if (isDev) {
    console.error('🔴 CRITICAL:', message, metadata);
  } else {
    // En producción: enviar a servicio de monitoring
    // Ejemplo: Sentry.captureException(new Error(message));
    console.error(message); // Solo mensaje genérico
  }
};
