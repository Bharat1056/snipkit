
const Stats = () => {
  return (
    <section className="py-20 sm:py-32 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">


        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-green-500/10 border border-green-500/20">
            <span className="text-2xl">🎉</span>
            <span className="text-green-400 font-bold text-lg">
              Join the revolution - coding tools should be FREE!
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Stats
