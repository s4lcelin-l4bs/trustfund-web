'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { GlassModal } from '@/components/ui/GlassModal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Skeleton } from '@/components/ui/Skeleton'
import { Role, OrganizationMember } from '@/types'
import { getOrganizationMembers, updateOrganizationMember } from '@/lib/api/organizationMembers'
import { useDebounce } from '@/lib/hooks/useDebounce'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  organizationId: string
  role: Role
}

export function MemberRoleAssignModal({ isOpen, onClose, onSuccess, organizationId, role }: Props) {
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const debouncedSearch = useDebounce(search, 300)

  const fetchMembers = useCallback(async () => {
    if (!isOpen) return
    setIsLoading(true)
    try {
      const data = await getOrganizationMembers(organizationId, {
        page: 1,
        pageSize: 50,
        search: debouncedSearch || undefined,
        status: 'active',
      })
      setMembers(data.items)
    } catch {
      toast.error('Erreur lors du chargement des membres.')
    } finally {
      setIsLoading(false)
    }
  }, [isOpen, organizationId, debouncedSearch])

  useEffect(() => { fetchMembers() }, [fetchMembers])

  useEffect(() => {
    if (!isOpen) { setSelected(new Set()); setSearch('') }
  }, [isOpen])

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (selected.size === members.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(members.map(m => m.id)))
    }
  }

  async function handleAssign() {
    if (selected.size === 0) return
    setIsSaving(true)
    try {
      await Promise.all(
        Array.from(selected).map(memberId =>
          updateOrganizationMember(organizationId, memberId, { roleId: role.id })
        )
      )
      toast.success(`Rôle "${role.name}" attribué à ${selected.size} membre(s)`)
      onSuccess()
      onClose()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur lors de l'attribution.")
    } finally {
      setIsSaving(false)
    }
  }

  const allSelected = members.length > 0 && selected.size === members.length
  const someSelected = selected.size > 0 && !allSelected

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} className="max-w-lg" showParticles={false}>
      <div className="p-6 space-y-5 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Attribuer le rôle
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Sélectionnez les membres pour leur attribuer le rôle{' '}
            <span className="font-bold text-emerald-600 dark:text-emerald-400">"{role.name}"</span>
          </p>
        </div>

        {/* Search */}
        <Input
          placeholder="Rechercher un membre..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          leftIcon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
            </svg>
          }
        />

        {/* Select all */}
        {!isLoading && members.length > 0 && (
          <label className="flex items-center gap-3 cursor-pointer px-1">
            <span
              onClick={toggleAll}
              className={[
                'relative w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all border-2',
                allSelected || someSelected
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-600 border-emerald-600'
                  : 'bg-white/60 dark:bg-slate-900/40 border-slate-300 dark:border-slate-600',
              ].join(' ')}
            >
              {(allSelected || someSelected) && (
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {someSelected && !allSelected
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  }
                </svg>
              )}
            </span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Tout sélectionner{' '}
              {selected.size > 0 && <span className="text-emerald-600 dark:text-emerald-400">({selected.size} sélectionné{selected.size > 1 ? 's' : ''})</span>}
            </span>
          </label>
        )}

        {/* Member list */}
        <div className="flex-1 overflow-y-auto space-y-2 min-h-0 max-h-72 pr-1">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <Skeleton height={40} width={40} className="rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton height={14} width="60%" />
                  <Skeleton height={12} width="40%" />
                </div>
              </div>
            ))
          ) : members.length === 0 ? (
            <p className="text-center text-slate-400 dark:text-slate-500 text-sm py-6">
              {search ? 'Aucun membre trouvé' : 'Aucun membre actif'}
            </p>
          ) : (
            members.map(member => {
              const isChecked = selected.has(member.id)
              return (
                <label
                  key={member.id}
                  onClick={() => toggle(member.id)}
                  className={[
                    'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border',
                    isChecked
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 border-transparent',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'relative w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all border-2',
                      isChecked
                        ? 'bg-gradient-to-br from-emerald-600 to-teal-600 border-emerald-600'
                        : 'bg-white/60 dark:bg-slate-900/40 border-slate-300 dark:border-slate-600',
                    ].join(' ')}
                  >
                    {isChecked && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <Avatar
                    src={member.photoUrl}
                    initials={`${member.firstName[0]}${member.lastName[0]}`}
                    size={36}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                      {member.matricule}
                    </p>
                  </div>
                </label>
              )
            })
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
          <Button variant="ghost" className="flex-1" onClick={onClose} disabled={isSaving}>
            Annuler
          </Button>
          <Button
            variant="glow"
            className="flex-1"
            onClick={handleAssign}
            isLoading={isSaving}
            disabled={selected.size === 0}
          >
            Attribuer à {selected.size > 0 ? `${selected.size} membre${selected.size > 1 ? 's' : ''}` : '...'}
          </Button>
        </div>
      </div>
    </GlassModal>
  )
}
