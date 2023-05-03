import { Socket, io } from 'socket.io-client';

export class SocketIOController {
  onConnectionErrorCallbacks: any[] = [];
  connectedCallbacks: any[] = [];
  pendingSubscriptions: { [key: string]: any } = {};
  io: Socket;
  token?: string;

  constructor (
    protected uri : string = process.env.VUE_APP_WS_BASE_URL || window.location.href,
    protected path : string = process.env.VUE_APP_WS_SOCKET_PATH || '/socket.io',
    protected options : {[key: string]: any} = {}
  ) {
    this.io = io(this.uri, {
      ...this.options,
      transports: ['websocket', 'polling'],
      path: this.path,
      autoConnect: false
    });
  }

  public init () {
    this.io = io(this.uri, {
      ...this.options,
      transports: ['websocket', 'polling'],
      path: this.path,
      autoConnect: false
    });
  }

  setAuthToken (token: string) {
    this.token = token;
    if (this.io.connected) {
      this.io.disconnect();
    }
    this.options = {
      ...this.options,
      auth: { token: token },
      query: { token: token }
    };
    this.init();
    this.boot();
  }

  onConnectionError (callback: () => void) {
    this.onConnectionErrorCallbacks.push(callback);
  }

  onConnected (callback: () => void) {
    this.connectedCallbacks.push(callback);
    if (this.io.connected) {
      callback();
    }
  }

  off (eventName: string) {
    if (this.pendingSubscriptions[eventName]) {
      delete this.pendingSubscriptions[eventName];
    }
    this.io.off(eventName);
  }

  emit (eventName: string, data: any) {
    this.io.emit(eventName, data);
  }

  async joinRoom (roomName: string | string[]) {
    return new Promise((resolve, reject) => {
      const i: string[] = typeof roomName === 'string' ? [roomName] : roomName;
      this.io.emit('join-rooms', [...i], (result: any) => {
        console.log('joined', roomName, result);
        resolve(result);
      });
    });
  }

  on (eventName: string, callback: any) {
    this.pendingSubscriptions[eventName] = callback;
    if (!this.io.connected) {
      return;
    }
    this.io.on(eventName, callback);
  }

  close () {
    if (!this.io.connected) {
      return;
    }
    this.io.disconnect();
  }

  reset () {
    this.close();
    this.onConnectionErrorCallbacks = [];
    this.pendingSubscriptions = {};
    this.connectedCallbacks = [];
    this.token = '';
    this.options = {};
  }

  boot () {
    if (this.io.connected) {
      return;
    }

    this.io.connect();

    this.io.on('connect_error', (err) => {
      this.onConnectionErrorCallbacks.forEach((item) => {
        item(err);
      });
    });

    this.io.on('connect', () => {
      console.log('connected', this.io.connected);
      this.connectedCallbacks.forEach((item) => {
        item();
      });

      Object.keys(this.pendingSubscriptions).forEach((evt) => {
        this.io.on(evt, this.pendingSubscriptions[evt]);
      });
    });

    if (!this.io.connected) {
      this.io.connect();
    }
  }
}

export default new SocketIOController();
