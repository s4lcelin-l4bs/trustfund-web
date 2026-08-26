// ─── Utilisateur ───────────────────────────────────────────
export interface User {
  id: string
  phoneNumber: string
  fullName: string
  avatarUrl?: string
  createdAt: string
}

// ─── Groupes retirés ───────────────────────────────────────

// ─── Notification ──────────────────────────────────────────
export type NotificationType =
  | 'payment_reminder'
  | 'turn_announcement'
  | 'payment_confirmed'
  | 'payment_failed'

export interface Notification {
  id: string
  userId: string
  organizationId: string
  organizationName?: string
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

// ─── Vues composites retirées ──────────────────────────────

// ─── Pagination & requêtes de liste génériques ─────────────
export interface PaginatedResult<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface ListQueryParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// ─── Organisation ──────────────────────────────────────────
export type OrganizationStatus = 'active' | 'inactive' | 'archived'

export interface Organization {
  id: string
  name: string
  logoUrl?: string
  description?: string
  currency: string
  country: string
  city: string
  status: OrganizationStatus
  memberCount: number
  createdAt: string
  updatedAt?: string
}

export interface CreateOrganizationInput {
  name: string
  logoUrl?: string
  description?: string
  currency: string
  country: string
  city: string
  cycleName: string
  cycleFrequency: 'weekly' | 'monthly'
  cycleStartDate: string
  cycleEndDate: string
  cycleExpectedAmount: number
  cycleBeneficiariesCount: number
  cycleTurnsCount: number
}

export interface UpdateOrganizationInput extends Partial<CreateOrganizationInput> {
  status?: OrganizationStatus
}

export interface OrganizationListParams extends ListQueryParams {
  status?: OrganizationStatus | 'all'
  country?: string
}

// ─── Membre d'organisation ─────────────────────────────────
export type MemberGender = 'male' | 'female'
export type OrganizationMemberStatus = 'active' | 'inactive' | 'suspended'

export interface OrganizationMember {
  id: string
  organizationId: string
  photoUrl?: string
  firstName: string
  lastName: string
  gender: MemberGender
  phone: string
  whatsapp?: string
  email?: string
  address?: string
  profession?: string
  matricule: string
  profession2?: string
  joinedAt: string
  status: OrganizationMemberStatus
  turnPosition?: number
  currentContribution?: Contribution | null
}

export interface CreateOrganizationMemberInput {
  photoUrl?: string
  firstName: string
  lastName: string
  gender: MemberGender
  phone: string
  whatsapp?: string
  email?: string
  address?: string
  profession?: string
  matricule: string
  joinedAt: string
}

export interface UpdateOrganizationMemberInput extends Partial<CreateOrganizationMemberInput> {
  status?: OrganizationMemberStatus
  roleId?: string | null
}

export interface OrganizationMemberListParams extends ListQueryParams {
  status?: OrganizationMemberStatus | 'all'
  gender?: MemberGender | 'all'
}

export interface MemberInviteInput {
  channel: 'email' | 'sms' | 'whatsapp'
  destination: string
  message?: string
}

export interface MemberInviteResult {
  inviteId: string
  channel: MemberInviteInput['channel']
  destination: string
  sentAt: string
}

export interface MemberImportResult {
  totalRows: number
  importedCount: number
  failedCount: number
  errors: { row: number; message: string }[]
}

// ─── Rôles & permissions ────────────────────────────────────
export interface Permission {
  key: string
  label: string
  module: string
}

export interface PermissionModuleGroup {
  module: string
  moduleLabel: string
  permissions: Permission[]
}

export interface Role {
  id: string
  organizationId: string
  name: string
  description?: string
  permissionKeys: string[]
  isSystem: boolean
  memberCount: number
  createdAt: string
  updatedAt?: string
}

export interface CreateRoleInput {
  name: string
  description?: string
  permissionKeys: string[]
}

export interface UpdateRoleInput extends Partial<CreateRoleInput> {}

export interface RoleListParams extends ListQueryParams {}

// ─── Cycles d'organisation ──────────────────────────────────
export type OrganizationCycleStatus = 'draft' | 'active' | 'closed' | 'archived'

export interface OrganizationCycle {
  id: string
  organizationId: string
  name: string
  startDate: string
  endDate: string
  status: OrganizationCycleStatus
  frequency: 'weekly' | 'monthly'
  expectedAmount: number
  collectedAmount: number
  beneficiariesCount: number
  turnsCount: number
  nextTurnOrder?: string[]
  createdAt: string
  updatedAt?: string
}

export interface CreateOrganizationCycleInput {
  name: string
  startDate: string
  endDate: string
  frequency: 'weekly' | 'monthly'
  expectedAmount: number
  beneficiariesCount: number
  turnsCount: number
}

export interface UpdateOrganizationCycleInput extends Partial<CreateOrganizationCycleInput> {}

export interface OrganizationCycleListParams extends ListQueryParams {
  status?: OrganizationCycleStatus | 'all'
}

// ─── Cotisations (Contributions) ────────────────────────────
export type ContributionStatus = 'paid' | 'partial' | 'late' | 'advance' | 'pending'
export type ContributionPaymentMethod = 'cash' | 'bank_transfer' | 'mobile_money' | 'other'

export interface Contribution {
  id: string
  organizationId: string
  groupId?: string
  cycleId?: string
  memberId: string
  amount: number
  date: string
  time: string
  paymentMethod: ContributionPaymentMethod
  comment?: string
  reference?: string
  status: ContributionStatus
  createdAt: string
  updatedAt?: string
  member?: OrganizationMember
}

export interface CreateContributionInput {
  memberId: string
  groupId?: string
  cycleId?: string
  amount: number
  date: string
  time: string
  paymentMethod: ContributionPaymentMethod
  comment?: string
  reference?: string
}

export interface UpdateContributionInput extends Partial<CreateContributionInput> {
  status?: ContributionStatus
}

export interface ContributionListParams extends ListQueryParams {
  status?: ContributionStatus | 'all'
  memberId?: string
  groupId?: string
  cycleId?: string
}

// ─── Dépenses (Expenses) ────────────────────────────────────
export type ExpenseStatus = 'pending' | 'approved' | 'rejected' | 'paid'

export interface Expense {
  id: string
  organizationId: string
  categoryId: string
  amount: number
  date: string
  receiptUrl?: string
  description?: string
  status: ExpenseStatus
  createdAt: string
  updatedAt?: string
}

export interface CreateExpenseInput {
  categoryId: string
  amount: number
  date: string
  receiptUrl?: string
  description?: string
}

export interface UpdateExpenseInput extends Partial<CreateExpenseInput> {
  status?: ExpenseStatus
}

export interface ExpenseListParams extends ListQueryParams {
  status?: ExpenseStatus | 'all'
  categoryId?: string
}

// ─── Pénalités (Penalties) ──────────────────────────────────
export type PenaltyStatus = 'pending' | 'paid' | 'cancelled'

export interface Penalty {
  id: string
  organizationId: string
  memberId: string
  motif: string
  amount: number
  status: PenaltyStatus
  paymentDate?: string
  createdAt: string
  updatedAt?: string
}

export interface CreatePenaltyInput {
  memberId: string
  motif: string
  amount: number
}

export interface UpdatePenaltyInput extends Partial<CreatePenaltyInput> {
  status?: PenaltyStatus
  paymentDate?: string
}

export interface PenaltyListParams extends ListQueryParams {
  status?: PenaltyStatus | 'all'
  memberId?: string
}

// ─── Amendes (Fines) ────────────────────────────────────────
export type FineStatus = 'pending' | 'paid' | 'cancelled'

export interface Fine {
  id: string
  organizationId: string
  memberId: string
  motif: string
  amount: number
  status: FineStatus
  paymentDate?: string
  createdAt: string
  updatedAt?: string
}

export interface CreateFineInput {
  memberId: string
  motif: string
  amount: number
}

export interface UpdateFineInput extends Partial<CreateFineInput> {
  status?: FineStatus
  paymentDate?: string
}

export interface FineListParams extends ListQueryParams {
  status?: FineStatus | 'all'
  memberId?: string
}

// ─── Prêts (Loans) ──────────────────────────────────────────
export type LoanStatus = 'requested' | 'approved' | 'rejected' | 'disbursed' | 'active' | 'completed' | 'defaulted'

export interface Loan {
  id: string
  organizationId: string
  memberId: string
  amountRequested: number
  amountApproved?: number
  interestRate: number
  durationMonths: number
  status: LoanStatus
  requestDate: string
  validationDate?: string
  disbursementDate?: string
  createdAt: string
  updatedAt?: string
}

export interface CreateLoanInput {
  memberId: string
  amountRequested: number
  interestRate: number
  durationMonths: number
  requestDate: string
}

export interface UpdateLoanInput extends Partial<CreateLoanInput> {
  amountApproved?: number
  status?: LoanStatus
  validationDate?: string
  disbursementDate?: string
}

export interface LoanListParams extends ListQueryParams {
  status?: LoanStatus | 'all'
  memberId?: string
}

// ─── Epargne (Savings) ──────────────────────────────────────
export type SavingsTransactionType = 'deposit' | 'withdrawal' | 'interest'

export interface SavingsAccount {
  id: string
  organizationId: string
  memberId: string
  balance: number
  createdAt: string
  updatedAt?: string
}

export interface SavingsTransaction {
  id: string
  savingsAccountId: string
  type: SavingsTransactionType
  amount: number
  date: string
  description?: string
  createdAt: string
}

export interface CreateSavingsTransactionInput {
  memberId: string
  type: SavingsTransactionType
  amount: number
  date: string
  description?: string
}

export interface SavingsTransactionListParams extends ListQueryParams {
  memberId?: string
  type?: SavingsTransactionType | 'all'
}

// ─── Calendrier (Calendar) ──────────────────────────────────
export type CalendarEventType = 'contribution' | 'meeting' | 'distribution' | 'other'

export interface CalendarEvent {
  id: string
  organizationId: string
  title: string
  type: CalendarEventType
  date: string
  startTime?: string
  endTime?: string
  description?: string
  location?: string
  createdAt: string
}

export interface CalendarListParams {
  startDate: string
  endDate: string
  type?: CalendarEventType | 'all'
}

// ─── Rapports & Comptabilité (Reports & Accounting) ─────────
export interface ReportExportParams {
  type: 'pdf' | 'excel' | 'csv'
  startDate?: string
  endDate?: string
  module?: string
}

export interface AccountingJournalEntry {
  id: string
  date: string
  reference: string
  accountCode: string
  accountName: string
  debit: number
  credit: number
  description: string
}

export interface AccountingBalance {
  accountCode: string
  accountName: string
  initialDebit: number
  initialCredit: number
  periodDebit: number
  periodCredit: number
  finalDebit: number
  finalCredit: number
}
