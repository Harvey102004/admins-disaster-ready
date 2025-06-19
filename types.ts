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

export interface WeatherProps {
  title: string;
  details: string;
  dateTime: string;
}

export interface RoadProps {
  title: string;
  details: string;
  dateTime: string;
  status: string;
}

export interface DisasterProps {
  disasterType: string;
  title: string;
  details: string;
  dateTime: string;
  image: File | null | string;
}

export interface CommunityNoticeProps {
  title: string;
  details: string;
  dateTime: string;
}

export interface GetWeatherProps {
  id?: string;
  title: string;
  details: string;
  date_time: string;
  onclick?: () => void;
  onedit?: () => void;
}

export interface GetRoadProps {
  id?: string;
  title: string;
  details: string;
  date_time: string;
  status: string;
  onclick: () => void;
  onedit: () => void;
}

export interface GetCommunityProps {
  id?: string;
  title: string;
  details: string;
  date_time: string;
  onclick: () => void;
  onedit: () => void;
}

export interface GetDisasterProps {
  id?: string;
  img_path?: string;
  title: string;
  details: string;
  date_time: string;
  disaster_type: string;
  onclick: () => void;
  onedit: () => void;
}

export interface GetDisasterProps {
  id?: string;
  image_url?: string;
  title: string;
  details: string;
  date_time: string;
  disaster_type: string;
}

export interface GetCommunityProps {
  id?: string;
  title: string;
  details: string;
  date_time: string;
}

export interface GetAdvisoryDetails {
  id: string | undefined;
  onclick: () => void;
  triggerRefresh: () => void;
  onEdit: () => void;
}

export interface AdvisoryEditProps {
  id: string | undefined;
  onclick: () => void;
  triggerRefresh: () => void;
}

export interface EvacuationCenterProps {
  evac_name: string;
  evac_capacity: number;
  evac_location: string;
  evac_evacuees?: number;
  evac_contact_person: string;
  evac_contact_number: string;
}
