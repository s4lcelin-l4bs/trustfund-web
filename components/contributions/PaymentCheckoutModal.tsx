import { useState } from 'react'
import { toast } from 'sonner'
import { Contribution } from '@/types'
import { Button } from '@/components/ui/Button'
import { GlassModal } from '@/components/ui/GlassModal'
import { initiateCinetPay, simulatePayment } from '@/lib/api/payments'



interface Props {
  isOpen: boolean
  onClose: () => void
  contribution: Contribution | null
}

export function PaymentCheckoutModal({ isOpen, onClose, contribution }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)

  const handlePayment = async () => {
    if (!contribution) return
    setIsLoading(true)
    try {
      const data = await initiateCinetPay(contribution.organizationId, {
        contributionId: contribution.id
      })
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl // Redirection vers CinetPay
      } else {
        toast.error('URL de paiement introuvable.')
        setIsLoading(false)
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'initialisation du paiement.')
      setIsLoading(false)
    }
  }

  const handleSimulatePayment = async () => {
    if (!contribution) return
    setIsSimulating(true)
    try {
      const data = await simulatePayment(contribution.organizationId, {
        contributionId: contribution.id
      })
      if (data.success && data.transactionId) {
        // Rediriger comme le ferait CinetPay
        window.location.href = `/dashboard/contributions?ref=${data.transactionId}`
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de la simulation.')
      setIsSimulating(false)
    }
  }

  if (!contribution) return null

  const formattedDate = contribution.date 
    ? new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(contribution.date))
    : 'Date inconnue'

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title="Payer votre cotisation">
      <div className="mt-6 space-y-6">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Récapitulatif</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Montant</span>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                {new Intl.NumberFormat('fr-FR', { style: 'decimal', maximumFractionDigits: 0 }).format(contribution.amount)} FCFA
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Échéance</span>
              <span className="font-medium text-slate-900 dark:text-white">{formattedDate}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Statut actuel</span>
              <span className="font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded text-sm">
                À payer
              </span>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-800">
          <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium text-center">
            Vous serez redirigé(e) vers l'interface sécurisée de CinetPay pour finaliser votre paiement (Mobile Money, Carte Bancaire, etc).
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading || isSimulating}>
            Annuler
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleSimulatePayment} 
            isLoading={isSimulating}
            disabled={isLoading}
            className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
          >
            Simuler (Dev)
          </Button>
          <Button type="button" variant="glow" onClick={handlePayment} isLoading={isLoading} disabled={isSimulating}>
            Payer avec CinetPay
          </Button>
        </div>
      </div>
    </GlassModal>
  )
}
