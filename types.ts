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
