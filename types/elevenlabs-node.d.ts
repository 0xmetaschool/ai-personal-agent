// types/elevenlabs-node.d.ts

declare module 'elevenlabs-node' {
    interface GenerateOptions {
      apiKey: string;
      text: string;
      voice: string;
      model?: string;
    }
  
    export function generate(options: GenerateOptions): Promise<Buffer>;
    
    export function setApiKey(apiKey: string): void;
    
    export function voices(): Promise<any[]>;
  }