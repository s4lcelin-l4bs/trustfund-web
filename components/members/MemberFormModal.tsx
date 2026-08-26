'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { GlassModal } from '@/components/ui/GlassModal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import {
  OrganizationMember,
  CreateOrganizationMemberInput,
  UpdateOrganizationMemberInput,
  MemberGender,
} from '@/types'
import { createOrganizationMember, updateOrganizationMember } from '@/lib/api/organizationMembers'

interface MemberFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (member: OrganizationMember) => void
  organizationId: string
  member?: OrganizationMember | null
}

interface FormState {
  firstName: string
  lastName: string
  gender: MemberGender
  phone: string
  whatsapp: string
  email: string
  address: string
  profession: string
  matricule: string
  photoUrl: string
  joinedAt: string
}

function emptyForm(): FormState {
  return {
    firstName: '',
    lastName: '',
    gender: 'male',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    profession: '',
    matricule: '',
    photoUrl: '',
    joinedAt: new Date().toISOString().slice(0, 10),
  }
}

export function MemberFormModal({
  isOpen,
  onClose,
  onSuccess,
  organizationId,
  member = null,
}: MemberFormModalProps) {
  const isEditing = Boolean(member)
  const [form, setForm] = useState<FormState>(emptyForm())
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setForm(
        member
          ? {
              firstName: member.firstName,
              lastName: member.lastName,
              gender: member.gender,
              phone: member.phone,
              whatsapp: member.whatsapp || '',
              email: member.email || '',
              address: member.address || '',
              profession: member.profession || '',
              matricule: member.matricule,
              photoUrl: member.photoUrl || '',
              joinedAt: member.joinedAt.slice(0, 10),
            }
          : emptyForm()
      )
      setErrors({})
    }
  }, [isOpen, member])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  function validate(): boolean {
    const newErrors: Partial<FormState> = {}
    if (!form.firstName.trim()) newErrors.firstName = 'Prénom requis'
    if (!form.lastName.trim()) newErrors.lastName = 'Nom requis'
    if (!form.phone.trim()) newErrors.phone = 'Téléphone requis'
    if (!form.matricule.trim()) newErrors.matricule = 'Matricule requis'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Email invalide'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setIsLoading(true)
    try {
      const payload: CreateOrganizationMemberInput | UpdateOrganizationMemberInput = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        gender: form.gender,
        phone: form.phone.trim(),
        whatsapp: form.whatsapp.trim() || undefined,
        email: form.email.trim() || undefined,
        address: form.address.trim() || undefined,
        profession: form.profession.trim() || undefined,
        matricule: form.matricule.trim(),
        photoUrl: form.photoUrl.trim() || undefined,
        joinedAt: form.joinedAt,
      }
      const result =
        isEditing && member
          ? await updateOrganizationMember(organizationId, member.id, payload)
          : await createOrganizationMember(organizationId, payload as CreateOrganizationMemberInput)
      toast.success(isEditing ? 'Membre mis à jour' : 'Membre ajouté avec succès')
      onSuccess(result)
      onClose()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur lors de l'enregistrement du membre.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} className="max-w-lg">
      <div className="p-6 max-h-[85vh] overflow-y-auto space-y-5">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {isEditing ? 'Modifier le membre' : 'Nouveau membre'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            {isEditing ? 'Mettez à jour les informations du membre' : "Renseignez les informations du membre"}
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Prénom"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              error={errors.firstName}
            />
            <Input
              label="Nom"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              error={errors.lastName}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Sexe</label>
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: 'male', label: 'Masculin' },
                { value: 'female', label: 'Féminin' },
              ] as { value: MemberGender; label: string }[]).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm({ ...form, gender: opt.value })}
                  className={
                    'py-2.5 rounded-xl border-2 transition-all text-sm font-bold ' +
                    (form.gender === opt.value
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                      : 'border-transparent bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800')
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Téléphone"
              name="phone"
              placeholder="+237 6..."
              value={form.phone}
              onChange={handleChange}
              error={errors.phone}
            />
            <Input
              label="WhatsApp"
              name="whatsapp"
              placeholder="+237 6..."
              value={form.whatsapp}
              onChange={handleChange}
            />
          </div>

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="membre@email.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />

          <Input label="Adresse" name="address" value={form.address} onChange={handleChange} />

          <div className="grid grid-cols-2 gap-3">
            <Input label="Profession" name="profession" value={form.profession} onChange={handleChange} />
            <Input
              label="Matricule"
              name="matricule"
              value={form.matricule}
              onChange={handleChange}
              error={errors.matricule}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date d'entrée"
              name="joinedAt"
              type="date"
              value={form.joinedAt}
              onChange={handleChange}
            />
            <Input label="Photo (URL)" name="photoUrl" placeholder="https://..." value={form.photoUrl} onChange={handleChange} />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="ghost" className="flex-1" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button variant="glow" className="flex-1" onClick={handleSubmit} isLoading={isLoading}>
            {isEditing ? 'Enregistrer' : 'Ajouter le membre'}
          </Button>
        </div>
      </div>
    </GlassModal>
  )
}
