/**
 * Minimal Live client interface used by the app to interact with either
 * the real GenAI Live client or the development mock client.
 */
import { LiveConnectConfig, LiveServerToolCall, GenerateContentResponse, GroundingChunk } from '@google/genai';

export interface LiveClient {
  on(event: string, handler: (...args: any[]) => void): void;
  off(event: string, handler: (...args: any[]) => void): void;
  // Some implementations return a boolean or void; accept any Promise return
  // to remain compatible with both real and mock clients.
  connect(config: LiveConnectConfig): Promise<any>;
  disconnect(): void;
  sendRealtimeText(text: string): void;
  // Some implementations expose a streaming input helper used by UI controls.
  sendRealtimeInput?(chunks: any[]): void;
  sendToolResponse(response: { functionResponses: any[] }): void;
  // Allow additional ad-hoc properties/methods to support bridge APIs in the codebase.
  [key: string]: any;
  // It's OK to add additional helpers here if the hook needs them later.
}

export type { LiveConnectConfig, LiveServerToolCall, GenerateContentResponse, GroundingChunk };
