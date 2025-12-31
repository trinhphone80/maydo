
export interface Order {
  id: string;
  name: string;
  phone: string;
  address: string;
  note: string;
  product: string;
  createdAt: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  paymentUrl?: string;
}

export interface AppConfig {
  heroImageUrl: string;
  specsImageUrl: string;
  thumbImageUrl: string;
  galleryImageUrls: string[];
  googleSheetUrl: string;
  notificationEmail: string;
  bankId: string;
  accountNo: string;
  accountName: string;
  paymentLink: string;   
  paymentQrUrl: string;  
  // Các trường cấu hình cho PayOS API
  payosClientId: string;
  payosApiKey: string;
  payosChecksumKey: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum AdminView {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  SETTINGS = 'SETTINGS',
  CLOSED = 'CLOSED'
}
