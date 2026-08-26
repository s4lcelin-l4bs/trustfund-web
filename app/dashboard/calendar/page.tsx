'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { getCalendarEvents, createCalendarEvent, deleteCalendarEvent, CalendarResponse } from '@/lib/api/calendar'
import { CalendarEvent } from '@/types'
import { Button } from '@/components/ui/Button'
import { staggerContainer, fadeInUp } from '@/lib/animations'

const EVENT_COLORS: Record<string, string> = {
  contribution: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  meeting:      'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  distribution: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  other:        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
}

const EVENT_EMOJIS: Record<string, string> = {
  contribution: '📥',
  meeting: '🤝',
  distribution: '🎯',
  other: '📌',
}

interface CreateEventForm {
  title: string
  type: CalendarEvent['type']
  date: string
  startTime: string
  endTime: string
  description: string
  location: string
}

const EMPTY_FORM: CreateEventForm = { title: '', type: 'meeting', date: '', startTime: '', endTime: '', description: '', location: '' }

export default function CalendarPage() {
  const [calData, setCalData] = useState<CalendarResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [form, setForm] = useState<CreateEventForm>(EMPTY_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchEvents = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getCalendarEvents({
        startDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString(),
        endDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59).toISOString(),
      })
      setCalData(data)
    } catch {
      toast.error('Impossible de charger le calendrier')
    } finally {
      setIsLoading(false)
    }
  }, [currentMonth])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
  const blanks = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 })

  const allEvents = [...(calData?.events || []), ...(calData?.synthetic || [])]

  function eventsForDay(day: number) {
    return allEvents.filter(e => {
      const d = new Date(e.date)
      return d.getDate() === day && d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear()
    })
  }

  const selectedDayEvents = selectedDay ? eventsForDay(selectedDay) : []

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.date) { toast.error('Titre et date requis'); return }
    setIsSubmitting(true)
    try {
      await createCalendarEvent({ ...form } as any)
      toast.success('Événement créé')
      setIsFormOpen(false)
      setForm(EMPTY_FORM)
      fetchEvents()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Erreur lors de la création')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteEvent(id: string) {
    try {
      await deleteCalendarEvent(id)
      toast.success('Événement supprimé')
      fetchEvents()
      setSelectedDay(null)
    } catch {
      toast.error('Impossible de supprimer')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Calendrier</h1>
          <p className="text-slate-500 mt-1 font-medium">Réunions, cotisations et distributions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={prevMonth}>← Précédent</Button>
          <span className="font-bold text-lg min-w-[140px] text-center capitalize">
            {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </span>
          <Button variant="outline" onClick={nextMonth}>Suivant →</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 glass-card p-4">
          <div className="grid grid-cols-7 gap-px">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
              <div key={day} className="p-2 text-center font-bold text-slate-500 text-xs uppercase tracking-wider">{day}</div>
            ))}
            {blanks.map((_, i) => (
              <div key={`blank-${i}`} className="min-h-[80px] rounded-xl" />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const dayEvts = eventsForDay(day)
              const isToday = new Date().getDate() === day && new Date().getMonth() === currentMonth.getMonth() && new Date().getFullYear() === currentMonth.getFullYear()
              const isSelected = selectedDay === day
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(selectedDay === day ? null : day)}
                  className={`min-h-[80px] rounded-xl p-2 transition-all text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 ${isToday ? 'ring-2 ring-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10' : ''} ${isSelected ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
                >
                  <div className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold mb-1 ${isToday ? 'bg-emerald-500 text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                    {day}
                  </div>
                  <div className="space-y-0.5">
                    {dayEvts.slice(0, 2).map(evt => (
                      <div key={evt.id} className={`text-[10px] px-1.5 py-0.5 rounded-md truncate font-medium ${EVENT_COLORS[(evt as any).type] || EVENT_COLORS.other}`}>
                        {(evt as any).synthetic ? '⏰ ' : ''}{(evt as any).title}
                      </div>
                    ))}
                    {dayEvts.length > 2 && (
                      <div className="text-[10px] text-slate-500 font-medium pl-1">+{dayEvts.length - 2} autre{dayEvts.length - 2 > 1 ? 's' : ''}</div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Legend */}
          <div className="glass-card p-4">
            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">Légende</h3>
            <div className="space-y-2">
              {Object.entries(EVENT_EMOJIS).map(([type, emoji]) => (
                <div key={type} className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-md font-medium ${EVENT_COLORS[type]}`}>{emoji} {type}</span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-md font-medium bg-amber-100 text-amber-700">⏰ À venir</span>
              </div>
            </div>
          </div>

          {/* Selected Day Events */}
          <AnimatePresence mode="wait">
            {selectedDay && (
              <motion.div key={selectedDay} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-card p-4">
                <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-3">
                  {new Date(currentMonth.getFullYear(), currentMonth.getMonth(), selectedDay).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>
                {selectedDayEvents.length === 0 ? (
                  <p className="text-sm text-slate-500 py-4 text-center">Aucun événement ce jour</p>
                ) : (
                  <div className="space-y-2">
                    {selectedDayEvents.map(evt => (
                      <div key={evt.id} className={`p-3 rounded-xl ${EVENT_COLORS[(evt as any).type] || EVENT_COLORS.other}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-bold text-sm truncate">{(evt as any).title}</p>
                            {(evt as any).startTime && <p className="text-xs mt-0.5">{(evt as any).startTime} – {(evt as any).endTime}</p>}
                            {(evt as any).description && <p className="text-xs mt-1 opacity-80 line-clamp-2">{(evt as any).description}</p>}
                            {(evt as any).amount && <p className="text-xs font-bold mt-1">{new Intl.NumberFormat('fr-FR').format((evt as any).amount)} XAF</p>}
                          </div>
                          {!(evt as any).synthetic && (
                            <button onClick={() => handleDeleteEvent(evt.id)} className="flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add Event */}
          {!isFormOpen ? (
            <Button variant="primary" className="w-full" onClick={() => { setIsFormOpen(true); setForm({ ...EMPTY_FORM, date: selectedDay ? `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}` : '' }) }}>
              + Ajouter un événement
            </Button>
          ) : (
            <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-4 space-y-3" onSubmit={handleCreateEvent}>
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">Nouvel événement</h3>
              <input className="input-glass w-full" placeholder="Titre *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              <select className="input-glass w-full" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))}>
                <option value="meeting">Réunion</option>
                <option value="contribution">Cotisation</option>
                <option value="distribution">Distribution</option>
                <option value="other">Autre</option>
              </select>
              <input type="date" className="input-glass w-full" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
              <div className="grid grid-cols-2 gap-2">
                <input type="time" className="input-glass w-full" placeholder="Début" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} />
                <input type="time" className="input-glass w-full" placeholder="Fin" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} />
              </div>
              <input className="input-glass w-full" placeholder="Lieu" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
              <textarea className="input-glass w-full resize-none" rows={2} placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              <div className="flex gap-2">
                <Button variant="primary" type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? 'Création...' : 'Créer'}
                </Button>
                <Button variant="outline" type="button" onClick={() => setIsFormOpen(false)}>Annuler</Button>
              </div>
            </motion.form>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card px-6 py-4 flex items-center gap-3">
            <svg className="w-5 h-5 animate-spin text-emerald-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="text-sm font-medium">Chargement...</span>
          </div>
        </div>
      )}
    </div>
  )
}
