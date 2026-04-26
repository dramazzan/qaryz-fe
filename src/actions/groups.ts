"use server";

import { redirect } from "next/navigation";

import { actionError, refreshAppPaths } from "@/actions/common";
import { backendJson } from "@/lib/backend-api";
import type { ActionState } from "@/lib/types";

type GroupCreateResponse = {
  id: string;
};

type GroupJoinResponse = {
  groupId: string;
};

export async function createGroup(_: ActionState, formData: FormData): Promise<ActionState> {
  let redirectTo: string | null = null;

  try {
    const group = await backendJson<GroupCreateResponse>("/api/groups", {
      method: "POST",
      body: {
        name: formData.get("name"),
        currencyCode: String(formData.get("currencyCode") ?? "").toUpperCase()
      }
    });

    refreshAppPaths(["/", "/groups", "/add"]);
    redirectTo = `/groups/${group.id}`;
  } catch (error) {
    return actionError(error);
  }

  redirect(redirectTo);
}

export async function joinGroupByCode(_: ActionState, formData: FormData): Promise<ActionState> {
  let redirectTo: string | null = null;

  try {
    const result = await backendJson<GroupJoinResponse>("/api/groups/join", {
      method: "POST",
      body: {
        inviteCode: String(formData.get("inviteCode") ?? "").toUpperCase()
      }
    });

    refreshAppPaths(["/", "/groups", `/groups/${result.groupId}`, "/add"]);
    redirectTo = `/groups/${result.groupId}`;
  } catch (error) {
    return actionError(error);
  }

  redirect(redirectTo);
}

export async function rotateGroupInvite(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const groupId = String(formData.get("groupId") ?? "");

    await backendJson(`/api/groups/${groupId}/invite/rotate`, {
      method: "POST",
      body: {}
    });

    refreshAppPaths(["/groups", `/groups/${groupId}`]);
    return { status: "idle" };
  } catch (error) {
    return actionError(error);
  }
}

export async function updateGroupSettings(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const groupId = String(formData.get("groupId") ?? "");

    await backendJson(`/api/groups/${groupId}/settings`, {
      method: "PATCH",
      body: {
        name: formData.get("name"),
        currencyCode: String(formData.get("currencyCode") ?? "").toUpperCase()
      }
    });

    refreshAppPaths(["/groups", `/groups/${groupId}`, "/add", "/"]);
    return { status: "idle" };
  } catch (error) {
    return actionError(error);
  }
}

export async function updateGroupMemberRole(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const groupId = String(formData.get("groupId") ?? "");
    const memberId = String(formData.get("memberId") ?? "");

    await backendJson(`/api/groups/${groupId}/members/${memberId}/role`, {
      method: "PATCH",
      body: {
        role: formData.get("role")
      }
    });

    refreshAppPaths([`/groups/${groupId}`]);
    return { status: "idle" };
  } catch (error) {
    return actionError(error);
  }
}

export async function removeGroupMember(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const groupId = String(formData.get("groupId") ?? "");
    const memberId = String(formData.get("memberId") ?? "");

    await backendJson(`/api/groups/${groupId}/members/${memberId}`, {
      method: "DELETE"
    });

    refreshAppPaths(["/groups", `/groups/${groupId}`, "/add"]);
    return { status: "idle" };
  } catch (error) {
    return actionError(error);
  }
}
