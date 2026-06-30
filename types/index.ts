// ─── Utilisateur ───────────────────────────────────────────
export interface User {
  id: string
  phoneNumber: string
  fullName: string
  avatarUrl?: string
  createdAt: string
}

// ─── Groupe ────────────────────────────────────────────────
export type Frequency = 'weekly' | 'monthly'
export type TurnOrderMode = 'manual' | 'random' | 'seniority'

export interface Group {
  id: string
  name: string
  contributionAmount: number // en FCFA, entier
  frequency: Frequency
  currency: string           // 'XAF' par défaut
  maxMembers: number
  turnOrderMode: TurnOrderMode
  penaltyAmount: number
  penaltyGraceDays: number
  createdBy: string          // userId du gérant
  createdAt: string
}

// ─── Membre d'un groupe ────────────────────────────────────
export type MemberRole = 'manager' | 'member'

export interface GroupMember {
  id: string
  groupId: string
  user: User                 // objet complet, populé par le backend
  role: MemberRole
  turnPosition: number | null
  joinedAt: string
}

// ─── Cycle ─────────────────────────────────────────────────
export type CycleStatus = 'active' | 'completed'

export interface Cycle {
  id: string
  groupId: string
  cycleNumber: number
  status: CycleStatus
  startedAt: string
  completedAt?: string
}

// ─── Tour de bénéficiaire ──────────────────────────────────
export type TurnStatus = 'pending' | 'paid_out' | 'skipped'

export interface PayoutTurn {
  id: string
  cycleId: string
  beneficiary: GroupMember   // objet complet
  turnNumber: number
  scheduledDate: string
  status: TurnStatus
  payoutAmount?: number
  paidOutAt?: string
}

// ─── Transaction ───────────────────────────────────────────
export type TransactionType = 'contribution' | 'payout' | 'penalty'
export type TransactionStatus = 'pending' | 'confirmed' | 'failed'
export type PaymentMethod = 'mock' | 'cinetpay'

export interface Transaction {
  id: string
  groupId: string
  cycleId: string
  member: GroupMember        // objet complet
  type: TransactionType
  amount: number
  status: TransactionStatus
  paymentMethod: PaymentMethod
  externalReference?: string // futur ID CinetPay
  createdAt: string
}

// ─── Notification ──────────────────────────────────────────
export type NotificationType =
  | 'payment_reminder'
  | 'turn_announcement'
  | 'payment_confirmed'
  | 'payment_failed'

export interface Notification {
  id: string
  userId: string
  groupId: string
  type: NotificationType
  message: string
  read: boolean
  createdAt: string
}

// ─── Réponses API génériques ───────────────────────────────
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  error: string
  statusCode: number
}

// ─── Vues composites (données agrégées pour l'UI) ─────────
export interface GroupDashboard {
  group: Group
  members: GroupMember[]
  currentCycle: Cycle
  currentTurn: PayoutTurn
  transactions: Transaction[]
  totalCollected: number
  totalExpected: number
}