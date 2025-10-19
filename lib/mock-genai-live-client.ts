/**
 * Mock implementation of the Gemini Live API client for development/testing
 * without requiring actual API keys.
 */
import EventEmitter from 'eventemitter3';
import { LiveConnectConfig } from '@google/genai';
import { sleep } from './utils';

export class MockGenAILiveClient extends EventEmitter {
  private config: LiveConnectConfig | null = null;
  private isConnected = false;
  readonly model: string;

  constructor(apiKey: string, model: string) {
    super();
    this.model = model;
    // API key not used in mock, but kept for interface compatibility
  }

  async connect(config: LiveConnectConfig): Promise<boolean> {
    this.config = config;
    await sleep(500); // Simulate connection delay
    this.isConnected = true;
    this.emit('open');
    this.emit('setupcomplete');
    return true;
  }

  disconnect(): boolean {
    this.isConnected = false;
    this.emit('close', { reason: 'User disconnected' });
    return true;
  }

  async sendRealtimeText(text: string) {
    if (!this.isConnected) return;

    // Simulate input transcription
    this.emit('inputTranscription', text, false);
    await sleep(300);
    this.emit('inputTranscription', text, true);

    // Simulate thinking/processing
    await sleep(800);

    // Mock response based on input
    const responses = {
      hello: "Hi! I'm a mock assistant. I can help you with maps, locations, and planning. Feel free to ask about places, directions, or local recommendations!",
      location: "I can help you explore that location. Let me pull up some information from Google Maps for you. What specifically would you like to know about?",
      restaurant: "I can help you find great restaurants in that area. I'll check the reviews and ratings to give you the best recommendations.",
      directions: "I can help you with directions. Let me check the best route based on current conditions.",
      weather: "While I'm in mock mode, I can tell you it's a beautiful day! In normal mode, I could provide real weather information.",
      default: "I understand you're asking about that. Let me check the maps and information available to help you out. What specific details would you like to know?"
    };

    // Check input against keywords and get appropriate response
    const lowerText = text.toLowerCase();
    let response = responses.default;
    for (const [key, value] of Object.entries(responses)) {
      if (lowerText.includes(key)) {
        response = value;
        break;
      }
    }

    // Simulate streaming response with transcription and content
    let streamedText = '';
    for (const char of response.split('')) {
      streamedText += char;
      this.emit('outputTranscription', streamedText, false);
      this.emit('content', {
        modelTurn: {
          parts: [{ text: streamedText }]
        }
      });
      await sleep(50);
    }

    // Mark response as final
    this.emit('outputTranscription', response, true);
    this.emit('turncomplete');
    this.emit('generationcomplete');

    // Simulate map interactions based on input content
    const locationKeywords = ['where', 'location', 'place', 'city', 'restaurant', 'directions'];
    const hasLocationRequest = locationKeywords.some(keyword => text.toLowerCase().includes(keyword));
    
    if (hasLocationRequest) {
      // Extract potential location from text or use default
      const locationMatch = text.match(/(?:in|at|to|from)\s+([A-Za-z\s,]+)(?:\s|$)/);
      const location = locationMatch ? locationMatch[1].trim() : 'Chicago';
      
      this.emit('toolcall', {
        functionCalls: [{
          id: '1',
          name: 'lookAtLocation',
          args: {
            location: location,
            zoomLevel: text.toLowerCase().includes('restaurant') ? 15 : 12
          }
        }]
      });

      // If it's a restaurant query, simulate adding a grounding chunk
      if (text.toLowerCase().includes('restaurant')) {
        this.emit('content', {
          modelTurn: {
            parts: [{ text: response }]
          },
          groundingMetadata: {
            groundingChunks: [{
              maps: {
                uri: `https://maps.google.com/maps?q=restaurants+in+${encodeURIComponent(location)}`,
                title: `Top Restaurants in ${location}`,
                placeAnswerSources: {
                  reviewSnippets: [
                    {
                      googleMapsUri: `https://maps.google.com/maps?q=sample-restaurant-1`,
                      title: "Great food and atmosphere!"
                    },
                    {
                      googleMapsUri: `https://maps.google.com/maps?q=sample-restaurant-2`,
                      title: "Excellent service, highly recommended"
                    }
                  ]
                }
              }
            }]
          }
        });
      }
    }
  }

  sendToolResponse(response: any) {
    // Mock handling tool response - could add more complex simulation here
    console.log('Mock received tool response:', response);
  }

  // Helper method to check connection status
  isConnectedStatus() {
    return this.isConnected;
  }
}

// Re-export the mock as if it were the real client
export { MockGenAILiveClient as GenAILiveClient };