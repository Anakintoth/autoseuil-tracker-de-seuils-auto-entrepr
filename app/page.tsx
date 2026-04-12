export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">autoseuil-tracker-de-seuils-auto-entrepr</h1>
        <p className="text-xl text-gray-400 mb-8">AutoSeuil — Tracker de Seuils Auto-Entrepreneur</p>
        <a href="#pricing" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-lg font-semibold">Commencer - 4.99 EUR/month</a>
      </section>
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Fonctionnalites</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div key="0" className="bg-gray-900 p-6 rounded-lg"><p className="text-lg">AI-powered generation</p></div>
          <div key="1" className="bg-gray-900 p-6 rounded-lg"><p className="text-lg">Simple UI</p></div>
          <div key="2" className="bg-gray-900 p-6 rounded-lg"><p className="text-lg">Fast results</p></div>
        </div>
      </section>
    </main>
  );
}
