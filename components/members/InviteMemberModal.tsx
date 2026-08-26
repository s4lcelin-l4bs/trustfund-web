'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { GlassModal } from '@/components/ui/GlassModal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { MemberInviteInput } from '@/types'
import { inviteMember } from '@/lib/api/organizationMembers'

const CHANNELS: { value: MemberInviteInput['channel']; label: string; icon: string }[] = [
  { value: 'email', label: 'Email', icon: '✉️' },
  { value: 'sms', label: 'SMS', icon: '💬' },
  { value: 'whatsapp', label: 'WhatsApp', icon: '📱' },
]

interface InviteMemberModalProps {
  isOpen: boolean
  onClose: () => void
  organizationId: string
}

export function InviteMemberModal({ isOpen, onClose, organizationId }: InviteMemberModalProps) {
  const [channel, setChannel] = useState<MemberInviteInput['channel']>('email')
  const [destination, setDestination] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function handleClose() {
    setChannel('email')
    setDestination('')
    setMessage('')
    setError('')
    onClose()
  }

  async function handleSubmit() {
    if (!destination.trim()) {
      setError(channel === 'email' ? 'Email requis' : 'Numéro requis')
      return
    }
    setIsLoading(true)
    try {
      await inviteMember(organizationId, { channel, destination: destination.trim(), message: message.trim() || undefined })
      toast.success('Invitation envoyée avec succès')
      handleClose()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur lors de l'envoi de l'invitation.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <GlassModal isOpen={isOpen} onClose={handleClose} className="max-w-md">
      <div className="p-6 space-y-5">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Inviter un membre</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Envoyez une invitation à rejoindre l'organisation
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {CHANNELS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setChannel(opt.value)}
              className={
                'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-xs font-bold ' +
                (channel === opt.value
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                  : 'border-transparent bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800')
              }
            >
              <span className="text-2xl">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>

        <Input
          label={channel === 'email' ? 'Adresse email' : 'Numéro de téléphone'}
          placeholder={channel === 'email' ? 'membre@email.com' : '+237 6...'}
          value={destination}
          onChange={(e) => {
            setDestination(e.target.value)
            setError('')
          }}
          error={error}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Message personnalisé (optionnel)
          </label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Rejoignez notre organisation sur..."
            className="w-full px-4 py-3 rounded-xl border border-white/40 dark:border-white/10 text-sm outline-none focus:border-emerald-500 dark:focus:border-emerald-500/50 transition-colors bg-white/40 dark:bg-slate-900/40 backdrop-blur-md text-slate-900 dark:text-white shadow-[inset_0_1px_1px_rgba(0,0,0,0.05)] resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="ghost" className="flex-1" onClick={handleClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button variant="glow" className="flex-1" onClick={handleSubmit} isLoading={isLoading}>
            Envoyer l'invitation
          </Button>
        </div>
      </div>
    </GlassModal>
  )
}
