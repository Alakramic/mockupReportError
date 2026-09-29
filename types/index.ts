export interface PC {
  id: string;
  aula: string;
  numero: number;
  estado: string;
}

export interface TicketInfo {
  id: string;
  pcId: string;
  aula: string;
  falla: string;
  hora: string;
  isOffline?: boolean;
}

export interface DefectItem {
  id: string;
  title: string;
  subtitle: string;
  iconName: 'power' | 'mouse' | 'wifi' | 'monitor';
  iconColor: string;
  bgColor: string;
}