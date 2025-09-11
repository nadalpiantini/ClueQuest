'use client'

export default function TestBuilderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-amber-300 mb-4">Test Builder Page</h1>
        <p className="text-slate-400 text-lg">This is a simple test page to verify rendering</p>
        <div className="mt-8 p-6 bg-slate-800/50 rounded-lg">
          <h2 className="text-2xl font-semibold text-purple-200 mb-4">Carrusel Test</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-amber-500/20 rounded-lg border border-amber-500/30">
              <h3 className="text-amber-300 font-bold">Detective</h3>
              <p className="text-slate-400 text-sm">Mystery theme</p>
            </div>
            <div className="p-4 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
              <h3 className="text-emerald-300 font-bold">Fantasy</h3>
              <p className="text-slate-400 text-sm">Magic theme</p>
            </div>
            <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
              <h3 className="text-blue-300 font-bold">Cyber</h3>
              <p className="text-slate-400 text-sm">Tech theme</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
