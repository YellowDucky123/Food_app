import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowDown, ArrowLeft, ArrowUp, ArrowUpRight, MapPin, Search, Wifi } from 'lucide-react'
import foodsData from './data/foods.json'
import { areaLabel } from './locations'

type Food = {
  Name: string
  Area: string
  Landmark: string | null
  Category: string | null
  Approved: string | null
  Online: string | null
  Signaturemenu: string | null
}

const allFoods = foodsData as Food[]

const SORT_OPTIONS = [
  { key: 'default', label: 'Default order' },
  { key: 'Name', label: 'Name' },
  { key: 'Area', label: 'Area' },
  { key: 'Landmark', label: 'Landmark' },
  { key: 'Category', label: 'Category' },
  { key: 'Signaturemenu', label: 'Signature menu' },
] as const

type SortKey = (typeof SORT_OPTIONS)[number]['key']

const googleUrl = (food: Food) => {
  const query = [food.Area, food.Landmark, food.Name].filter(Boolean).join(' ')
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`
}

export default function FoodsPage() {
  const { locations } = useParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [area, setArea] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('default')
  const [sortDesc, setSortDesc] = useState(false)

  // Convert the URL string back into an array and filter the bundled data
  const locationArray = locations ? locations.split(',') : []
  const inLocations = useMemo(
    () => allFoods.filter(food => locationArray.includes(food.Area)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locations],
  )

  // Distinct display areas (SG/Sg collapse into one) with their counts
  const areas = useMemo(() => {
    const counts = new Map<string, number>()
    inLocations.forEach(f => counts.set(areaLabel(f.Area), (counts.get(areaLabel(f.Area)) ?? 0) + 1))
    return [...counts]
  }, [inLocations])

  const q = query.trim().toLowerCase()
  const filtered = inLocations.filter(
    f =>
      (!area || areaLabel(f.Area) === area) &&
      (!q || [f.Name, f.Landmark, f.Category, f.Signaturemenu].some(v => v?.toLowerCase().includes(q))),
  )

  // Sort a copy; places with no value for the chosen field always go last
  const value = (f: Food) => (sortKey === 'Area' ? areaLabel(f.Area) : f[sortKey as keyof Food])?.trim() ?? ''
  const foods =
    sortKey === 'default'
      ? filtered
      : [...filtered].sort((a, b) => {
          const [x, y] = [value(a), value(b)]
          if (!x || !y) return !x && !y ? 0 : !x ? 1 : -1
          return (sortDesc ? -1 : 1) * x.localeCompare(y, undefined, { sensitivity: 'base', numeric: true })
        })

  const chip = (active: boolean) =>
    `shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
      active ? 'border-ink bg-ink text-canvas' : 'border-line text-muted hover:border-muted hover:text-ink'
    }`

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-line bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-4" /> All areas
          </button>

          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {areas.length === 1 ? areas[0][0] : 'Places to eat'}
              </h1>
              <p className="mt-1 text-sm text-muted">
                {foods.length} {foods.length === 1 ? 'place' : 'places'}
                {areas.length > 1 && ` across ${areas.length} areas`}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <select
                aria-label="Sort by"
                value={sortKey}
                onChange={e => setSortKey(e.target.value as SortKey)}
                className="rounded-full border border-line bg-surface px-4 py-2 font-medium focus:border-accent focus:outline-none"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.key} value={o.key}>
                    {o.key === 'default' ? 'Sort: default' : `Sort: ${o.label}`}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={sortKey === 'default'}
                onClick={() => setSortDesc(d => !d)}
                aria-label={sortDesc ? 'Descending, switch to ascending' : 'Ascending, switch to descending'}
                className="flex size-9 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
              >
                {sortDesc ? <ArrowDown className="size-4" /> : <ArrowUp className="size-4" />}
              </button>
            </div>
          </div>

          <div className="relative mt-5">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search name, landmark, category or menu"
              className="w-full rounded-full border border-line bg-surface py-2.5 pl-11 pr-4 text-sm placeholder:text-muted focus:border-accent focus:outline-none"
            />
          </div>

          {areas.length > 1 && (
            <div className="-mx-6 mt-4 flex gap-2 overflow-x-auto px-6 pb-1">
              {[[null, inLocations.length] as const, ...areas].map(([name, count]) => (
                <button key={name ?? 'all'} type="button" onClick={() => setArea(name)} className={chip(area === name)}>
                  {name ?? 'All'} <span className="opacity-60">{count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {foods.length === 0 ? (
          <div className="py-24 text-center text-muted">
            {inLocations.length === 0 ? 'No food found in these locations.' : 'Nothing matches your search.'}
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {foods.map((item, index) => (
              <li
                key={index}
                className="fade-up group flex flex-col rounded-2xl border border-line bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-lg hover:shadow-black/5"
                style={{ '--i': Math.min(index, 12) } as React.CSSProperties}
              >
                <p className="text-xs font-medium uppercase tracking-wider text-accent">{areaLabel(item.Area)}</p>
                <h2 className="mt-1.5 text-lg font-semibold leading-snug">{item.Name.trim()}</h2>

                {item.Landmark?.trim() && (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                    <MapPin className="size-3.5 shrink-0" />
                    {item.Landmark.trim()}
                  </p>
                )}

                {item.Signaturemenu && (
                  <p className="mt-4 border-l-2 border-accent/60 pl-3 text-sm leading-relaxed">
                    <span className="block text-xs font-medium uppercase tracking-wider text-muted">Try</span>
                    {item.Signaturemenu}
                  </p>
                )}

                {(item.Category || item.Online) && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.Category && (
                      <span className="rounded-full bg-raised px-2.5 py-1 text-xs capitalize text-muted">{item.Category}</span>
                    )}
                    {item.Online && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-raised px-2.5 py-1 text-xs text-muted">
                        <Wifi className="size-3" /> Online
                      </span>
                    )}
                  </div>
                )}

                <div className="min-h-5 flex-1" />

                <a
                  href={googleUrl(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 self-start text-sm font-medium text-ink underline-offset-4 transition-colors group-hover:text-accent hover:underline"
                >
                  View details <ArrowUpRight className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
