
export type AppRole = 'buyer' | 'investor' | 'agent';

export const ROLE_LABELS: Record<AppRole, string> = {
  buyer: 'Buyer',
  investor: 'Investor',
  agent: 'Agent',
};

export const ROLES: AppRole[] = ['buyer', 'investor', 'agent'];
