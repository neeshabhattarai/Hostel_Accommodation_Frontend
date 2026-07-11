
import { jwtDecode } from 'jwt-decode'

export const JsonDecode = (token:string) => {
  const decoded = jwtDecode(token);
  return decoded;
}
