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
  image: File | null;
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
  onclick: () => void;
}

export interface GetRoadProps {
  id?: string;
  title: string;
  details: string;
  date_time: string;
  status: string;
  onclick: () => void;
}

export interface GetCommunityProps {
  id?: string;
  title: string;
  details: string;
  date_time: string;
  onclick: () => void;
}

export interface GetDisasterProps {
  id?: string;
  img_path?: string;
  title: string;
  details: string;
  date_time: string;
  disaster_type: string;
  onclick: () => void;
}

export interface GetDisasterProps {
  id?: string;
  img_path?: string;
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
}
