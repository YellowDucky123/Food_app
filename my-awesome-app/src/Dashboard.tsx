import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check, MapPin, UtensilsCrossed } from 'lucide-react'
import foodsData from './data/foods.json'
import { LOCATIONS } from './locations'

const countFor = (dbNames: string[]) =>
  foodsData.filter(food => dbNames.includes(food.Area)).length

export default function Dashboard() {
  const [picked, setPicked] = useState<Set<number>>(new Set())
  const navigate = useNavigate()

  const toggle = (id: number) =>
    setPicked(prev => {
      const next = new Set(prev)
      if (!next.delete(id)) next.add(id)
      return next
    })

  const search = () => {
    const selected = LOCATIONS.filter(l => picked.has(l.id)).flatMap(l => l.db_name)
    if (selected.length > 0) navigate(`/foods/${selected}`)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10 text-slate-100 sm:flex sm:items-center sm:justify-center">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-lg">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-orange-900/40">
            <UtensilsCrossed className="size-7 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">Food App</h1>
          <p className="mt-2 text-slate-400">Where are you hungry? Pick one or more areas.</p>
        </header>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4 shadow-2xl backdrop-blur sm:p-6">
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {LOCATIONS.map(item => {
              const isPicked = picked.has(item.id)
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-pressed={isPicked}
                    onClick={() => toggle(item.id)}
                    className={`group flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${
                      isPicked
                        ? 'border-amber-400/70 bg-amber-400/10 shadow-lg shadow-amber-900/20'
                        : 'border-slate-800 bg-slate-800/40 hover:border-slate-600 hover:bg-slate-800'
                    }`}
                  >
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        isPicked ? 'bg-amber-400 text-slate-950' : 'bg-slate-700/60 text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      {isPicked ? <Check className="size-5" strokeWidth={3} /> : <MapPin className="size-5" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-white">{item.location}</span>
                      <span className="block text-sm text-slate-400">{countFor(item.db_name)} places</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-800 pt-5">
            <div className="text-sm text-slate-400">
              {picked.size === 0 ? 'Nothing selected' : `${picked.size} selected`}
              {picked.size > 0 && (
                <button
                  type="button"
                  onClick={() => setPicked(new Set())}
                  className="ml-3 text-amber-400 underline-offset-2 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            <button
              type="button"
              disabled={picked.size === 0}
              onClick={search}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 font-bold text-slate-950 shadow-lg shadow-orange-900/30 transition-all hover:brightness-110 active:scale-[0.97] disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 disabled:shadow-none"
            >
              Find food
              <ArrowRight className="size-5" />
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}
