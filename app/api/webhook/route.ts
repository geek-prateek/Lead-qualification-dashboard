import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// In-memory storage for webhook data (in production, use a database)
let webhookData: any[] = [];

// File path for persistent storage
const dataFilePath = path.join(process.cwd(), 'data', 'webhook-data.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.dirname(dataFilePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Load existing data
const loadData = () => {
  try {
    ensureDataDir();
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      webhookData = JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading webhook data:', error);
    webhookData = [];
  }
};

// Save data to file
const saveData = () => {
  try {
    ensureDataDir();
    fs.writeFileSync(dataFilePath, JSON.stringify(webhookData, null, 2));
  } catch (error) {
    console.error('Error saving webhook data:', error);
  }
};

// Load data on startup
loadData();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log the incoming webhook data
    console.log('Received Bolna webhook:', JSON.stringify(body, null, 2));
    
    // Add timestamp and ID to the webhook data
    const webhookEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...body
    };
    
    // Add to in-memory storage
    webhookData.unshift(webhookEntry); // Add to beginning for newest first
    
    // Keep only last 1000 entries to prevent memory issues
    if (webhookData.length > 1000) {
      webhookData = webhookData.slice(0, 1000);
    }
    
    // Save to file
    saveData();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook data received successfully',
      id: webhookEntry.id 
    });
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process webhook data' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: webhookData,
      count: webhookData.length
    });
  } catch (error) {
    console.error('Error fetching webhook data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch webhook data' },
      { status: 500 }
    );
  }
}
