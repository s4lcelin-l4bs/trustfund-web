'use client'

import { useState, useEffect } from 'react'
import { motion, Reorder } from 'framer-motion'
import { toast } from 'sonner'
import { getOrganizationMembers } from '@/lib/api/organizationMembers'
import { updateTurnOrder } from '@/lib/api/organizationCycles'
import { OrganizationCycle, OrganizationMember } from '@/types'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { useMyPermissions } from '@/lib/hooks/useMyPermissions'

interface TurnOrderManagerProps {
  cycle: OrganizationCycle
  organizationId: string
  onUpdate: (newOrder: string[]) => void
}

export function TurnOrderManager({ cycle, organizationId, onUpdate }: TurnOrderManagerProps) {
  const { hasPermission, isOwner } = useMyPermissions(organizationId)
  const canManage = hasPermission('MANAGE_CYCLES') || isOwner

  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [order, setOrder] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Has the order been modified from the backend version?
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    async function init() {
      try {
        const { items } = await getOrganizationMembers(organizationId, { pageSize: 200, status: 'active' })
        setMembers(items)
        
        // If we have an existing order, use it. Otherwise, populate with active members.
        if (cycle.nextTurnOrder && cycle.nextTurnOrder.length > 0) {
          // Keep only IDs that exist in our members list, and append new members at the end
          const memberIds = items.map(m => m.id)
          const validOrder = cycle.nextTurnOrder.filter(id => memberIds.includes(id))
          const missingIds = memberIds.filter(id => !validOrder.includes(id))
          setOrder([...validOrder, ...missingIds])
        } else {
          setOrder(items.map(m => m.id))
        }
      } catch (err) {
        toast.error('Erreur lors du chargement des membres.')
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [organizationId, cycle.nextTurnOrder])

  const moveUp = (index: number) => {
    if (index === 0) return
    const newOrder = [...order]
    const temp = newOrder[index - 1]
    newOrder[index - 1] = newOrder[index]
    newOrder[index] = temp
    setOrder(newOrder)
    setIsDirty(true)
  }

  const moveDown = (index: number) => {
    if (index === order.length - 1) return
    const newOrder = [...order]
    const temp = newOrder[index + 1]
    newOrder[index + 1] = newOrder[index]
    newOrder[index] = temp
    setOrder(newOrder)
    setIsDirty(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateTurnOrder(organizationId, cycle.id, order)
      toast.success('Ordre de passage enregistré')
      setIsDirty(false)
      onUpdate(order)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'enregistrement')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="animate-pulse h-32 bg-white/20 dark:bg-white/5 rounded-xl"></div>
  }

  if (members.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-sm text-slate-500">Aucun membre actif disponible.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Modifiez l'ordre pour les prochains décaissements.
        </p>
        {isDirty && canManage && (
          <Button variant="glow" onClick={handleSave} isLoading={isSaving} size="sm">
            Sauvegarder l'ordre
          </Button>
        )}
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto pr-2 no-scrollbar">
        <Reorder.Group axis="y" values={order} onReorder={(v) => { setOrder(v); setIsDirty(true) }}>
          {order.map((memberId, index) => {
            const member = members.find(m => m.id === memberId)
            if (!member) return null

            return (
              <Reorder.Item
                key={member.id}
                value={member.id}
                className={`flex items-center justify-between p-3 mb-2 rounded-xl border border-white/20 dark:border-white/5 ${
                  canManage ? 'bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-800/60 cursor-grab active:cursor-grabbing' : 'bg-white/20 dark:bg-slate-900/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-400">
                    {index + 1}
                  </div>
                  <Avatar initials={`${member.firstName[0]}${member.lastName[0]}`} src={member.photoUrl} size={32} />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{member.matricule}</p>
                  </div>
                </div>

                {canManage && (
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={(e) => { e.preventDefault(); moveUp(index) }}
                      disabled={index === 0}
                      className="p-1 rounded bg-white/50 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-600 disabled:opacity-30 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                    </button>
                    <button
                      onClick={(e) => { e.preventDefault(); moveDown(index) }}
                      disabled={index === order.length - 1}
                      className="p-1 rounded bg-white/50 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-600 disabled:opacity-30 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                  </div>
                )}
              </Reorder.Item>
            )
          })}
        </Reorder.Group>
      </div>
    </div>
  )
}
