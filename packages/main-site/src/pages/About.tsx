export function About() {
  return (
    <div>
      <section className="hero-gradient text-white py-20">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About</h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            Understanding Canadian politics through data and analysis
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2>Our Mission</h2>
            <p>
              Northern Variables is dedicated to providing data-driven insights into Canadian politics. We believe that informed citizens make better decisions, and that understanding the nuances of policy and political positioning is essential for democratic participation.
            </p>

            <h2>What We Do</h2>
            <p>
              We create interactive tools, analyze political data, and publish perspectives that help Canadians understand their political landscape. Our artifacts range from voting advice applications to election trackers and policy analysis tools.
            </p>

            <h2>Our Approach</h2>
            <p>
              We prioritize accuracy, transparency, and accessibility. All our tools are open-source, our methodologies are documented, and our analysis is grounded in rigorous research and data.
            </p>

            <h2>Get Involved</h2>
            <p>
              Northern Variables is a community-driven project. Whether you're a data scientist, political researcher, or engaged citizen, there are opportunities to contribute. Visit our{' '}
              <a href="/contributors">Contributors page</a> to learn more.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
