export function Contributors() {
  return (
    <div>
      <section className="hero-gradient text-white py-20">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contributors</h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            The people behind Northern Variables
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 mb-8">
              Northern Variables is built by a community of researchers, data scientists, developers, and political enthusiasts who believe in the power of data to inform democratic participation.
            </p>

            <div className="bg-gray-50 rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Want to Contribute?</h2>
              <p className="text-gray-700 mb-6">
                We welcome contributions from individuals with expertise in:
              </p>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li>• Political science and policy analysis</li>
                <li>• Data science and statistical analysis</li>
                <li>• Web development and visualization</li>
                <li>• Research and fact-checking</li>
                <li>• Content writing and editing</li>
              </ul>
              <p className="text-gray-700">
                All our projects are open-source and available on{' '}
                <a
                  href="https://github.com/northernvariables"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  GitHub
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
