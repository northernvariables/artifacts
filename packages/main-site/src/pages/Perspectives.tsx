export function Perspectives() {
  return (
    <div>
      <section className="hero-gradient-alt text-white py-20">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Perspectives</h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            Data-driven analysis and commentary on Canadian politics
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
              <p className="text-lg text-gray-700">
                <strong>Coming Soon:</strong> In-depth perspectives and analysis on Canadian politics will be published here. Subscribe to our{' '}
                <a
                  href="https://substack.northernvariables.ca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Substack newsletter
                </a>
                {' '}to stay updated.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
