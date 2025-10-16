# Bolna AI Dashboard

A Next.js dashboard application that receives and displays webhook data from Bolna AI in real-time.

## Features

- **Real-time Webhook Data Reception**: Automatically receives POST requests from Bolna AI
- **Interactive Dashboard**: Beautiful, responsive dashboard with dark/light mode support
- **Data Visualization**: Statistics, charts, and detailed views of call data
- **Data Management**: Export, search, and manage webhook data
- **Real-time Updates**: Auto-refreshing data with configurable intervals
- **Admin Panel**: Complete data management and system monitoring

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 3. Configure Bolna AI Webhook

1. Copy your webhook URL: `http://your-domain.com/api/webhook`
2. In your Bolna AI agent settings, add this URL to the `webhook_url` field
3. Save your configuration
4. Bolna AI will automatically send call data to your dashboard

## Project Structure

```
bolna-dashboard/
├── app/                    # Next.js App Router
│   ├── api/webhook/       # Webhook endpoint
│   ├── admin/             # Admin panel page
│   ├── webhook-data/      # Data viewing page
│   └── page.tsx           # Main dashboard
├── components/            # React components
│   ├── dashboard/         # Dashboard-specific components
│   ├── ui/               # Reusable UI components
│   └── Layout.tsx        # Main layout component
├── lib/                  # Utility functions
└── data/                 # Webhook data storage (auto-created)
```

## Webhook Endpoint

### URL
`POST /api/webhook`

### Expected Payload Format
```json
{
  "call_id": "call_123456789",
  "status": "completed",
  "duration": 120,
  "caller_number": "+1234567890",
  "agent_name": "AI Agent",
  "extracted_data": {
    "customer_name": "John Doe",
    "email": "john@example.com",
    "intent": "support_request"
  },
  "context_details": {
    "language": "en",
    "confidence": 0.95
  },
  "conversation_transcript": "Customer: Hello, I need help with my order..."
}
```

### Response
```json
{
  "success": true,
  "message": "Webhook data received successfully",
  "id": "1703123456789"
}
```

## Pages

### Dashboard (`/`)
- Overview statistics
- Recent activity feed
- Webhook configuration guide
- Real-time data updates

### Webhook Data (`/webhook-data`)
- Complete table view of all webhook data
- Search and filter functionality
- Detailed data inspection
- Export capabilities

### Admin Panel (`/admin`)
- Data statistics and storage information
- Data management tools
- Export and clear data functions
- System information

## Data Storage

The application uses file-based storage for simplicity:
- Data is stored in `data/webhook-data.json`
- Automatic data persistence
- In-memory caching for performance
- Automatic cleanup (keeps last 1000 records)

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically
4. Your webhook URL will be: `https://your-app.vercel.app/api/webhook`

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify
- Google Cloud Run

## Environment Variables

No environment variables are required for basic functionality. The application works out of the box.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Key Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible UI components
- **Lucide React** - Icons
- **date-fns** - Date formatting

## API Endpoints

### GET `/api/webhook`
Retrieve all webhook data
```json
{
  "success": true,
  "data": [...],
  "count": 150
}
```

### POST `/api/webhook`
Receive new webhook data from Bolna AI

## Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `app/globals.css` for global styles
- Customize components in `components/` directory

### Data Storage
- Replace file-based storage with a database by modifying `app/api/webhook/route.ts`
- Supported databases: PostgreSQL, MongoDB, SQLite, etc.

### Webhook Processing
- Add custom data processing in the webhook endpoint
- Implement data validation
- Add authentication/authorization

## Troubleshooting

### Webhook Not Receiving Data
1. Verify your webhook URL is correct
2. Check that your server is accessible from the internet
3. Ensure the endpoint accepts POST requests
4. Check server logs for errors

### Data Not Persisting
1. Verify write permissions in the project directory
2. Check that the `data/` directory exists
3. Review server logs for file system errors

### Performance Issues
1. Consider implementing database storage for large datasets
2. Add data pagination for large datasets
3. Implement data archiving for old records

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the code documentation
3. Check server logs for error messages
4. Verify Bolna AI webhook configuration

## License

MIT License - feel free to use this project for your own applications.
