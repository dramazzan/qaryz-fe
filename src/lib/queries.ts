import { backendGet } from "@/lib/backend-api";
import type {
  AddPageData,
  DashboardData,
  DirectDebtDetail,
  ExpenseDetail,
  FriendsData,
  GroupDetailData,
  GroupsData,
  HistoryItem,
  PlatformUsersData,
  ProfileData,
  RecentContact,
  BalanceEntry
} from "@/lib/api-types";

export async function getUnreadNotificationCount(_userId: string) {
  return backendGet<number>("/api/notifications/unread-count");
}

export async function listDashboardBalances(_userId: string) {
  return backendGet<{ entries: BalanceEntry[]; summary: DashboardData["summary"] }>("/api/dashboard/balances");
}

export async function getDashboardData(_userId: string) {
  return backendGet<DashboardData>("/api/dashboard");
}

export async function getGroupsData(_userId: string) {
  return backendGet<GroupsData>("/api/groups");
}

export async function getFriendsData(_userId: string) {
  return backendGet<FriendsData>("/api/friends");
}

export async function getPlatformUsersData(_userId: string) {
  return backendGet<PlatformUsersData>("/api/users");
}

export async function getGroupDetailData(_userId: string, groupId: string) {
  return backendGet<GroupDetailData>(`/api/groups/${groupId}`);
}

export async function getRecentContacts(_userId: string) {
  return backendGet<RecentContact[]>("/api/contacts/recent");
}

export async function getAddPageData(_userId: string) {
  return backendGet<AddPageData>("/api/add");
}

export async function listHistory(_userId: string) {
  return backendGet<HistoryItem[]>("/api/history");
}

export async function getExpenseDetail(_userId: string, expenseId: string) {
  return backendGet<ExpenseDetail>(`/api/activity/expenses/${expenseId}`);
}

export async function getDirectDebtDetail(_userId: string, debtId: string) {
  return backendGet<DirectDebtDetail>(`/api/activity/debts/${debtId}`);
}

export async function getProfileData(_userId: string) {
  return backendGet<ProfileData>("/api/profile");
}
