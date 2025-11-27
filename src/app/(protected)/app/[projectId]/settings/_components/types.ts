export interface ProjectData {
  name: string;
  description: string;
  key: string;
}

export interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
  joined: string;
}

export interface Invitation {
  id: number;
  email: string;
  role: string;
  invitedAt: string;
}

