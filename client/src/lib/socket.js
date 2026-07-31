import { io } from 'socket.io-client'

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(
  /\/api\/?$/,
  '',
)

export function createSocket() {
  return io(API_ORIGIN, {
    autoConnect: true,
    transports: ['websocket', 'polling'],
  })
}

