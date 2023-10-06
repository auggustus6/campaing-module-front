export interface Channel {
  id: string;
  instanceName: string;
  wppApiInstanceId: string;
  createdAt: string;
  state: 'connected' | 'disconnected';
}
