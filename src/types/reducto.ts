export interface ReductoFieldValue<T = string> {
  value: T;
  citations: ReductoCitation[];
}

export interface ReductoCitation {
  type:
    | "Table"
    | "Text"
    | "List"
    | "List Item"
    | "Image"
    | "Section Header"
    | "Header"
    | "Title";
  content: string;
  bbox: ReductoBBox;
  confidence: "high" | "medium" | "low";
  granular_confidence?: {
    extract_confidence: number | null;
    parse_confidence: number;
  };
  image_url?: string | null;
  chart_data?: unknown | null;
  extra?: unknown | null;
  parentBlock?: {
    type: string;
    content: string;
    bbox: ReductoBBox;
  };
}

export interface ReductoBBox {
  left: number;
  top: number;
  width: number;
  height: number;
  page: number;
  original_page?: number;
}
