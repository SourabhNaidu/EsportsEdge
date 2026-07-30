import { useQuery } from '@tanstack/react-query'
import {
  Activity,
  BarChart3,
  Database,
  RadioTower,
  ShieldCheck,
  Swords,
  Trophy,
} from 'lucide-react'
import { getApiHealth } from './api/health'

function App() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['api-health'],
    queryFn: getApiHealth,
    refetchInterval: 15000,
  })

  const apiStatus = isLoading ? 'Checking' : isError ? 'Offline' : 'Online'
  const dbStatus = data?.database?.connected ? 'Connected' : 'Waiting'

  return (
    <main className="min-h-screen overflow-hidden bg-[#07080b] text-stone-100">
      <section className="relative min-h-screen">
        <img
          src="/images/valorant-analytics-hero.png"
          alt="Tactical esports analytics arena"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,8,11,0.98)_0%,rgba(7,8,11,0.86)_36%,rgba(7,8,11,0.36)_72%,rgba(7,8,11,0.78)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,70,85,0.24),transparent_28%),radial-gradient(circle_at_72%_42%,rgba(69,211,220,0.14),transparent_24%)]" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">
          <nav className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded border border-[#ff4655]/50 bg-[#ff4655]/15">
                <Swords className="h-5 w-5 text-[#ff4655]" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
                  EsportsEdge
                </p>
                <p className="text-xs text-stone-400">Valorant prediction lab</p>
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-stone-300 sm:flex">
              <span
                className={`h-2 w-2 rounded-full ${
                  apiStatus === 'Online' ? 'bg-emerald-400' : 'bg-[#ff4655]'
                }`}
              />
              API {apiStatus}
            </div>
          </nav>

          <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.02fr_0.98fr]">
            <section className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 border border-[#ff4655]/40 bg-[#ff4655]/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#ff9aa3]">
                <Activity className="h-4 w-4" />
                Phase 1 backbone online
              </div>

              <h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.95] text-white sm:text-6xl lg:text-7xl">
                Predict matches with edge, not guesswork.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
                A Valorant-first MERN platform foundation with a live API health
                check, MongoDB readiness, and the first visual direction for
                analytics-driven predictions.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#system-status"
                  className="inline-flex items-center justify-center gap-2 bg-[#ff4655] px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#ff6b76]"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Check System
                </a>
                <a
                  href="http://localhost:5000/api/health"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white/[0.08]"
                >
                  <RadioTower className="h-4 w-4" />
                  API Health
                </a>
              </div>
            </section>

            <section
              id="system-status"
              className="border border-white/10 bg-[#0d1016]/88 p-5 shadow-2xl shadow-black/40 backdrop-blur"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#45d3dc]">
                    System Pulse
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-white">
                    Phase 1 Integration
                  </h2>
                </div>
                <BarChart3 className="h-7 w-7 text-[#ff4655]" />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <StatusTile
                  icon={<RadioTower className="h-5 w-5" />}
                  label="Backend API"
                  value={apiStatus}
                  tone={apiStatus === 'Online' ? 'good' : 'warn'}
                />
                <StatusTile
                  icon={<Database className="h-5 w-5" />}
                  label="MongoDB"
                  value={dbStatus}
                  tone={data?.database?.connected ? 'good' : 'warn'}
                />
                <StatusTile
                  icon={<Trophy className="h-5 w-5" />}
                  label="Next Flow"
                  value="Auth"
                  tone="neutral"
                />
                <StatusTile
                  icon={<Swords className="h-5 w-5" />}
                  label="Game Focus"
                  value="Valorant"
                  tone="neutral"
                />
              </div>

              <div className="mt-5 border border-white/10 bg-black/30 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                  API Response
                </p>
                <pre className="mt-3 overflow-x-auto text-xs leading-6 text-stone-300">
                  {isLoading
                    ? 'Waiting for backend response...'
                    : isError
                      ? 'Unable to reach http://localhost:5000/api/health'
                      : JSON.stringify(data, null, 2)}
                </pre>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}

function StatusTile({ icon, label, value, tone }) {
  const toneClass = {
    good: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
    warn: 'border-[#ff4655]/35 bg-[#ff4655]/10 text-[#ffb0b7]',
    neutral: 'border-white/10 bg-white/[0.04] text-stone-200',
  }[tone]

  return (
    <div className={`border p-4 ${toneClass}`}>
      <div className="flex items-center gap-2 text-stone-400">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-[0.18em]">
          {label}
        </span>
      </div>
      <p className="mt-4 text-2xl font-black uppercase text-white">{value}</p>
    </div>
  )
}

export default App
