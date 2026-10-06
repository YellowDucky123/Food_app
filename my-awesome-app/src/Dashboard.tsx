import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check, UtensilsCrossed } from 'lucide-react'
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

  const selected = LOCATIONS.filter(l => picked.has(l.id))
  const total = selected.reduce((sum, l) => sum + countFor(l.db_name), 0)
  const allPicked = picked.size === LOCATIONS.length

  const search = () => {
    if (selected.length > 0) navigate(`/foods/${selected.flatMap(l => l.db_name)}`)
  }

  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-5 pb-36 pt-12 sm:px-6 sm:pt-24">
      <header className="fade-up">
        <div className="mb-8 flex items-center gap-2 text-sm font-medium text-muted">
          <UtensilsCrossed className="size-4 text-accent" />
          Food App
        </div>
        <h1 className="text-[2.5rem] font-bold leading-[1.08] tracking-tight sm:text-5xl">
          Where are you
          <br />
          eating today?
        </h1>
        <p className="mt-4 text-lg text-muted">Pick one or more areas to see what's nearby.</p>
      </header>

      <section className="mt-12">
        <div className="fade-up mb-3 flex items-center justify-between text-sm" style={{ '--i': 2 } as React.CSSProperties}>
          <span className="font-medium text-muted">Areas</span>
          <button
            type="button"
            onClick={() => setPicked(allPicked ? new Set() : new Set(LOCATIONS.map(l => l.id)))}
            className="font-medium text-accent hover:underline"
          >
            {allPicked ? 'Clear all' : 'Select all'}
          </button>
        </div>

        <ul
          className="fade-up divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface"
          style={{ '--i': 3 } as React.CSSProperties}
        >
          {LOCATIONS.map(item => {
            const isPicked = picked.has(item.id)
            return (
              <li key={item.id}>
                <button
                  type="button"
                  aria-pressed={isPicked}
                  onClick={() => toggle(item.id)}
                  className={`flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors active:bg-raised focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent ${
                    isPicked ? 'bg-accent/[0.07]' : 'hover:bg-raised'
                  }`}
                >
                  <span>
                    <span className="block text-lg font-medium">{item.location}</span>
                    <span className="block text-sm text-muted">{countFor(item.db_name)} places</span>
                  </span>
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full border transition-all ${
                      isPicked ? 'border-accent bg-accent text-accent-ink' : 'border-line text-transparent'
                    }`}
                  >
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <div className="fixed inset-x-0 bottom-0 border-t border-line bg-canvas/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-5 py-3.5 sm:px-6">
          <p className="text-sm text-muted">
            {picked.size === 0 ? (
              'Nothing selected'
            ) : (
              <>
                <span className="font-semibold text-ink">{picked.size}</span> {picked.size === 1 ? 'area' : 'areas'} ·{' '}
                <span className="font-semibold text-ink">{total}</span> places
              </>
            )}
          </p>
          <button
            type="button"
            disabled={picked.size === 0}
            onClick={search}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-base font-semibold text-accent-ink transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:bg-raised disabled:text-muted disabled:hover:brightness-100"
          >
            Show places
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </main>
  )
}
