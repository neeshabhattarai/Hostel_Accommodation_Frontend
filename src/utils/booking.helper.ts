export function calcNights(checkIn: string, checkOut: string): number {
    if (!checkIn || !checkOut) return 0;
  
    const diff =
      new Date(checkOut).getTime() - new Date(checkIn).getTime();
  
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }
  
  export function today(): string {
    return new Date().toISOString().split("T")[0];
  }