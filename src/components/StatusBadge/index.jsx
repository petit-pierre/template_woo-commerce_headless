const labels = {
  pending: "En attente de paiement",
  paid: "Payée",
  processing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

export default function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{labels[status] ?? status}</span>;
}
