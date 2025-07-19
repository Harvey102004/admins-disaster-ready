import { EvacuationCenterProps } from "../../types";

export function filterEvacuationData(
  data: EvacuationCenterProps[],
  brgy: string,
  status: string,
) {
  return data.filter((evac) => {
    // Filter by Barangay
    if (brgy !== "all" && evac.addedBy !== brgy) return false;

    // Filter by Status
    const cap = evac.capacity || 0;
    const evacuees = evac.current_evacuees || 0;
    const vacancy = cap - evacuees;
    const vacancyRate = (vacancy / cap) * 100;

    if (status === "plenty") return vacancyRate >= 50;
    if (status === "almostFull") return vacancy > 0 && vacancyRate < 50;
    if (status === "full") return vacancy <= 0;

    return true;
  });
}

export function sortEvacuationData(data: any[], sortBy: string) {
  return [...data].sort((a, b) => {
    const aVacancy = a.capacity - (a.current_evacuees ?? 0);
    const bVacancy = b.capacity - (b.current_evacuees ?? 0);

    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "addedBy":
        return (a.added_by || "").localeCompare(b.added_by || "");
      case "capacity_desc":
        return b.capacity - a.capacity;
      case "capacity_asc":
        return a.capacity - b.capacity;
      case "vacancy_desc":
        return (
          b.capacity - b.current_evacuees - (a.capacity - a.current_evacuees)
        );
      case "vacancy_asc":
        return (
          a.capacity - a.current_evacuees - (b.capacity - b.current_evacuees)
        );
      case "evacuees_desc":
        return (b.current_evacuees ?? 0) - (a.current_evacuees ?? 0);
      case "evacuees_asc":
        return (a.current_evacuees ?? 0) - (b.current_evacuees ?? 0);
      default:
        return 0;
    }
  });
}
