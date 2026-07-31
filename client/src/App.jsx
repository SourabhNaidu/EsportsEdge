import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Activity,
  BarChart3,
  Crown,
  Flame,
  Lock,
  LogIn,
  LogOut,
  RadioTower,
  Shield,
  ShieldCheck,
  Sparkles,
  Swords,
  Target,
  Trophy,
  UserPlus,
  Zap,
} from 'lucide-react'
import { getProfile, loginUser, registerUser } from './api/auth'
import { getApiHealth } from './api/health'
import AdminPanel from './components/AdminPanel'

const TOKEN_KEY = 'esportsedge_token'

const featuredMatches = [
  {
    id: 1,
    tournament: 'Valorant Champions Tour',
    stage: 'Upper Semifinal',
    time: 'Today, 8:30 PM',
    teamA: 'Paper Rex',
    tagA: 'PRX',
    teamB: 'Fnatic',
    tagB: 'FNC',
    winA: 54,
    winB: 46,
    insight: 'PRX lead on early-round conversion, but Fnatic hold the stronger map veto.',
    alert: 'Upset watch',
  },
  {
    id: 2,
    tournament: 'Challengers League',
    stage: 'Group A',
    time: 'Tomorrow, 6:00 PM',
    teamA: 'Sentinels',
    tagA: 'SEN',
    teamB: 'Gen.G',
    tagB: 'GEN',
    winA: 49,
    winB: 51,
    insight: 'Gen.G edge ahead through defensive pistol rate and recent Haven form.',
    alert: 'Tight line',
  },
]

const leaderboard = [
  ['vandalVision', '1,240', '68%'],
  ['clutchIndex', '1,090', '64%'],
  ['ecoHunter', '980', '61%'],
  ['spikeRead', '925', '59%'],
]

const insights = [
  {
    label: 'Momentum Score',
    value: '82',
    detail: 'PRX won 7 of their last 10 maps and start faster on attack halves.',
    icon: Flame,
  },
  {
    label: 'Map Advantage',
    value: '+12%',
    detail: 'Fnatic are stronger on Bind, but PRX gain value if Split appears.',
    icon: Target,
  },
  {
    label: 'Upset Alert',
    value: 'Medium',
    detail: 'Prediction crowd is leaning favorite, while form signals stay close.',
    icon: Zap,
  },
]

function App() {
  const queryClient = useQueryClient()
  const [view, setView] = useState('home')
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))

  const healthQuery = useQuery({
    queryKey: ['api-health'],
    queryFn: getApiHealth,
    refetchInterval: 15000,
  })

  const profileQuery = useQuery({
    queryKey: ['profile', token],
    queryFn: () => getProfile(token),
    enabled: Boolean(token),
    retry: false,
  })

  const user = profileQuery.data?.user
  const isAdmin = user?.role === 'admin'
  const apiOnline = !healthQuery.isError && !healthQuery.isLoading
  const heroPanel = view === 'admin'
    ? <AdminPanel token={token} isAdmin={isAdmin} />
    : view === 'login'
      ? <AuthPanel mode="login" onSuccess={handleAuthSuccess} />
      : view === 'register'
        ? <AuthPanel mode="register" onSuccess={handleAuthSuccess} />
        : view === 'profile'
          ? (
            <ProfilePanel
              token={token}
              user={user}
              isLoading={profileQuery.isLoading}
              error={profileQuery.error}
              onLogin={() => setView('login')}
            />
          )
          : <PredictionCard apiOnline={apiOnline} />

  function handleAuthSuccess(result) {
    localStorage.setItem(TOKEN_KEY, result.token)
    setToken(result.token)
    setView(result.user.role === 'admin' ? 'admin' : 'profile')
    queryClient.setQueryData(['profile', result.token], { user: result.user })
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setView('home')
    queryClient.removeQueries({ queryKey: ['profile'] })
  }

  return (
    <main className="min-h-screen bg-[#07080b] text-stone-100">
      <section className="relative overflow-hidden border-b border-white/10">
        <img
          src="/images/valorant-analytics-hero.png"
          alt="Tactical esports analytics arena"
          className="absolute inset-0 h-full w-full object-cover opacity-48"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#07080b_0%,rgba(7,8,11,0.94)_34%,rgba(7,8,11,0.68)_68%,#07080b_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(255,70,85,0.22),transparent_30%),radial-gradient(circle_at_78%_44%,rgba(69,211,220,0.12),transparent_28%)]" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">
          <Nav
            view={view}
            token={token}
            isAdmin={isAdmin}
            apiOnline={apiOnline}
            setView={setView}
            logout={logout}
          />

          <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[0.96fr_1.04fr]">
            <section>
              <div className="mb-6 inline-flex items-center gap-2 border border-[#ff4655]/40 bg-[#ff4655]/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#ff9aa3]">
                <Sparkles className="h-4 w-4" />
                Valorant prediction intelligence
              </div>

              <h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.94] text-white sm:text-6xl lg:text-7xl">
                Read the match before the odds move.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
                EsportsEdge turns upcoming Valorant fixtures into clean win
                picks, form signals, map reads, and leaderboard competition for
                fans who want more than a coin flip.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setView(token ? 'profile' : 'register')}
                  className="inline-flex items-center justify-center gap-2 bg-[#ff4655] px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#ff6b76]"
                >
                  <Target className="h-4 w-4" />
                  Make A Pick
                </button>
                <button
                  type="button"
                  onClick={() => setView(isAdmin ? 'admin' : token ? 'profile' : 'login')}
                  className="inline-flex items-center justify-center gap-2 border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white/[0.08]"
                >
                  {isAdmin ? <Crown className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                  {isAdmin ? 'Admin Desk' : token ? 'Player Card' : 'Sign In'}
                </button>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <Metric label="Prediction pool" value="18.4K" />
                <Metric label="Avg accuracy" value="63%" />
                <Metric label="Live matches" value="12" />
              </div>
            </section>

            {heroPanel}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-12 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-10">
        <MatchBoard />
        <Leaderboard />
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-14 sm:px-8 lg:px-10">
        <div className="grid gap-4 lg:grid-cols-3">
          {insights.map((item) => (
            <InsightCard key={item.label} {...item} />
          ))}
        </div>
      </section>
    </main>
  )
}

function Nav({ view, token, isAdmin, apiOnline, setView, logout }) {
  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
      <button type="button" onClick={() => setView('home')} className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded border border-[#ff4655]/50 bg-[#ff4655]/15">
          <Swords className="h-5 w-5 text-[#ff4655]" />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
            EsportsEdge
          </p>
          <p className="text-xs text-stone-400">Valorant prediction lab</p>
        </div>
      </button>

      <div className="flex flex-wrap items-center gap-2">
        <StatusDot apiOnline={apiOnline} />
        <NavButton active={view === 'home'} onClick={() => setView('home')}>
          Matches
        </NavButton>
        {token ? (
          <>
            <NavButton active={view === 'profile'} onClick={() => setView('profile')}>
              Profile
            </NavButton>
            {isAdmin && (
              <NavButton active={view === 'admin'} onClick={() => setView('admin')}>
                Admin
              </NavButton>
            )}
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-stone-200 transition hover:bg-white/[0.08]"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </>
        ) : (
          <>
            <NavButton active={view === 'login'} onClick={() => setView('login')}>
              Login
            </NavButton>
            <NavButton active={view === 'register'} onClick={() => setView('register')}>
              Register
            </NavButton>
          </>
        )}
      </div>
    </nav>
  )
}

function StatusDot({ apiOnline }) {
  return (
    <div className="hidden items-center gap-2 border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-stone-300 sm:flex">
      <span className={`h-2 w-2 rounded-full ${apiOnline ? 'bg-emerald-400' : 'bg-[#45d3dc]'}`} />
      {apiOnline ? 'Live API' : 'Demo preview'}
    </div>
  )
}

function NavButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-3 py-2 text-sm font-semibold transition ${
        active
          ? 'border-[#ff4655]/70 bg-[#ff4655]/15 text-white'
          : 'border-white/10 bg-white/[0.04] text-stone-300 hover:bg-white/[0.08]'
      }`}
    >
      {children}
    </button>
  )
}

function Metric({ label, value }) {
  return (
    <div className="border border-white/10 bg-black/25 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  )
}

function PredictionCard({ apiOnline }) {
  const match = featuredMatches[0]

  return (
    <section className="border border-white/10 bg-[#0d1016]/88 p-5 shadow-2xl shadow-black/40 backdrop-blur">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#45d3dc]">
            Featured Pick
          </p>
          <h2 className="mt-1 text-2xl font-bold text-white">{match.stage}</h2>
        </div>
        <RadioTower className={`h-7 w-7 ${apiOnline ? 'text-emerald-300' : 'text-[#45d3dc]'}`} />
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <TeamMark tag={match.tagA} name={match.teamA} align="left" />
        <span className="text-xs font-black uppercase tracking-[0.18em] text-stone-500">vs</span>
        <TeamMark tag={match.tagB} name={match.teamB} align="right" />
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm text-stone-400">
          <span>{match.tagA} win crowd</span>
          <span>{match.winA}%</span>
        </div>
        <div className="h-3 overflow-hidden bg-white/10">
          <div className="h-full bg-[#ff4655]" style={{ width: `${match.winA}%` }} />
        </div>
      </div>

      <p className="mt-5 border border-[#45d3dc]/20 bg-[#45d3dc]/10 p-4 text-sm leading-6 text-stone-200">
        {match.insight}
      </p>
    </section>
  )
}

function TeamMark({ tag, name, align }) {
  return (
    <div className={align === 'right' ? 'text-right' : 'text-left'}>
      <div className="inline-grid h-14 w-14 place-items-center border border-white/10 bg-white/[0.06] text-lg font-black text-white">
        {tag}
      </div>
      <p className="mt-3 text-sm font-semibold text-white">{name}</p>
    </div>
  )
}

function MatchBoard() {
  return (
    <section className="border border-white/10 bg-[#0d1016] p-5">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#45d3dc]">
            Match Board
          </p>
          <h2 className="mt-1 text-2xl font-bold text-white">Upcoming Valorant Fixtures</h2>
        </div>
        <Trophy className="h-7 w-7 text-[#ff4655]" />
      </div>

      <div className="mt-5 grid gap-3">
        {featuredMatches.map((match) => (
          <article key={match.id} className="border border-white/10 bg-black/25 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                  {match.tournament} - {match.time}
                </p>
                <h3 className="mt-2 text-xl font-bold text-white">
                  {match.teamA} vs {match.teamB}
                </h3>
              </div>
              <span className="border border-[#ff4655]/35 bg-[#ff4655]/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#ffb0b7]">
                {match.alert}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-stone-400">{match.insight}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Leaderboard() {
  return (
    <section className="border border-white/10 bg-[#0d1016] p-5">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#45d3dc]">
            Leaderboard
          </p>
          <h2 className="mt-1 text-2xl font-bold text-white">Top Predictors</h2>
        </div>
        <Crown className="h-7 w-7 text-[#ff4655]" />
      </div>

      <div className="mt-5 grid gap-2">
        {leaderboard.map(([name, points, accuracy], index) => (
          <div key={name} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border border-white/10 bg-black/25 p-3">
            <span className="grid h-9 w-9 place-items-center bg-white/[0.06] text-sm font-black text-white">
              {index + 1}
            </span>
            <div>
              <p className="font-semibold text-white">{name}</p>
              <p className="text-xs text-stone-500">{accuracy} accuracy</p>
            </div>
            <p className="font-black text-[#45d3dc]">{points}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function InsightCard({ label, value, detail, icon: Icon }) {
  return (
    <article className="border border-white/10 bg-[#0d1016] p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{label}</p>
        <Icon className="h-6 w-6 text-[#ff4655]" />
      </div>
      <p className="mt-4 text-4xl font-black text-white">{value}</p>
      <p className="mt-3 text-sm leading-6 text-stone-400">{detail}</p>
    </article>
  )
}

function AuthPanel({ mode, onSuccess }) {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    adminInviteCode: '',
  })
  const isRegister = mode === 'register'
  const mutation = useMutation({
    mutationFn: isRegister ? registerUser : loginUser,
    onSuccess,
  })

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const payload = isRegister
      ? form
      : {
          email: form.email,
          password: form.password,
        }

    mutation.mutate(payload)
  }

  return (
    <section className="border border-white/10 bg-[#0d1016]/88 p-5 shadow-2xl shadow-black/40 backdrop-blur">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#45d3dc]">
            {isRegister ? 'Join the board' : 'Member access'}
          </p>
          <h2 className="mt-1 text-2xl font-bold text-white">
            {isRegister ? 'Create your account' : 'Welcome back'}
          </h2>
        </div>
        {isRegister ? (
          <UserPlus className="h-7 w-7 text-[#ff4655]" />
        ) : (
          <LogIn className="h-7 w-7 text-[#ff4655]" />
        )}
      </div>

      <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
        {isRegister && (
          <Field
            label="Username"
            name="username"
            value={form.username}
            onChange={updateField}
            placeholder="sovaMain"
          />
        )}
        <Field
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={updateField}
          placeholder="you@example.com"
        />
        <Field
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={updateField}
          placeholder="At least 8 characters"
        />
        {isRegister && (
          <Field
            label="Admin Invite Code"
            name="adminInviteCode"
            value={form.adminInviteCode}
            onChange={updateField}
            placeholder="Optional"
          />
        )}

        {mutation.isError && (
          <p className="border border-[#ff4655]/35 bg-[#ff4655]/10 px-3 py-2 text-sm text-[#ffb0b7]">
            {mutation.error.message}
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="mt-2 inline-flex items-center justify-center gap-2 bg-[#ff4655] px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#ff6b76] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ShieldCheck className="h-4 w-4" />
          {mutation.isPending
            ? 'Please wait'
            : isRegister
              ? 'Create Account'
              : 'Login'}
        </button>
      </form>
    </section>
  )
}

function Field({ label, name, value, onChange, type = 'text', placeholder }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-stone-300">
      {label}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-white/10 bg-black/35 px-4 py-3 text-base text-white outline-none transition placeholder:text-stone-600 focus:border-[#45d3dc]/70"
      />
    </label>
  )
}

function ProfilePanel({ token, user, isLoading, error, onLogin }) {
  if (!token) {
    return (
      <section className="border border-white/10 bg-[#0d1016]/88 p-5 shadow-2xl shadow-black/40 backdrop-blur">
        <Lock className="h-8 w-8 text-[#ff4655]" />
        <h2 className="mt-4 text-2xl font-bold text-white">Player card locked</h2>
        <p className="mt-3 text-stone-300">Login first to view your prediction profile.</p>
        <button
          type="button"
          onClick={onLogin}
          className="mt-5 inline-flex items-center gap-2 bg-[#ff4655] px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white"
        >
          <LogIn className="h-4 w-4" />
          Login
        </button>
      </section>
    )
  }

  return (
    <section className="border border-white/10 bg-[#0d1016]/88 p-5 shadow-2xl shadow-black/40 backdrop-blur">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#45d3dc]">
            Player Card
          </p>
          <h2 className="mt-1 text-2xl font-bold text-white">
            {isLoading ? 'Loading profile' : user?.username || 'Session'}
          </h2>
        </div>
        <ShieldCheck className="h-7 w-7 text-emerald-300" />
      </div>

      {error ? (
        <p className="mt-5 border border-[#ff4655]/35 bg-[#ff4655]/10 px-3 py-2 text-sm text-[#ffb0b7]">
          {error.message}
        </p>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <StatusTile icon={<Shield className="h-5 w-5" />} label="Role" value={user?.role || 'Loading'} tone="neutral" />
          <StatusTile icon={<Trophy className="h-5 w-5" />} label="Points" value={String(user?.predictionStats?.totalPoints ?? 0)} tone="good" />
          <StatusTile icon={<BarChart3 className="h-5 w-5" />} label="Accuracy" value={`${user?.predictionStats?.accuracy ?? 0}%`} tone="neutral" />
          <StatusTile icon={<Activity className="h-5 w-5" />} label="Streak" value={String(user?.predictionStats?.streak ?? 0)} tone="neutral" />
        </div>
      )}
    </section>
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
        <span className="text-xs font-semibold uppercase tracking-[0.18em]">{label}</span>
      </div>
      <p className="mt-4 text-2xl font-black uppercase text-white">{value}</p>
    </div>
  )
}

export default App
