import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Database, Lock, Plus, RefreshCw } from 'lucide-react'
import { createAdminResource, listAdminResource } from '../api/admin'

const resourceConfigs = {
  teams: {
    title: 'Teams',
    subtitle: 'Create Valorant teams used in matches and predictions.',
    fields: [
      { name: 'name', label: 'Team Name', placeholder: 'Paper Rex' },
      { name: 'shortName', label: 'Short Name', placeholder: 'PRX' },
      { name: 'region', label: 'Region', placeholder: 'Pacific' },
      { name: 'logoUrl', label: 'Logo URL', placeholder: 'Optional image URL', optional: true },
    ],
    summary: (item) => `${item.shortName} - ${item.region}`,
  },
  players: {
    title: 'Players',
    subtitle: 'Add players and connect them to a team later.',
    fields: [
      { name: 'handle', label: 'Handle', placeholder: 'something' },
      { name: 'realName', label: 'Real Name', placeholder: 'Optional', optional: true },
      {
        name: 'role',
        label: 'Role',
        type: 'select',
        options: ['duelist', 'initiator', 'controller', 'sentinel', 'flex', 'igl'],
      },
      { name: 'rating', label: 'Rating', type: 'number', placeholder: '1.10', optional: true },
    ],
    summary: (item) => `${item.role || 'flex'} - rating ${item.rating ?? 1}`,
  },
  tournaments: {
    title: 'Tournaments',
    subtitle: 'Create events that matches belong to.',
    fields: [
      { name: 'name', label: 'Tournament Name', placeholder: 'VCT Champions' },
      { name: 'region', label: 'Region', placeholder: 'Global' },
      { name: 'startDate', label: 'Start Date', type: 'date' },
      { name: 'endDate', label: 'End Date', type: 'date' },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: ['upcoming', 'live', 'completed'],
      },
    ],
    summary: (item) => `${item.region} - ${item.status}`,
  },
  matches: {
    title: 'Matches',
    subtitle: 'Schedule match shells after teams and tournaments exist.',
    fields: [
      { name: 'tournament', label: 'Tournament ID', placeholder: 'MongoDB tournament id' },
      { name: 'teamA', label: 'Team A ID', placeholder: 'MongoDB team id' },
      { name: 'teamB', label: 'Team B ID', placeholder: 'MongoDB team id' },
      { name: 'startsAt', label: 'Starts At', type: 'datetime-local' },
      {
        name: 'bestOf',
        label: 'Best Of',
        type: 'select',
        options: ['1', '3', '5'],
      },
    ],
    summary: (item) =>
      `${item.teamA?.shortName || 'Team A'} vs ${item.teamB?.shortName || 'Team B'}`,
  },
  maps: {
    title: 'Maps',
    subtitle: 'Manage the Valorant map pool.',
    fields: [
      { name: 'name', label: 'Map Name', placeholder: 'Ascent' },
      { name: 'activePool', label: 'Active Pool', type: 'checkbox' },
    ],
    summary: (item) => (item.activePool ? 'Active map pool' : 'Inactive'),
  },
  agents: {
    title: 'Agents',
    subtitle: 'Manage agents for future player and map analytics.',
    fields: [
      { name: 'name', label: 'Agent Name', placeholder: 'Jett' },
      {
        name: 'role',
        label: 'Role',
        type: 'select',
        options: ['duelist', 'initiator', 'controller', 'sentinel'],
      },
    ],
    summary: (item) => item.role,
  },
}

const resourceNames = Object.keys(resourceConfigs)

function getInitialForm(config) {
  return config.fields.reduce((form, field) => {
    form[field.name] = field.type === 'checkbox' ? true : field.options?.[0] || ''
    return form
  }, {})
}

function cleanPayload(form, fields) {
  return fields.reduce((payload, field) => {
    const value = form[field.name]

    if (field.optional && value === '') {
      return payload
    }

    payload[field.name] = value
    return payload
  }, {})
}

function AdminPanel({ token, isAdmin }) {
  const queryClient = useQueryClient()
  const [resource, setResource] = useState('teams')
  const config = resourceConfigs[resource]
  const [form, setForm] = useState(() => getInitialForm(config))

  const listQuery = useQuery({
    queryKey: ['admin', resource],
    queryFn: () => listAdminResource(resource, token),
    enabled: Boolean(token && isAdmin),
  })

  const mutation = useMutation({
    mutationFn: (payload) => createAdminResource(resource, token, payload),
    onSuccess: () => {
      setForm(getInitialForm(config))
      queryClient.invalidateQueries({ queryKey: ['admin', resource] })
    },
  })

  const items = listQuery.data?.items || []
  const heading = useMemo(() => config.title, [config])

  function selectResource(nextResource) {
    setResource(nextResource)
    setForm(getInitialForm(resourceConfigs[nextResource]))
  }

  function updateField(event) {
    const { name, type, checked, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    mutation.mutate(cleanPayload(form, config.fields))
  }

  if (!isAdmin) {
    return (
      <section className="border border-white/10 bg-[#0d1016]/88 p-5 shadow-2xl shadow-black/40 backdrop-blur">
        <Lock className="h-8 w-8 text-[#ff4655]" />
        <h2 className="mt-4 text-2xl font-bold text-white">Admin Only</h2>
        <p className="mt-3 text-stone-300">
          This workspace is only visible to accounts with the admin role.
        </p>
      </section>
    )
  }

  return (
    <section className="border border-white/10 bg-[#0d1016]/88 p-5 shadow-2xl shadow-black/40 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#45d3dc]">
            Admin Data
          </p>
          <h2 className="mt-1 text-2xl font-bold text-white">{heading}</h2>
        </div>
        <button
          type="button"
          onClick={() => listQuery.refetch()}
          className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-stone-200"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {resourceNames.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => selectResource(name)}
            className={`border px-3 py-2 text-sm font-semibold capitalize transition ${
              resource === name
                ? 'border-[#ff4655]/70 bg-[#ff4655]/15 text-white'
                : 'border-white/10 bg-white/[0.04] text-stone-300 hover:bg-white/[0.08]'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm leading-6 text-stone-400">{config.subtitle}</p>

      <form className="mt-5 grid gap-3" onSubmit={handleSubmit}>
        {config.fields.map((field) => (
          <AdminField
            key={field.name}
            field={field}
            value={form[field.name]}
            onChange={updateField}
          />
        ))}

        {mutation.isError && (
          <p className="border border-[#ff4655]/35 bg-[#ff4655]/10 px-3 py-2 text-sm text-[#ffb0b7]">
            {mutation.error.message}
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex items-center justify-center gap-2 bg-[#ff4655] px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#ff6b76] disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          {mutation.isPending ? 'Creating' : `Create ${config.title.slice(0, -1)}`}
        </button>
      </form>

      <div className="mt-5 border border-white/10 bg-black/30 p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
          <Database className="h-4 w-4" />
          Saved Records
        </div>

        {listQuery.isLoading ? (
          <p className="text-sm text-stone-400">Loading admin data...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-stone-400">No {config.title.toLowerCase()} yet.</p>
        ) : (
          <div className="grid max-h-64 gap-2 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item._id} className="border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">
                    {item.name || item.handle || item._id}
                  </p>
                  <code className="text-[10px] text-stone-500">{item._id}</code>
                </div>
                <p className="mt-1 text-sm capitalize text-stone-400">
                  {config.summary(item)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function AdminField({ field, value, onChange }) {
  if (field.type === 'select') {
    return (
      <label className="grid gap-2 text-sm font-semibold text-stone-300">
        {field.label}
        <select
          name={field.name}
          value={value}
          onChange={onChange}
          className="w-full border border-white/10 bg-black/35 px-4 py-3 text-base text-white outline-none transition focus:border-[#45d3dc]/70"
        >
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    )
  }

  if (field.type === 'checkbox') {
    return (
      <label className="flex items-center justify-between border border-white/10 bg-black/25 px-4 py-3 text-sm font-semibold text-stone-300">
        {field.label}
        <input
          name={field.name}
          type="checkbox"
          checked={Boolean(value)}
          onChange={onChange}
          className="h-5 w-5 accent-[#ff4655]"
        />
      </label>
    )
  }

  return (
    <label className="grid gap-2 text-sm font-semibold text-stone-300">
      {field.label}
      <input
        name={field.name}
        type={field.type || 'text'}
        value={value}
        onChange={onChange}
        placeholder={field.placeholder}
        className="w-full border border-white/10 bg-black/35 px-4 py-3 text-base text-white outline-none transition placeholder:text-stone-600 focus:border-[#45d3dc]/70"
      />
    </label>
  )
}

export default AdminPanel

