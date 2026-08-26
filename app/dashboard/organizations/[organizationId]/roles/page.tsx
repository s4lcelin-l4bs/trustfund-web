'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { getRoles, deleteRole, getPermissionCatalog } from '@/lib/api/roles'
import { Role, PaginatedResult, PermissionModuleGroup } from '@/types'
import { RoleFormModal } from '@/components/roles/RoleFormModal'
import { MemberRoleAssignModal } from '@/components/roles/MemberRoleAssignModal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Skeleton } from '@/components/ui/Skeleton'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { useMyPermissions } from '@/lib/hooks/useMyPermissions'
import { staggerContainer, fadeInUp } from '@/lib/animations'

const PAGE_SIZE = 9

// Map permission key → human-readable label (populated from catalog)
function buildPermissionLabels(groups: PermissionModuleGroup[]): Record<string, { label: string; module: string }> {
  const map: Record<string, { label: string; module: string }> = {}
  groups.forEach((g) => g.permissions.forEach((p) => { map[p.key] = { label: p.label, module: g.moduleLabel } }))
  return map
}

export default function RolesPage() {
  const router = useRouter()
  const params = useParams<{ organizationId: string }>()
  const organizationId = params.organizationId

  const { isLoading: isPermissionsLoading, hasPermission } = useMyPermissions(organizationId)

  useEffect(() => {
    if (!isPermissionsLoading && !hasPermission('MANAGE_ROLES')) {
      toast.error("Vous n'avez pas accès à la gestion des rôles.")
      router.replace(`/dashboard/organizations/${organizationId}`)
    }
  }, [isPermissionsLoading, hasPermission, organizationId, router])

  const [result, setResult] = useState<PaginatedResult<Role> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [catalog, setCatalog] = useState<PermissionModuleGroup[]>([])
  const [permissionLabels, setPermissionLabels] = useState<Record<string, { label: string; module: string }>>({})

  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [deletingRole, setDeletingRole] = useState<Role | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const debouncedSearch = useDebounce(search, 350)

  const fetchRoles = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getRoles(organizationId, {
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch || undefined,
      })
      setResult(data)
      // Auto-select first role when no selection
      if (data.items.length > 0) {
        setSelectedRole((prev) => prev || data.items[0])
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors du chargement des rôles.')
    } finally {
      setIsLoading(false)
    }
  }, [organizationId, page, debouncedSearch])

  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  // Load permission catalog once
  useEffect(() => {
    if (!organizationId) return
    getPermissionCatalog(organizationId)
      .then((groups) => {
        setCatalog(groups)
        setPermissionLabels(buildPermissionLabels(groups))
      })
      .catch(() => {})
  }, [organizationId])

  // Keep selectedRole in sync after refresh
  useEffect(() => {
    if (selectedRole && result) {
      const fresh = result.items.find((r) => r.id === selectedRole.id)
      if (fresh) setSelectedRole(fresh)
    }
  }, [result])

  async function handleDelete() {
    if (!deletingRole) return
    setIsDeleting(true)
    try {
      await deleteRole(organizationId, deletingRole.id)
      toast.success('Rôle supprimé')
      if (selectedRole?.id === deletingRole.id) setSelectedRole(null)
      setDeletingRole(null)
      fetchRoles()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression.')
    } finally {
      setIsDeleting(false)
    }
  }

  const roles = result?.items || []

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <button
          onClick={() => router.push(`/dashboard/organizations/${organizationId}`)}
          className="p-2.5 rounded-xl glass-btn hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex-shrink-0"
        >
          <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Rôles &amp; Permissions</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            {result ? `${result.total} rôle${result.total > 1 ? 's' : ''}` : ''}
          </p>
        </div>
        <Button
          variant="glow"
          className="flex-shrink-0"
          onClick={() => {
            setEditingRole(null)
            setIsFormOpen(true)
          }}
        >
          <span className="hidden sm:inline">Nouveau rôle</span>
          <span className="sm:hidden">+</span>
        </Button>
      </motion.div>

      {/* Layout 2 colonnes sur desktop, empilé sur mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">

        {/* Colonne gauche : liste des rôles */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <Input
              placeholder="Rechercher un rôle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
                </svg>
              }
            />
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="glass-card p-4 space-y-2">
                    <Skeleton height={16} width="60%" />
                    <Skeleton height={12} width="40%" />
                  </div>
                ))}
              </motion.div>
            ) : roles.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8 text-center">
                <span className="text-4xl mb-3 block">🔐</span>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  {debouncedSearch ? 'Aucun résultat trouvé' : 'Aucun rôle créé'}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-2"
              >
                {roles.map((role, index) => (
                  <RoleListItem
                    key={role.id}
                    role={role}
                    index={index}
                    isSelected={selectedRole?.id === role.id}
                    onClick={() => setSelectedRole(role)}
                    onEdit={() => { setEditingRole(role); setIsFormOpen(true) }}
                    onDelete={() => setDeletingRole(role)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {!isLoading && result && result.totalPages > 1 && (
            <Pagination page={page} totalPages={result.totalPages} onChange={setPage} />
          )}
        </div>

        {/* Colonne droite : détail du rôle sélectionné */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {!selectedRole ? (
              <motion.div
                key="no-selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card p-10 text-center h-full flex flex-col items-center justify-center min-h-[300px]"
              >
                <span className="text-5xl mb-4 block">👆</span>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Sélectionnez un rôle pour voir ses permissions</p>
              </motion.div>
            ) : (
              <motion.div
                key={selectedRole.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* En-tête du rôle */}
                <div className="glass-card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{selectedRole.name}</h2>
                        {selectedRole.isSystem && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 ring-1 ring-blue-600/20">
                            Système
                          </span>
                        )}
                      </div>
                      {selectedRole.description && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{selectedRole.description}</p>
                      )}
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">
                        {selectedRole.memberCount} membre{selectedRole.memberCount > 1 ? 's' : ''} · {selectedRole.permissionKeys.length} permission{selectedRole.permissionKeys.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    {!selectedRole.isSystem && (
                      <div className="flex flex-col gap-2 flex-shrink-0 sm:items-end">
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setEditingRole(selectedRole); setIsFormOpen(true) }}
                            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg px-3 py-2 transition-colors"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => setDeletingRole(selectedRole)}
                            className="text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg px-3 py-2 transition-colors"
                          >
                            Supprimer
                          </button>
                        </div>
                        <Button
                          size="sm"
                          variant="glow"
                          onClick={() => setIsAssignOpen(true)}
                        >
                          Attribuer aux membres
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Permissions par module */}
                <div className="glass-card p-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
                    Permissions attribuées
                  </h3>
                  {selectedRole.isSystem ? (
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                      <span className="text-2xl">⭐</span>
                      <div>
                        <p className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">Toutes les permissions</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">Le propriétaire dispose de tous les droits.</p>
                      </div>
                    </div>
                  ) : selectedRole.permissionKeys.length === 0 ? (
                    <p className="text-sm text-slate-400 dark:text-slate-500 italic text-center py-4">
                      Aucune permission assignée à ce rôle.
                    </p>
                  ) : (
                    <PermissionsByModule
                      permissionKeys={selectedRole.permissionKeys}
                      catalog={catalog}
                      permissionLabels={permissionLabels}
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <RoleFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={(updated) => {
          fetchRoles()
          setSelectedRole(updated)
        }}
        organizationId={organizationId}
        role={editingRole}
      />

      {selectedRole && (
        <MemberRoleAssignModal
          isOpen={isAssignOpen}
          onClose={() => setIsAssignOpen(false)}
          onSuccess={() => {
            fetchRoles()
          }}
          organizationId={organizationId}
          role={selectedRole}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(deletingRole)}
        onClose={() => setDeletingRole(null)}
        onConfirm={handleDelete}
        variant="danger"
        title="Supprimer ce rôle ?"
        description="Les membres associés à ce rôle perdront les permissions correspondantes. Cette action est irréversible."
        confirmLabel="Supprimer"
        isLoading={isDeleting}
      />
    </div>
  )
}

// ─── Composants internes ──────────────────────────────────────

function RoleListItem({
  role,
  index,
  isSelected,
  onClick,
  onEdit,
  onDelete,
}: {
  role: Role
  index: number
  isSelected: boolean
  onClick: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      onClick={onClick}
      className={[
        'relative rounded-2xl p-4 cursor-pointer transition-all duration-200 border',
        isSelected
          ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-300/60 dark:border-emerald-600/30 shadow-md'
          : 'glass-card border-transparent hover:border-white/40 dark:hover:border-white/10',
      ].join(' ')}
    >
      {isSelected && (
        <div className="absolute left-0 top-3 bottom-3 w-1 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-r-full" />
      )}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{role.name}</p>
            {role.isSystem && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 flex-shrink-0">
                Système
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            {role.permissionKeys.length} perm. · {role.memberCount} membre{role.memberCount > 1 ? 's' : ''}
          </p>
        </div>
        {!role.isSystem && (
          <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={onEdit}
              title="Modifier"
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={onDelete}
              title="Supprimer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function PermissionsByModule({
  permissionKeys,
  catalog,
  permissionLabels,
}: {
  permissionKeys: string[]
  catalog: PermissionModuleGroup[]
  permissionLabels: Record<string, { label: string; module: string }>
}) {
  if (catalog.length === 0) {
    // Fallback: afficher les clés brutes en badges si le catalogue n'est pas encore chargé
    return (
      <div className="flex flex-wrap gap-2">
        {permissionKeys.map((key) => (
          <span key={key} className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {key}
          </span>
        ))}
      </div>
    )
  }

  // Regrouper les permissions par module
  return (
    <div className="space-y-4">
      {catalog.map((group) => {
        const granted = group.permissions.filter((p) => permissionKeys.includes(p.key))
        if (granted.length === 0) return null
        return (
          <div key={group.module}>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              {group.moduleLabel}
            </p>
            <div className="flex flex-wrap gap-2">
              {granted.map((p) => (
                <span
                  key={p.key}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-200 dark:ring-emerald-800"
                >
                  <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {p.label}
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
