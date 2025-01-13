// app/api/personal-assistant.ts
import OpenAI from 'openai';
import { encode as encodeQuery } from 'querystring';

interface AssistantConfig {
  openaiKey: string;
  weatherApiKey: string;
  serpApiKey: string;
}

interface WeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
  sys: {
    country: string;
  };
}

interface KnowledgeGraphResult {
  title: string;
  description: string;
}

interface OrganicResult {
  title: string;
  snippet: string;
  link: string;
}

interface SearchResult {
  title: string;
  snippet: string;
  type: string;
  link?: string;
}

interface SerpApiResponse {
  knowledge_graph?: KnowledgeGraphResult;
  organic_results?: OrganicResult[];
}

export class PersonalAssistant {
  private openai: OpenAI;
  private weatherApiKey: string;
  private serpApiKey: string;

  constructor(config: AssistantConfig) {
    this.openai = new OpenAI({ apiKey: config.openaiKey });
    this.weatherApiKey = config.weatherApiKey;
    this.serpApiKey = config.serpApiKey;
  }

  async getWeather(city: string) {
    try {
      const cleanCity = city.toLowerCase().replace(' city', '').replace(' in ', ' ').trim();
      const encodedCity = encodeURIComponent(cleanCity);
      const url = `http://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${this.weatherApiKey}&units=metric`;
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json() as WeatherResponse;
        return {
          temperature: data.main.temp,
          description: data.weather[0].description,
          humidity: data.main.humidity,
          feels_like: data.main.feels_like,
          wind_speed: data.wind.speed,
          city: data.name,
          country: data.sys.country,
          timestamp: new Date().toISOString()
        };
      }
      console.error('Weather API error:', await response.text());
      return null;
    } catch (error) {
      console.error('Error in getWeather:', error);
      return null;
    }
  }

  async searchWeb(query: string): Promise<SearchResult[]> {
    try {
      const cleanedQuery = query.trim();
      const encodedQuery = encodeURIComponent(cleanedQuery);
      const url = `https://serpapi.com/search.json?q=${encodedQuery}&api_key=${this.serpApiKey}&num=5&gl=us&hl=en`;
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json() as SerpApiResponse;
        const results: SearchResult[] = [];
        
        if (data.knowledge_graph?.description) {
          results.push({
            title: data.knowledge_graph.title || 'Quick Answer',
            snippet: data.knowledge_graph.description,
            type: 'knowledge_graph'
          });
        }

        if (data.organic_results) {
          results.push(...data.organic_results.slice(0, 4).map((result) => ({
            title: result.title || '',
            snippet: result.snippet || '',
            link: result.link || '',
            type: 'organic'
          })));
        }

        return results;
      }
      return [];
    } catch (error) {
      console.error('Error in search:', error);
      return [];
    }
  }

  extractCity(text: string): string | null {
    const weatherPhrases = [
      "weather of", "weather in", "weather for", "weather at",
      "temperature in", "temperature for", "temperature at",
      "forecast for", "forecast in",
      "weather update for", "weather update in",
      "what's the weather in", "what's the weather like in",
      "how's the weather in"
    ];
    
    text = text.toLowerCase();
    
    for (const phrase of weatherPhrases) {
      if (text.includes(phrase)) {
        const startIdx = text.indexOf(phrase) + phrase.length;
        const remaining = text.slice(startIdx).trim();
        const city = remaining.split(',')[0].split('?')[0].split(' in ')[0].trim();
        return city.charAt(0).toUpperCase() + city.slice(1);
      }
    }
    
    const words = text.split(' ');
    const markers = ["in", "for", "at", "of"];
    for (let i = 0; i < words.length; i++) {
      if (markers.includes(words[i]) && i + 1 < words.length) {
        const nextWord = words[i + 1];
        if (!["the", "a", "an", "pakistan", "india"].includes(nextWord)) {
          return nextWord.charAt(0).toUpperCase() + nextWord.slice(1);
        }
      }
    }
    
    return null;
  }

  shouldSearch(text: string, responseContent: string): boolean {
    const uncertaintyPhrases = [
      "i don't have",
      "i don't know",
      "i am not sure",
      "i cannot",
      "i can't",
      "unable to",
      "don't have access",
      "no access to",
      "not available",
      "cannot provide",
      "latest information",
      "current information",
      "real-time information",
      "up-to-date"
    ];
    
    const responseLower = responseContent.toLowerCase();
    return uncertaintyPhrases.some(phrase => responseLower.includes(phrase));
  }

  async getResponse(userInput: string) {
    try {
      // Handle weather requests
      if (/weather|temperature|forecast/i.test(userInput)) {
        const city = this.extractCity(userInput);
        if (city) {
          const weatherData = await this.getWeather(city);
          if (weatherData) {
            return `Based on real-time data as of ${weatherData.timestamp}, 
            the current weather in ${weatherData.city}, ${weatherData.country} is:
            - Temperature: ${weatherData.temperature}°C (feels like ${weatherData.feels_like}°C)
            - Conditions: ${weatherData.description}
            - Humidity: ${weatherData.humidity}%
            - Wind Speed: ${weatherData.wind_speed} m/s`;
          }
        }
      }

      // Get initial AI response
      const initialResponse = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a helpful personal assistant with access to real-time data and search capabilities. 
            If you're unsure about something or need current information, say so directly and I will search for it.
            Keep responses concise and informative.`
          },
          { role: "user", content: userInput }
        ],
        temperature: 0.7,
        max_tokens: 150
      });

      const initialContent = initialResponse.choices[0].message.content || '';

      // Check if we should search for more information
      if (this.shouldSearch(userInput, initialContent)) {
        const searchResults = await this.searchWeb(userInput);
        
        if (searchResults.length > 0) {
          // Prepare search context
          const searchContext = `Based on current search results:\n\n${
            searchResults.map(result => 
              result.type === 'knowledge_graph' 
                ? `Quick Answer: ${result.snippet}\n\n`
                : `• ${result.snippet}\n`
            ).join('')
          }`;
          
          // Get final response with search results
          const finalResponse = await this.openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: `You are a helpful personal assistant with access to real-time data and search capabilities.`
              },
              { role: "system", content: searchContext },
              { role: "user", content: userInput }
            ]
          });
          
          return finalResponse.choices[0].message.content || initialContent;
        }
      }
      
      return initialContent;
    } catch (error) {
      console.error('Error in getResponse:', error);
      return `I apologize, but I encountered an error: ${error}`;
    }
  }
}