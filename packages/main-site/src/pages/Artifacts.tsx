export function Artifacts() {
  const artifacts = [
    {
      title: 'Vote Spectrum',
      description: 'Discover where you stand on the Canadian political spectrum with our comprehensive voting advice application.',
      url: '/artifacts/vote-spectrum',
      icon: '🗳️',
      tags: ['Survey', 'Federal', 'Provincial']
    },
    {
      title: 'Canada Federal Election Tracker',
      description: 'Track polling, seat projections, and key metrics for Canada\'s 45th federal election.',
      url: '/artifacts/canada-federal-election-45-tracker.html',
      icon: '📊',
      tags: ['Election', 'Federal', 'Live Data']
    },
    {
      title: 'Canadian Politics Survey',
      description: 'A comprehensive survey exploring Canadian political attitudes and preferences.',
      url: '/artifacts/canadian-politics-survey.html',
      icon: '📋',
      tags: ['Survey', 'Research']
    },
    {
      title: 'Finkelstein Playbook',
      description: 'Interactive exploration of political campaign strategies and tactics.',
      url: '/artifacts/finkelstein-playbook.html',
      icon: '📖',
      tags: ['Strategy', 'Education']
    }
  ]

  return (
    <div>
      <section className="hero-gradient-alt text-white py-20">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Artifacts</h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            Interactive tools and visualizations for exploring Canadian politics
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8">
            {artifacts.map((artifact) => (
              <a
                key={artifact.title}
                href={artifact.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-blue-500"
              >
                <div className="text-5xl mb-4">{artifact.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {artifact.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {artifact.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {artifact.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              All artifacts are open-source and available on GitHub
            </p>
            <a
              href="https://github.com/northernvariables/artifacts"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors min-touch"
            >
              View Source Code
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
