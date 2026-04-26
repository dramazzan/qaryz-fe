import type { ActivityEventType, ActivityKind } from "@/lib/types";

export type GroupRole = "OWNER" | "ADMIN" | "MEMBER";
export type DirectDebtStatus = "OPEN" | "SETTLED";
export type ExpenseParticipantStatus = "OPEN" | "SETTLED";

export type ApiUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
};

export type BalanceEntry = {
  id: string;
  sourceId: string;
  sourceType: ActivityKind;
  eventType: ActivityEventType;
  title: string;
  counterpartyId: string;
  counterpartyName: string;
  counterpartyImage?: string | null;
  debtorName: string;
  creditorName: string;
  amountMinor: number;
  currencyCode: string;
  direction: "owedToYou" | "youOwe";
  date: Date;
  groupName?: string;
  link: string;
};

export type CurrencyTotal = {
  currencyCode: string;
  amountMinor: number;
};

export type CounterpartyBalance = {
  counterpartyId: string;
  counterpartyName: string;
  counterpartyImage?: string | null;
  currencyCode: string;
  netAmountMinor: number;
};

export type BalanceSummary = {
  owedToYou: CurrencyTotal[];
  youOwe: CurrencyTotal[];
  net: CurrencyTotal[];
  counterparties: CounterpartyBalance[];
};

export type DashboardData = {
  groups: Array<{
    id: string;
    name: string;
    currencyCode: string;
    role: GroupRole;
  }>;
  entries: BalanceEntry[];
  summary: BalanceSummary;
};

export type GroupsData = Array<{
  id: string;
  name: string;
  currencyCode: string;
  role: GroupRole;
  memberCount: number;
  inviteCode: string | null;
  lastExpenseAt: Date | null;
}>;

export type GroupDetailData = {
  id: string;
  name: string;
  currencyCode: string;
  viewerRole: GroupRole;
  inviteCode: string | null;
  hasExpenses: boolean;
  members: Array<{
    id: string;
    userId: string;
    role: GroupRole;
    name: string;
    email: string;
    image: string | null;
  }>;
  expenses: Array<{
    id: string;
    title: string;
    amountMinor: number;
    currencyCode: string;
    expenseDate: Date;
    payer: ApiUser;
    participants: Array<{ id: string }>;
  }>;
} | null;

export type RecentContact = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

export type Friend = RecentContact & {
  createdAt: Date;
};

export type FriendsData = Friend[];

export type AddPageData = {
  groups: Array<{
    id: string;
    name: string;
    currencyCode: string;
    members: Array<{
      id: string;
      name: string;
      image?: string | null;
    }>;
  }>;
  recentContacts: RecentContact[];
};

export type HistoryItem = {
  id: string;
  kind: ActivityKind;
  eventType: ActivityEventType;
  title: string;
  subtitle: string;
  date: Date;
  link: string;
  amountMinor: number;
  currencyCode: string;
};

export type ExpenseDetail = {
  id: string;
  payerId: string;
  title: string;
  note: string | null;
  amountMinor: number;
  currencyCode: string;
  expenseDate: Date;
  createdAt: Date;
  receiptUrl: string | null;
  group: {
    id: string;
    name: string;
  };
  payer: ApiUser;
  participants: Array<{
    id: string;
    userId: string;
    shareMinor: number;
    status: ExpenseParticipantStatus;
    settledAt: Date | null;
    user: ApiUser;
  }>;
} | null;

export type DirectDebtDetail = {
  id: string;
  lenderId: string | null;
  borrowerId: string | null;
  externalCounterpartyName: string | null;
  externalCounterpartyEmail: string | null;
  title: string;
  note: string | null;
  amountMinor: number;
  currencyCode: string;
  debtDate: Date;
  status: DirectDebtStatus;
  settledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  lender: ApiUser | null;
  borrower: ApiUser | null;
} | null;

export type ProfileData = {
  user: ApiUser | null;
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    readAt: Date | null;
    createdAt: Date;
  }>;
  memberships: Array<{
    id: string;
  }>;
  unreadCount: number;
};
