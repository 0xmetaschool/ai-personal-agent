export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32">
        <div className="text-center">
          <div className="mb-8 animate-bounce">
            <svg
              viewBox="0 0 24 24"
              className="inline-block w-20 h-20 text-blue-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a9 9 0 0 1 9 9v4a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6v-4a9 9 0 0 1 9-9z" />
              <path d="M12 7v5l4 2" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Intelligent Personal Agent
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the next generation of AI Agent with real-time weather updates,
            web search capabilities, and natural conversations.
          </p>
          <a
            href="/chat"
            className="inline-flex bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-colors duration-300 items-center gap-2"
          >
            Get Started
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Weather Feature */}
            <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="mb-4">
                <svg
                  className="w-12 h-12 text-blue-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Live Weather Updates</h3>
              <p className="text-gray-600">
                Get real-time weather information and forecasts for any location instantly.
              </p>
            </div>

            {/* Search Feature */}
            <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="mb-4">
                <svg
                  className="w-12 h-12 text-blue-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Web Search</h3>
              <p className="text-gray-600">
                Access information from across the web with intelligent search capabilities.
              </p>
            </div>

            {/* Chat Feature */}
            <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="mb-4">
                <svg
                  className="w-12 h-12 text-blue-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Natural Conversation</h3>
              <p className="text-gray-600">
                Engage in natural, human-like conversations with advanced language understanding.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Get Started",
                description: "Enter into the chatting area",
                icon: (
                  <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                )
              },
              {
                step: "2",
                title: "Enter Text",
                description: "Provide your input",
                icon: (
                  <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20v-6M6 20V10M18 20V4" />
                  </svg>
                )
              },
              {
                step: "3",
                title: "Voice Feature",
                description: "ElevenLabs live agent",
                icon: (
                  <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                )
              },
              {
                step: "4",
                title: "Personalized Responses",
                description: "Start using AI agent for your daily planning",
                icon: (
                  <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                )
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <div className="bg-white rounded-xl p-6">
                  <div className="text-blue-500 font-bold mb-2">Step {item.step}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

         {/* Try an Interactive Demo Section */}
         <section className="bg-gray-50 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Try an Interactive Demo</h2>
          <p className="text-gray-600 mb-8">Experience the power of MockInterviewerGPT with our interactive demo.</p>
          <div className="w-full max-w-4xl mx-auto">
            <iframe
              src="https://app.arcade.software/share/u4WqyrapuH9jJdEehZpg"
              title="Interactive Demo"
              width="100%"
              height="600"
              style={{ border: 'none', borderRadius: '10px' }}
            ></iframe>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Business Owner",
                quote: "This AI agent has transformed how I manage my daily tasks. It's like having a personal secretary available 24/7."
              },
              {
                name: "Michael Chen",
                role: "Student",
                quote: "The weather updates and search capabilities are incredibly accurate. It helps me plan my day efficiently."
              },
              {
                name: "Emily Williams",
                role: "Professional",
                quote: "The natural conversation feature is amazing. It understands context and provides relevant information instantly."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full mr-4"></div>
                  <div>
                    <h4 className="text-gray-900 font-bold">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">&ldquo;{testimonial.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users and experience the future of AI Agent today
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/chat"
              className="bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-600 transition-colors duration-300"
            >
              Get Started Now
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="border-t border-gray-800 pt-8 text-gray-400 text-center">
            <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}