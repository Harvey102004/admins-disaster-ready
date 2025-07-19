export interface UserProps {
  id: string;
  role: number;
  email: string;
  barangay: string;
}

export interface EmptyUpdatesProps {
  text: string;
  icon: React.ReactNode;
  onclick: () => void;
}

// EVACUATION CENTER TYPES

export interface EvacuationCenterProps {
  id?: string | number;
  name: string;
  capacity: number;
  location: string;
  current_evacuees?: number;
  contact_person: string;
  contact_number: string;
  lat: number | null;
  long: number | null;
  addedBy?: string;
  chartStyle?: string;
}

export interface GetEvacuationProps {
  id?: string;
  name: string;
  location: string;
  capacity: string | number;
  current_evacuees: string | number;
  contact_person: string;
  contact_number: string;
  lat?: string | number;
  long?: string | number;
}

export interface GetEvacCard {
  id?: string;
  name: string;
  location: string;
  capacity: string | number;
  current_evacuees: string | number;
  onclick: () => void;
}

export interface GetEvacDetails {
  id: string;
  name: string;
  location: string;
  contact_person: number | string;
  contact_number: number | string;
  capacity: string | number;
  current_evacuees: string | number;
  lat?: string | number;
  long?: string | number;
  onclick: () => void;
}

export interface SubContact {
  id?: string | number;
  barangay: string;
  email: string;
  captain: string;
  secretary: string;
  facebook: string;
  landline: string;
  contact: string;
  lat: number;
  long: number;
}

// UPDATE AND NEWS TYPES

export interface TWeatherAdvisory {
  id: number;
  title: string;
  details: string;
  date_time: string;
  addedBy?: string;
}

export interface TRoadAdvisory {
  id: number;
  title: string;
  details: string;
  date_time: string;
  status: string;
  addedBy?: string;
}

export interface TDisasterAdvisory {
  id: number;
  disaster_type: string;
  title: string;
  details: string;
  date_time: string;
  image_url: string;
  addedBy?: string;
}

export interface TCommunity {
  id: number;
  title: string;
  details: string;
  date_time: string;
  addedBy?: string;
}
