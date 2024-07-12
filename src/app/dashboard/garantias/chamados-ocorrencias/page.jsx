import { DemmandTable } from "./_components/demmand-table";
import { UpsertDemmand } from "./_components/upsert-demmand";

export default function Page() {
  return (
    <div className="h-screen w-full flex flex-col p-10">
      <div className="flex w-full justify-end">
        <UpsertDemmand />
      </div>
      <div className="flex w-full justify-end">
        <DemmandTable />
      </div>
    </div>
  );
}
