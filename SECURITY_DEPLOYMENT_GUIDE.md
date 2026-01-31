# Security Deployment Guide

## Pre-Deployment Checklist

### ✅ Security Configuration

- [ ] Environment variables properly configured
- [ ] Database migrations applied
- [ ] Rate limiting tested
- [ ] Webhook verification working
- [ ] Authentication flows tested
- [ ] TLS/SSL certificates valid
- [ ] CORS policies configured

---

## Step 1: Database Migration

```bash
# Generate Prisma client with new schema
npx prisma generate

# Apply migrations
npx prisma migrate deploy

# Verify schema
npx prisma studio
```

### New Schema Fields

The migration adds:
- `User.etpTokenHash` - SHA-256 hash of ETP tokens
- `User.etpTokenExpiresAt` - Token expiration date
- `User.thorTokenHash` - SHA-256 hash of THOR tokens
- `User.thorTokenExpiresAt` - Token expiration date
- `ProcessedWebhook` table - Webhook idempotency tracking

---

## Step 2: Environment Variables

### Required Variables

```env
# Database
DATABASE_URL=your_postgresql_connection_string
DIRECT_URL=your_direct_connection_string

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# API Keys
OPENAI_API_KEY=your_openai_api_key
WHOP_API_KEY=your_whop_api_key
WHOP_WEBHOOK_SECRET=your_webhook_secret

# Security
ENCRYPTION_KEY=your_32_character_encryption_key
CRON_SECRET=your_cron_job_secret

# OAuth
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
```

### Security Notes

1. **Never commit** `.env.local` to version control
2. Use **strong random values** for all secrets
3. **Rotate keys** every 90 days
4. Use **different keys** for staging/production

---

## Step 3: Rate Limiting Configuration

### Implementation

Apply rate limiting to sensitive endpoints:

```typescript
import { rateLimit } from '@/lib/rate-limit'

const limiter = rateLimit({
  limit: 100,      // requests per window
  window: 60000,   // 1 minute
  identifier: 'api-endpoint'
})

export async function POST(req: NextRequest) {
  const result = await limiter(req)
  
  if (!result.success) {
    return createRateLimitResponse(100)
  }
  
  // Your endpoint logic
}
```

### Recommended Limits

| Endpoint Type | Limit | Window |
|--------------|-------|--------|
| Authentication | 5 | 60s |
| API Routes | 100 | 60s |
| Webhooks | 1000 | 60s |
| File Upload | 10 | 60s |

---

## Step 4: Webhook Security

### Whop Webhooks

```typescript
import { isWebhookProcessed, markWebhookProcessed } from '@/lib/webhook-idempotency'

export async function POST(req: NextRequest) {
  const event = whop.webhooks.unwrap(body, { headers })
  
  // Check for duplicates
  const processed = await isWebhookProcessed(event.id, event.type)
  if (processed) {
    return NextResponse.json({ received: true })
  }
  
  // Process webhook
  await processEvent(event)
  
  // Mark as processed
  await markWebhookProcessed(event.id, event.type)
  
  return NextResponse.json({ received: true })
}
```

---

## Step 5: Input Validation

### Apply Validation to All Inputs

```typescript
import { validateTradeData, validateAccountNumber } from '@/lib/validation-schemas'

export async function POST(req: NextRequest) {
  const body = await req.json()
  
  // Validate input
  const validation = validateTradeData(body)
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid data', issues: validation.error.issues },
      { status: 400 }
    )
  }
  
  // Process validated data
  const result = await processTrade(validation.data)
  return NextResponse.json(result)
}
```

---

## Step 6: Secure Token Management

### Generate Secure Tokens

```typescript
import { generateSecureToken, verifySecureToken } from '@/lib/api-auth'

// Generate token for user
const token = await generateSecureToken(userId, 'etp')
console.log('Token:', token) // Show to user once

// Verify token on request
const user = await verifySecureToken(token, 'etp')
if (!user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

### Token Rotation

Rotate tokens every 30 days:

```typescript
// Schedule job to rotate tokens
cron.schedule('0 0 * * 0', async () => {
  const expiringTokens = await prisma.user.findMany({
    where: {
      etpTokenExpiresAt: {
        lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    }
  })
  
  for (const user of expiringTokens) {
    await generateSecureToken(user.id, 'etp')
    // Notify user to update token
  }
})
```

---

## Step 7: Security Headers

### Next.js Configuration

Update `next.config.ts`:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.openai.com https://api.whop.com;"
          }
        ]
      }
    ]
  }
}
```

---

## Step 8: Monitoring & Alerting

### Key Metrics to Monitor

1. **Authentication Failures**
   - Track failed login attempts
   - Alert on suspicious patterns

2. **Rate Limit Hits**
   - Monitor endpoints hitting limits
   - Identify potential attacks

3. **Webhook Failures**
   - Track webhook processing errors
   - Monitor for duplicate attempts

4. **Database Connections**
   - Monitor pool usage
   - Alert on connection exhaustion

### Monitoring Setup

```typescript
// Example: Add to API routes
import { logger } from '@/lib/logger'

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  
  try {
    const result = await processRequest(req)
    
    logger.info('API Success', {
      endpoint: req.url,
      duration: Date.now() - startTime,
      status: 200
    })
    
    return result
  } catch (error) {
    logger.error('API Error', {
      endpoint: req.url,
      error: error.message,
      duration: Date.now() - startTime
    })
    
    throw error
  }
}
```

---

## Step 9: Testing Security

### Pre-Production Tests

```bash
# 1. Test rate limiting
for i in {1..150}; do
  curl -X POST https://your-api.com/endpoint
done

# 2. Test input validation
curl -X POST https://your-api.com/trades \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}'

# 3. Test webhook idempotency
curl -X POST https://your-api.com/webhooks/whop \
  -H "Content-Type: application/json" \
  -d '{"id": "test-123", "type": "test"}'

# Send same request twice - should only process once
```

---

## Step 10: Incident Response

### Security Incident Procedure

1. **Detection**
   - Monitor alerts
   - Review logs
   - Identify scope

2. **Containment**
   - Block malicious IPs
   - Disable affected features
   - Preserve evidence

3. **Eradication**
   - Patch vulnerabilities
   - Update credentials
   - Clean systems

4. **Recovery**
   - Restore from backups
   - Monitor for recurrence
   - Document lessons learned

---

## Post-Deployment

### Verification Steps

1. **Test Authentication**
   - Discord OAuth
   - Google OAuth
   - Email/password

2. **Test API Endpoints**
   - All routes respond correctly
   - Rate limiting active
   - Validation working

3. **Test Webhooks**
   - Whop webhooks processing
   - Idempotency working

4. **Monitor Logs**
   - Check for errors
   - Verify performance
   - Review security events

### Ongoing Maintenance

- **Daily**: Review security alerts
- **Weekly**: Check for dependency updates
- **Monthly**: Rotate API keys
- **Quarterly**: Security audit

---

## Emergency Contacts

| Role | Contact | Responsibility |
|------|---------|----------------|
| Security Lead | security@qunt-edge.app | Security incidents |
| DevOps Lead | devops@qunt-edge.app | Infrastructure |
| CTO | cto@qunt-edge.app | Critical decisions |

---

## Additional Resources

- [OWASP Security Guidelines](https://owasp.org/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [Prisma Security Guide](https://www.prisma.io/docs/guides/performance-and-optimization/security-configuration)

---

*Last Updated: 2026-02-01*  
*Version: 1.0*
