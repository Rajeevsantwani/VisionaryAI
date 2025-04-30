import { useState } from 'react'
import './App.css'

function App() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [generatedImage, setGeneratedImage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image')
      }
      
      setGeneratedImage(data.imageUrl)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            VisionaryAI
          </h1>
          <p className="text-xl text-gray-300">
            Transform your imagination into reality with AI-powered image generation
          </p>
        </header>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex flex-col gap-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate..."
                className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none text-white placeholder-gray-400 min-h-[120px]"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${
                  loading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                }`}
              >
                {loading ? 'Generating...' : 'Generate Image'}
              </button>
            </div>
          </form>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-8">
              {error}
            </div>
          )}

          {generatedImage && (
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Generated Image</h2>
              <img
                src={generatedImage}
                alt="Generated"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
