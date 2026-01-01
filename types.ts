
export interface Property {
  id: string;
  address: string;
  units: number;
  occupancy: number;
  monthlyRevenue: number;
  maintenanceCosts: number;
  imageUrl: string;
}

export interface Photo {
  id: string;
  url: string;
  timestamp: string;
  description?: string;
}

export interface DamageReport {
  tenantId: string;
  photos: Photo[];
  lastUpdated: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  isCompleted: boolean;
}

export interface TenantChecklist {
  tenantId: string;
  type: 'MOVE_IN' | 'MOVE_OUT';
  items: ChecklistItem[];
  lastUpdated: string;
}

export interface Tenant {
  id: string;
  name: string;
  unit: string;
  email: string;
  phone?: string;
  status: 'Active' | 'Delinquent' | 'Notice Given' | 'Inactive';
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  property: string;
  income: string;
  status: 'Pending' | 'Check Running' | 'Completed' | 'Rejected';
  report?: string;
}

export interface Lease {
  id: string;
  tenantId: string;
  tenantName: string;
  unit: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  documentUrl: string;
}

export interface ClientPortfolio {
  id: string;
  name: string;
  totalProperties: number;
  tenants: Tenant[];
  leases: Lease[];
}

export interface TenantNotice {
  id: string;
  type: 'LATE_RENT' | 'MAINTENANCE' | 'GENERAL' | 'LEASE_RENEWAL';
  content: string;
  date: string;
  status: 'sent' | 'draft';
}

export interface OwnerReport {
  month: string;
  totalRent: number;
  expenses: number;
  netIncome: number;
  vacancyRate: number;
}

export type ViewState = 'HOME' | 'TENANT_PORTAL' | 'OWNER_PORTAL' | 'APPLICATION' | 'TENANT_LOGIN' | 'OWNER_LOGIN';
