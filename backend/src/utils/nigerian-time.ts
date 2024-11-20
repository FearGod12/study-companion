export class NigeriaTimeUtils {
  static getNigerianTime(): Date {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' }));
  }

  static formatNigerianTime(date: Date): string {
    return date.toLocaleString('en-NG', {
      timeZone: 'Africa/Lagos',
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  static createNigerianDateTime(date: string, time: string): Date {
    return new Date(`${date}T${time} Africa/Lagos`);
  }

  static isInNigerianFuture(date: Date): boolean {
    const nigerianNow = this.getNigerianTime();
    return date > nigerianNow;
  }
}
