# Deployment Guide

## Pre-Deployment Checklist

### Security
- [ ] Remove all `.env` files from git
- [ ] Ensure `.gitignore` includes `.env*`
- [ ] Rotate/update API keys
- [ ] Enable HTTPS on production
- [ ] Set up rate limiting appropriately
- [ ] Configure CORS properly
- [ ] Use environment variables for all secrets
- [ ] Review error messages (no sensitive data)

### Code Quality
- [ ] Run tests: `npm test`
- [ ] Check linting: `npm run lint`
- [ ] Review all console.logs (remove debug logs)
- [ ] Verify error handling
- [ ] Test all API endpoints
- [ ] Test with real LLM API
- [ ] Test rate limiting
- [ ] Test timeout handling

### Performance
- [ ] Optimize bundle size
- [ ] Enable gzip compression
- [ ] Set up CDN for assets
- [ ] Configure caching headers
- [ ] Monitor API response times
- [ ] Set up monitoring/alerts

### Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Cross-browser testing
- [ ] Mobile responsiveness
- [ ] Load testing (100+ concurrent users)
- [ ] Security scanning

## Backend Deployment

### Heroku
```bash
cd backend

# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set PORT=8080
heroku config:set HF_TOKEN=hf_xxx
heroku config:set LLM_MODEL=meta-llama/Meta-Llama-3-8B-Instruct:novita
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Railway
```bash
cd backend

# Connect Railway
railway init

# Set environment variables in dashboard
# Deploy automatically on push
git push
```

### Docker (Any Cloud)
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 8080
CMD ["npm", "start"]
```

### Environment Variables (Production)
```
PORT=8080
HF_TOKEN=hf_production_token
LLM_MODEL=meta-llama/Meta-Llama-3-8B-Instruct:novita
NODE_ENV=production
REQUEST_TIMEOUT_MS=30000
API_RATE_LIMIT_WINDOW_MS=900000
API_RATE_LIMIT_MAX=50
```

## Frontend Deployment

### Vercel (Recommended for Next.js)
```bash
cd frontend

# Connect to Vercel
vercel

# Set environment variable
vercel env add NEXT_PUBLIC_BACKEND_URL https://your-backend.com
```

### Netlify
```bash
cd frontend

# Build
npm run build

# Deploy
netlify deploy --prod --dir=.next
```

### Docker + Cloud Run (GCP)
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables (Production)
```
NEXT_PUBLIC_BACKEND_URL=https://your-backend.com
```

## Database Setup (Optional Future)

```sql
-- User sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  user_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Learning history
CREATE TABLE assessments (
  id UUID PRIMARY KEY,
  user_id UUID,
  topic VARCHAR(255),
  score INT,
  analysis JSON,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Monitoring Setup

### Backend Monitoring
```bash
# Using PM2
pm2 start server.js --name "ai-coach-backend"
pm2 startup
pm2 save

# Logs
pm2 logs ai-coach-backend
```

### Frontend Monitoring
- Set up Vercel Analytics
- Enable error tracking (Sentry)
- Monitor Core Web Vitals

### Metrics to Monitor
- API response time
- Error rate
- LLM API quota usage
- Request latency
- Database connections (if added)

## Scaling Considerations

### Horizontal Scaling
```
Load Balancer (nginx/HAProxy)
  ├─ Backend Instance 1
  ├─ Backend Instance 2
  └─ Backend Instance 3
```

### Vertical Scaling
- Increase server CPU/RAM
- Optimize database queries
- Cache responses
- Use CDN for static assets

### Cost Optimization
- Monitor HuggingFace API usage
- Consider cheaper models
- Use batch processing if possible
- Implement request deduplication
- Cache common responses

## Backup & Recovery

### Database Backup
```bash
# Daily automated backups
pg_dump database_name > backup_$(date +%Y%m%d).sql

# Store in S3/Cloud Storage
aws s3 cp backup_*.sql s3://bucket/backups/
```

### Code Backup
- Use GitHub for version control
- Tag releases: `git tag v1.0.0`
- Maintain changelog

## Post-Deployment

### Smoke Tests
- [ ] Test homepage loads
- [ ] Generate quiz questions
- [ ] Submit answers
- [ ] Verify all 4 LLM calls work
- [ ] Check score calculation
- [ ] Verify coaching message
- [ ] Check roadmap generation
- [ ] Test error handling
- [ ] Verify rate limiting works
- [ ] Check response times

### Documentation
- [ ] Update API documentation
- [ ] Document deployment process
- [ ] Create runbooks for incidents
- [ ] Document scaling procedures

### Monitoring
- [ ] Set up alerts for errors
- [ ] Monitor API quota
- [ ] Track performance metrics
- [ ] Monitor error rates

## Incident Response

### High Error Rate
1. Check logs for patterns
2. Verify HuggingFace API status
3. Check rate limiting
4. Review recent deployments

### High Latency
1. Check backend load
2. Verify LLM API response time
3. Check database queries
4. Monitor network

### Out of Quota
1. Check HuggingFace usage
2. Verify billing
3. Consider cheaper models
4. Implement rate limiting

## Rollback Plan

```bash
# If deployment fails
git revert <commit-hash>
git push

# Verify rollback
curl https://your-app.com/health
```

## Cost Estimation

| Service | Free Tier | Paid |
|---------|-----------|------|
| Backend (Heroku) | ❌ | $7-50/mo |
| Frontend (Vercel) | ✅ | $20-150/mo |
| LLM API (HF) | Limited | $0.01-1.00/request |
| Database (if needed) | ✅ Limited | $50-500/mo |
| **Total** | $50-100 | $100-700/mo |

## Support Contacts

- HuggingFace Support: https://huggingface.co/support
- Vercel Support: https://vercel.com/support
- Backend Platform Support: (depends on choice)

---

**Status**: Ready for Production
**Last Updated**: 2026-05-25
