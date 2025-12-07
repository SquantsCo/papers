import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';
import rateLimit from 'express-rate-limit';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { authenticate } from './middleware/auth';
import healthRouter from './routes/health';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Health check (no auth required)
app.use('/health', healthRouter);

// Proxy to Papers Service
app.use('/api/papers', authenticate, createProxyMiddleware({
  target: process.env.PAPERS_SERVICE_URL || 'http://papers-service:4001',
  changeOrigin: true,
  pathRewrite: {
    '^/api/papers': '/api/papers'
  },
  onError: (err, req, res) => {
    logger.error('Papers Service Proxy Error:', err);
    res.status(503).json({ error: 'Papers service unavailable' });
  }
}));

// Proxy to ArXiv Service
app.use('/api/arxiv', authenticate, createProxyMiddleware({
  target: process.env.ARXIV_SERVICE_URL || 'http://arxiv-service:4002',
  changeOrigin: true,
  pathRewrite: {
    '^/api/arxiv': '/api/arxiv'
  },
  onError: (err, req, res) => {
    logger.error('ArXiv Service Proxy Error:', err);
    res.status(503).json({ error: 'ArXiv service unavailable' });
  }
}));

// Proxy to Comments Service
app.use('/api/comments', authenticate, createProxyMiddleware({
  target: process.env.COMMENTS_SERVICE_URL || 'http://comments-service:4003',
  changeOrigin: true,
  pathRewrite: {
    '^/api/comments': '/api/comments'
  },
  onError: (err, req, res) => {
    logger.error('Comments Service Proxy Error:', err);
    res.status(503).json({ error: 'Comments service unavailable' });
  }
}));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

export default app;
