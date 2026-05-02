interface SelectAllBannerProps {
  selectAllMode: boolean;
  pageCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearSelectAll: () => void;
}

export function SelectAllBanner({
  selectAllMode,
  pageCount,
  totalCount,
  onSelectAll,
  onClearSelectAll,
}: SelectAllBannerProps) {
  if (selectAllMode) {
    return (
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-2 text-sm text-gray-600">
        All {totalCount} specs are selected.{" "}
        <button
          type="button"
          className="font-medium text-gray-900 underline underline-offset-2 hover:text-black cursor-pointer"
          onClick={onClearSelectAll}
        >
          Clear selection
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-6 py-2 text-sm text-gray-600">
      All {pageCount} specs on this page are selected.{" "}
      <button
        type="button"
        className="font-medium text-gray-900 underline underline-offset-2 hover:text-black cursor-pointer"
        onClick={onSelectAll}
      >
        Select all {totalCount} specs
      </button>
    </div>
  );
}
