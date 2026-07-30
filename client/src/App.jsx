import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Activity,
  BarChart3,
  Crown,
  Database,
  Lock,
  LogIn,
  LogOut,
  RadioTower,
  Shield,
  ShieldCheck,
  Swords,
  Trophy,
  UserPlus,
} from 'lucide-react'
import { getProfile, loginUser, registerUser } from './api/auth'
import { getApiHealth } from './api/health'

const TOKEN_KEY = 'esportsedge_token'

function App() {
  const queryClient = useQueryClient()
  const [view, setView] = useState('home')
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))

  const { data, isLoading, isError } = useQuery({
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

  const apiStatus = isLoading ? 'Checking' : isError ? 'Offline' : 'Online'
  const dbStatus = data?.database?.connected ? 'Connected' : 'Waiting'
  const user = profileQuery.data?.user

  function handleAuthSuccess(result) {
    localStorage.setItem(TOKEN_KEY, result.token)
    setToken(result.token)
    setView('profile')
    queryClient.setQueryData(['profile', result.token], { user: result.user })
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setView('home')
    queryClient.removeQueries({ queryKey: ['profile'] })
  }

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
          <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
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

            <div className="flex flex-wrap items-center gap-2">
              <NavButton active={view === 'home'} onClick={() => setView('home')}>
                Home
              </NavButton>
              {token ? (
                <>
                  <NavButton
                    active={view === 'profile'}
                    onClick={() => setView('profile')}
                  >
                    Profile
                  </NavButton>
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
                  <NavButton
                    active={view === 'login'}
                    onClick={() => setView('login')}
                  >
                    Login
                  </NavButton>
                  <NavButton
                    active={view === 'register'}
                    onClick={() => setView('register')}
                  >
                    Register
                  </NavButton>
                </>
              )}
            </div>
          </nav>

          <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.02fr_0.98fr]">
            <section className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 border border-[#ff4655]/40 bg-[#ff4655]/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#ff9aa3]">
                <Activity className="h-4 w-4" />
                Phase 2 auth workflow
              </div>

              <h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.95] text-white sm:text-6xl lg:text-7xl">
                Sign in before the prediction round starts.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
                The platform now supports register, login, saved auth tokens,
                and a protected profile view. This is the gate every prediction,
                leaderboard score, and admin workflow will pass through later.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setView(token ? 'profile' : 'register')}
                  className="inline-flex items-center justify-center gap-2 bg-[#ff4655] px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#ff6b76]"
                >
                  {token ? <ShieldCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                  {token ? 'Open Profile' : 'Create Account'}
                </button>
                <button
                  type="button"
                  onClick={() => setView(token ? 'profile' : 'login')}
                  className="inline-flex items-center justify-center gap-2 border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white/[0.08]"
                >
                  <LogIn className="h-4 w-4" />
                  {token ? 'Session Active' : 'Login'}
                </button>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <FeaturePill icon={<Shield className="h-4 w-4" />} label="JWT session" />
                <FeaturePill icon={<Lock className="h-4 w-4" />} label="Protected API" />
                <FeaturePill icon={<Crown className="h-4 w-4" />} label="Role ready" />
              </div>
            </section>

            {view === 'register' && <AuthPanel mode="register" onSuccess={handleAuthSuccess} />}
            {view === 'login' && <AuthPanel mode="login" onSuccess={handleAuthSuccess} />}
            {view === 'profile' && (
              <ProfilePanel
                token={token}
                user={user}
                isLoading={profileQuery.isLoading}
                error={profileQuery.error}
                onLogin={() => setView('login')}
              />
            )}
            {view === 'home' && (
              <SystemPanel
                apiStatus={apiStatus}
                dbStatus={dbStatus}
                healthData={data}
                isLoading={isLoading}
                isError={isError}
              />
            )}
          </div>
        </div>
      </section>
    </main>
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

function FeaturePill({ icon, label }) {
  return (
    <div className="inline-flex items-center gap-2 border border-white/10 bg-black/25 px-3 py-2 text-sm text-stone-300">
      <span className="text-[#45d3dc]">{icon}</span>
      {label}
    </div>
  )
}

function AuthPanel({ mode, onSuccess }) {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
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
            {isRegister ? 'New challenger' : 'Return to queue'}
          </p>
          <h2 className="mt-1 text-2xl font-bold text-white">
            {isRegister ? 'Create Account' : 'Login'}
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
        <h2 className="mt-4 text-2xl font-bold text-white">Protected Route</h2>
        <p className="mt-3 text-stone-300">
          Login first to view your prediction profile.
        </p>
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
            Protected Profile
          </p>
          <h2 className="mt-1 text-2xl font-bold text-white">
            {isLoading ? 'Loading player card' : user?.username || 'Session'}
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
          <StatusTile
            icon={<Shield className="h-5 w-5" />}
            label="Role"
            value={user?.role || 'Loading'}
            tone="neutral"
          />
          <StatusTile
            icon={<Trophy className="h-5 w-5" />}
            label="Points"
            value={String(user?.predictionStats?.totalPoints ?? 0)}
            tone="good"
          />
          <StatusTile
            icon={<BarChart3 className="h-5 w-5" />}
            label="Accuracy"
            value={`${user?.predictionStats?.accuracy ?? 0}%`}
            tone="neutral"
          />
          <StatusTile
            icon={<Activity className="h-5 w-5" />}
            label="Streak"
            value={String(user?.predictionStats?.streak ?? 0)}
            tone="neutral"
          />
        </div>
      )}
    </section>
  )
}

function SystemPanel({ apiStatus, dbStatus, healthData, isLoading, isError }) {
  return (
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
            Phase 2 Integration
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
          tone={healthData?.database?.connected ? 'good' : 'warn'}
        />
        <StatusTile
          icon={<ShieldCheck className="h-5 w-5" />}
          label="Auth API"
          value="Ready"
          tone="good"
        />
        <StatusTile
          icon={<Swords className="h-5 w-5" />}
          label="Next Flow"
          value="Admin"
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
              : JSON.stringify(healthData, null, 2)}
        </pre>
      </div>
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
        <span className="text-xs font-semibold uppercase tracking-[0.18em]">
          {label}
        </span>
      </div>
      <p className="mt-4 text-2xl font-black uppercase text-white">{value}</p>
    </div>
  )
}

export default App
