import { cookies } from "next/headers";

import { AddEntryPanel } from "@/components/forms/add-entry-panel";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/auth-helpers";
import { getAddPageData } from "@/lib/queries";

export default async function AddPage() {
  const user = await requireUser();
  const data = await getAddPageData(user.id);
  const lastGroupId = cookies().get("qaryz_last_group_id")?.value;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Добавить"
        description="Быстро добавьте общий расход или личный долг в удобном мобильном потоке."
      />

      <AddEntryPanel
        groups={data.groups}
        contacts={data.recentContacts}
        defaultGroupId={lastGroupId}
      />
    </div>
  );
}
