export class NigeriaTimeUtils {
    static getNigerianTime() {
        return new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' }));
    }
    static formatNigerianTime(date) {
        return date.toLocaleString('en-NG', {
            timeZone: 'Africa/Lagos',
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    }
    static createNigerianDateTime(date, time) {
        return new Date(`${date}T${time} Africa/Lagos`);
    }
    static isInNigerianFuture(date) {
        const nigerianNow = this.getNigerianTime();
        return date > nigerianNow;
    }
}
