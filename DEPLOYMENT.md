# Deployment Guide

## Quick Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial Bolna AI Dashboard"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect Next.js
   - Deploy with default settings

3. **Get Your Webhook URL**
   - After deployment, your webhook URL will be:
   - `https://your-app-name.vercel.app/api/webhook`

4. **Configure Bolna AI**
   - Copy the webhook URL
   - Add it to your Bolna AI agent settings
   - Save configuration

## Alternative Deployment Options

### Netlify
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables if needed

### Railway
1. Connect GitHub repository
2. Railway will auto-detect Next.js
3. Deploy automatically
4. Get webhook URL from Railway dashboard

### DigitalOcean App Platform
1. Create new app from GitHub
2. Select Next.js buildpack
3. Deploy with default settings

## Environment Variables

No environment variables are required for basic functionality.

## Production Considerations

1. **Database Storage**: Consider replacing file storage with a database for production
2. **Authentication**: Add authentication if needed
3. **Rate Limiting**: Implement rate limiting for webhook endpoint
4. **Monitoring**: Add logging and monitoring
5. **SSL**: Ensure HTTPS is enabled

## Testing Webhook

After deployment, test your webhook:

```bash
curl -X POST https://your-app.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "call_id": "test_123",
    "status": "completed",
    "duration": 120,
    "caller_number": "+1234567890",
    "agent_name": "Test Agent"
  }'
```

## Troubleshooting

### Webhook Not Working
1. Check if your app is accessible from the internet
2. Verify the webhook URL is correct
3. Check server logs for errors
4. Test with curl command above

### Data Not Persisting
1. Ensure write permissions in production
2. Consider using a database instead of file storage
3. Check for environment-specific issues

### Performance Issues
1. Implement database storage for large datasets
2. Add data pagination
3. Consider caching strategies
