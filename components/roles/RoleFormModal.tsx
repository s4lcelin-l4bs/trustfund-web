'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { GlassModal } from '@/components/ui/GlassModal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { PermissionSelector } from './PermissionSelector'
import { Skeleton } from '@/components/ui/Skeleton'
import { Role, CreateRoleInput, UpdateRoleInput, PermissionModuleGroup } from '@/types'
import { createRole, updateRole, getPermissionCatalog } from '@/lib/api/roles'

interface RoleFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (role: Role) => void
  organizationId: string
  role?: Role | null
}

export function RoleFormModal({ isOpen, onClose, onSuccess, organizationId, role = null }: RoleFormModalProps) {
  const isEditing = Boolean(role)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [permissionKeys, setPermissionKeys] = useState<string[]>([])
  const [nameError, setNameError] = useState('')
  const [groups, setGroups] = useState<PermissionModuleGroup[]>([])
  const [isCatalogLoading, setIsCatalogLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setName(role?.name || '')
    setDescription(role?.description || '')
    setPermissionKeys(role?.permissionKeys || [])
    setNameError('')

    setIsCatalogLoading(true)
    getPermissionCatalog(organizationId)
      .then(setGroups)
      .catch(() => toast.error('Erreur lors du chargement des permissions.'))
      .finally(() => setIsCatalogLoading(false))
  }, [isOpen, role, organizationId])

  async function handleSubmit() {
    if (!name.trim()) {
      setNameError('Nom requis')
      return
    }
    setIsLoading(true)
    try {
      const payload: CreateRoleInput | UpdateRoleInput = {
        name: name.trim(),
        description: description.trim() || undefined,
        permissionKeys,
      }
      const result =
        isEditing && role
          ? await updateRole(organizationId, role.id, payload)
          : await createRole(organizationId, payload as CreateRoleInput)
      toast.success(isEditing ? 'Rôle mis à jour' : 'Rôle créé avec succès')
      onSuccess(result)
      onClose()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur lors de l'enregistrement du rôle.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} className="max-w-xl" showParticles={false}>
      <div className="p-6 max-h-[85vh] overflow-y-auto space-y-5">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {isEditing ? 'Modifier le rôle' : 'Nouveau rôle'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Définissez le nom et les permissions associées
          </p>
        </div>

        <div className="space-y-4">
          <Input
            label="Nom du rôle"
            placeholder="Ex: Trésorier"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setNameError('')
            }}
            error={nameError}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Description (optionnel)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Rôle responsable de la gestion financière"
              className="w-full px-4 py-3 rounded-xl border border-white/40 dark:border-white/10 text-sm outline-none focus:border-emerald-500 dark:focus:border-emerald-500/50 transition-colors bg-white/40 dark:bg-slate-900/40 backdrop-blur-md text-slate-900 dark:text-white shadow-[inset_0_1px_1px_rgba(0,0,0,0.05)] resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Permissions</label>
            {isCatalogLoading ? (
              <div className="space-y-2">
                <Skeleton height={14} width="40%" />
                <Skeleton height={60} />
                <Skeleton height={60} />
              </div>
            ) : (
              <PermissionSelector groups={groups} selectedKeys={permissionKeys} onChange={setPermissionKeys} />
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="ghost" className="flex-1" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button variant="glow" className="flex-1" onClick={handleSubmit} isLoading={isLoading}>
            {isEditing ? 'Enregistrer' : 'Créer le rôle'}
          </Button>
        </div>
      </div>
    </GlassModal>
  )
}
