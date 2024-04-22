import { ThrownError } from "../types/type";

export const logger = (e: ThrownError) => {
  if (process.env.NODE_ENV === 'development') {
    const code = e?.code || "Unknown error";
    const message = e?.message || "Unknown message";
    
    console.log(`Error: ${code} - ${message}`);
  }
}
