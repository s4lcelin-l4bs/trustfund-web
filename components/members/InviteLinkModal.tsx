'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { GlassModal } from '@/components/ui/GlassModal'
import { Button } from '@/components/ui/Button'
import { generateOrganizationInvite, type GenerateInviteResult } from '@/lib/api/invitations'

interface InviteLinkModalProps {
  isOpen: boolean
  onClose: () => void
  organizationId: string
}

export function InviteLinkModal({ isOpen, onClose, organizationId }: InviteLinkModalProps) {
  const [invite, setInvite] = useState<GenerateInviteResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCopying, setIsCopying] = useState(false)

  async function handleGenerateLink() {
    setIsLoading(true)
    try {
      const result = await generateOrganizationInvite(organizationId)
      setInvite(result)
      toast.success('Lien d’invitation généré avec succès.')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Impossible de générer le lien d’invitation.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCopy() {
    if (!invite) return
    setIsCopying(true)
    try {
      await navigator.clipboard.writeText(invite.inviteUrl)
      toast.success('Lien copié dans le presse-papier.')
    } catch {
      toast.error('Impossible de copier le lien. Veuillez le copier manuellement.')
    } finally {
      setIsCopying(false)
    }
  }

  function handleClose() {
    setInvite(null)
    setIsLoading(false)
    setIsCopying(false)
    onClose()
  }

  return (
    <GlassModal isOpen={isOpen} onClose={handleClose} className="max-w-lg">
      <div className="p-6 space-y-5">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Lien d’invitation</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Générer un lien partagé pour inviter de nouveaux membres. Les utilisateurs devront se connecter avant de rejoindre.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-950/80 p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Validité</p>
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            7 jours ou jusqu’à expiration du lien.
          </p>
        </div>

        {invite ? (
          <div className="space-y-3">
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-900/80 p-4">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">URL d’invitation</label>
              <div className="mt-2 break-words text-sm text-slate-900 dark:text-slate-100">
                {invite.inviteUrl}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button variant="glow" className="w-full" onClick={handleCopy} isLoading={isCopying}>
                Copier le lien
              </Button>
              <Button variant="ghost" className="w-full" onClick={handleClose}>
                Fermer
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Cliquez sur le bouton ci-dessous pour générer un lien unique d’invitation. Vous pourrez ensuite le partager avec les personnes que vous souhaitez inviter.
            </p>
            <Button variant="glow" className="w-full" onClick={handleGenerateLink} isLoading={isLoading}>
              Générer le lien d’invitation
            </Button>
            <Button variant="ghost" className="w-full" onClick={handleClose} disabled={isLoading}>
              Annuler
            </Button>
          </div>
        )}
      </div>
    </GlassModal>
  )
}
