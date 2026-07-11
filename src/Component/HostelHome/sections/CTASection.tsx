
const CTASection= ({HandleClick}:{HandleClick:()=>void| Promise<void>}) => (
  <section className="bg-indigo-600 text-white py-16">
    <div className="max-w-3xl mx-auto px-6 text-center">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
        Ready to check in?
      </h2>
      <p className="text-indigo-200 mb-8 text-lg">
        Beds fill up fast. Reserve yours today and get 10% off your first stay.
      </p>
      <button onClick={HandleClick} className="bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-bold px-10 py-4 rounded-full text-base transition-all duration-200 shadow-lg hover:-translate-y-0.5">
        Reserve My Spot →
      </button>
    </div>
  </section>
);

export default CTASection;
