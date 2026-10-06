import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink, MapPin, Search, Sparkles, Wifi } from 'lucide-react'
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

const googleUrl = (food: Food) => {
  const query = [food.Area, food.Landmark, food.Name].filter(Boolean).join(' ')
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`
}

export default function FoodsPage() {
  const { locations } = useParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [area, setArea] = useState<string | null>(null)

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
  const foods = inLocations.filter(
    f =>
      (!area || areaLabel(f.Area) === area) &&
      (!q || [f.Name, f.Landmark, f.Category, f.Signaturemenu].some(v => v?.toLowerCase().includes(q))),
  )

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/85 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              aria-label="Back to dashboard"
              className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold text-white sm:text-2xl">Available Foods</h1>
              <p className="text-sm text-slate-400">
                {foods.length} {foods.length === 1 ? 'place' : 'places'}
                {areas.length > 0 && ` in ${areas.map(([a]) => a).join(', ')}`}
              </p>
            </div>
          </div>

          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name, landmark, category or menu…"
              className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-amber-400/70 focus:outline-none"
            />
          </div>

          {areas.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {[[null, inLocations.length] as const, ...areas].map(([name, count]) => (
                <button
                  key={name ?? 'all'}
                  type="button"
                  onClick={() => setArea(name)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    area === name
                      ? 'border-amber-400 bg-amber-400 text-slate-950'
                      : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {name ?? 'All'} <span className="opacity-60">{count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        {foods.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 py-16 text-center text-slate-500">
            {inLocations.length === 0 ? 'No food found in these locations.' : 'Nothing matches your search.'}
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {foods.map((item, index) => (
              <li
                key={index}
                className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg transition-colors hover:border-amber-400/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold leading-snug text-white">{item.Name}</h2>
                  <span className="shrink-0 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-xs font-medium text-amber-300">
                    {areaLabel(item.Area)}
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-sm text-slate-400">
                  {item.Landmark && (
                    <p className="flex items-center gap-2">
                      <MapPin className="size-4 shrink-0 text-slate-500" />
                      {item.Landmark}
                    </p>
                  )}
                  {item.Signaturemenu && (
                    <p className="flex items-start gap-2">
                      <Sparkles className="mt-0.5 size-4 shrink-0 text-amber-400" />
                      <span className="text-slate-300">{item.Signaturemenu}</span>
                    </p>
                  )}
                </div>

                {(item.Category || item.Online) && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.Category && (
                      <span className="rounded-md bg-slate-800 px-2 py-1 text-xs capitalize text-slate-300">
                        {item.Category}
                      </span>
                    )}
                    {item.Online && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">
                        <Wifi className="size-3" /> Online
                      </span>
                    )}
                  </div>
                )}

                <div className="min-h-4 flex-1" />

                <a
                  href={googleUrl(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg bg-slate-800 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-amber-400 hover:text-slate-950"
                >
                  View Details <ExternalLink className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
