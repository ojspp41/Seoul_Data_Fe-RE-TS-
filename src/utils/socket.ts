import { CompatClient, Stomp, IFrame, messageCallbackType } from '@stomp/stompjs';

let stompClient: CompatClient | null = null;

export const connectStomp = (): Promise<CompatClient> => {
  return new Promise((resolve, reject) => {
    if (stompClient && stompClient.connected) {
      resolve(stompClient);
      return;
    }

    const accessToken = localStorage.getItem('access_token');
    const webSocketUrl = 'ws://13.125.224.67:8080/ws/websocket';

    stompClient = Stomp.over(() => new WebSocket(webSocketUrl));
    stompClient.reconnectDelay = 5000;

    stompClient.connect(
      { Authorization: `Bearer ${accessToken}` },
      () => {
        console.log('✅ WebSocket 연결 성공');
        resolve(stompClient!);
      },
      (error: IFrame) => {
        console.error('❌ WebSocket 연결 실패', error);
        reject(error);
      }
    );
  });
};

export const disconnectStomp = () => {
  if (stompClient && stompClient.connected) {
    stompClient.disconnect(() => {
      console.log('🔌 WebSocket 연결 해제');
    });
  }
};

export const subscribeToRoom = (
  roomId: string | number,
  callback: messageCallbackType
) => {
  if (!stompClient) return;

  return stompClient.subscribe(`/sub/chat/room/${roomId}`, callback);
};

export const sendChatMessage = (
  roomId: number,
  content: string,
  type: 'TEXT' | 'IMAGE' | 'FILE' = 'TEXT',
  tempS3Key: string | null = null
) => {
  if (!stompClient || !stompClient.connected) {
    console.error('❌ WebSocket 연결되지 않음');
    return;
  }

  const messagePayload = {
    chatRoomId: roomId,
    content,
    type,
    tempS3Key: tempS3Key ?? '',
  };

  stompClient.send('/app/chat/message', {}, JSON.stringify(messagePayload));
};
