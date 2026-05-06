import { supabase } from "@/clients/supabase";

export interface SnapshotPayload {
  documents: string;
  specs: string;
}

export interface SnapshotRow {
  id: string;
  created_at: string;
  data: SnapshotPayload;
}

export const publishSnapshot = async (): Promise<void> => {
  const payload: SnapshotPayload = {
    documents: localStorage.getItem("cpg:documents") ?? "[]",
    specs: localStorage.getItem("cpg:specs") ?? "[]",
  };

  const { data, error } = await supabase
    .from("extractor-snapshots")
    .insert({ data: payload })
    .select("created_at")
    .single();
  if (error) throw new Error(error.message);
  localStorage.setItem("cpg:last-sync", data.created_at);
};

export const fetchLatestSnapshot = async (): Promise<SnapshotRow> => {
  const { data, error } = await supabase
    .from("extractor-snapshots")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) throw new Error(error.message);
  return data as SnapshotRow;
};

export const pullSnapshot = async (): Promise<void> => {
  const row = await fetchLatestSnapshot();
  localStorage.setItem("cpg:documents", row.data.documents);
  localStorage.setItem("cpg:specs", row.data.specs);
  localStorage.setItem("cpg:last-sync", row.created_at);
};
