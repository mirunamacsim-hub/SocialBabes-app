export interface Collaborator {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  type: 'Internal' | 'External';
  department: string;
  location: string;
  address: string;
  tags: string[];
  collaborators: Collaborator[];
  image?: string;
  category?: string;
}

export type View = 'schedule' | 'detail' | 'create' | 'profile';
