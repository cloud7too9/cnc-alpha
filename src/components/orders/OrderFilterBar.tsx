import type { OrderStatusFilter, OrderSortMode } from "../../modules/orders/orderHelpers";

type OrderFilterBarProps = {
  statusFilter: OrderStatusFilter;
  onStatusFilterChange: (value: OrderStatusFilter) => void;
  sortMode: OrderSortMode;
  onSortModeChange: (value: OrderSortMode) => void;
  searchTerm?: string;
  onSearchTermChange?: (value: string) => void;
  showSearch?: boolean;
};

export function OrderFilterBar({
  statusFilter,
  onStatusFilterChange,
  sortMode,
  onSortModeChange,
  searchTerm,
  onSearchTermChange,
  showSearch,
}: OrderFilterBarProps) {
  return (
    <div className="order-filter-bar" style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", marginBottom: "16px" }}>
      <select
        className="order-filter-select"
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value as OrderStatusFilter)}
      >
        <option value="all">Alle</option>
        <option value="open">Offen</option>
        <option value="sawn">Fertig gesägt</option>
        <option value="machining_done">Fertig bearbeitet</option>
        <option value="ready_for_shipping">Versandfertig</option>
      </select>

      <select
        className="order-sort-select"
        value={sortMode}
        onChange={(e) => onSortModeChange(e.target.value as OrderSortMode)}
      >
        <option value="deliveryDateAsc">Lieferdatum ↑</option>
        <option value="deliveryDateDesc">Lieferdatum ↓</option>
        <option value="updatedAtDesc">Zuletzt aktualisiert</option>
      </select>

      {showSearch && (
        <input
          className="order-search-input"
          type="text"
          placeholder="Suche..."
          value={searchTerm ?? ""}
          onChange={(e) => onSearchTermChange?.(e.target.value)}
        />
      )}
    </div>
  );
}
