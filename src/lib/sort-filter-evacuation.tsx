import { EvacuationCenterProps } from "../../types";

export function filterEvacuationData(
  data: EvacuationCenterProps[],
  brgy: string,
  status: string,
) {
  return data.filter((evac) => {
    const evacBarangay = evac.created_by?.split(",")[1]?.trim() || "";

 
    if (brgy !== "all" && evacBarangay.toLowerCase() !== brgy.toLowerCase()) {
      return false;
    }


    const cap = evac.capacity || 0;
    const evacuees = evac.current_evacuees || 0;
    const vacancy = cap - evacuees;
    const vacancyRate = cap > 0 ? (vacancy / cap) * 100 : 0;

    if (status === "plenty") return vacancyRate >= 50;
    if (status === "almostFull") return vacancy > 0 && vacancyRate < 50;
    if (status === "full") return vacancy <= 0;

    return true;
  });
}

export function sortEvacuationData(data: any[], sortBy: string) {

  let currentUsername: string | null = null;
  if (typeof window !== "undefined") {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        currentUsername = parsed.username || null;
      }
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
    }
  }

  return [...data].sort((a, b) => {
    const aVacancy = a.capacity - (a.current_evacuees ?? 0);
    const bVacancy = b.capacity - (b.current_evacuees ?? 0);

    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);

      case "addedBy": {
   
        const aCreator = (a.created_by || "").split(",")[0].trim();
        const bCreator = (b.created_by || "").split(",")[0].trim();

  
        const aIsCurrentUser = currentUsername && aCreator === currentUsername;
        const bIsCurrentUser = currentUsername && bCreator === currentUsername;

        if (aIsCurrentUser && !bIsCurrentUser) return -1; 
        if (!aIsCurrentUser && bIsCurrentUser) return 1; 

        return aCreator.localeCompare(bCreator);
      }

      case "capacity_desc":
        return b.capacity - a.capacity;
      case "capacity_asc":
        return a.capacity - b.capacity;

      case "vacancy_desc":
        return bVacancy - aVacancy;
      case "vacancy_asc":
        return aVacancy - bVacancy;

      case "evacuees_desc":
        return (b.current_evacuees ?? 0) - (a.current_evacuees ?? 0);
      case "evacuees_asc":
        return (a.current_evacuees ?? 0) - (b.current_evacuees ?? 0);

      default:
        return 0;
    }
  });
}
