import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationService from './NotificationService';

export type TimerType = 'cooking' | 'mindful_eating' | 'breathing';

export interface PersistedTimer {
	id: string;
	type: TimerType;
	startedAt: number; // epoch ms
	durationMs: number;
	pausedAt?: number; // epoch ms
	accumPauseMs: number;
	metadata?: Record<string, any>;
}

type TimerStore = Record<string, PersistedTimer>;
type TimerNotifications = Record<string, string[]>; // timerId -> notification ids

const TIMERS_KEY = '@mm_timers';
const TIMER_NOTIFS_KEY = '@mm_timer_notification_ids';

class TimerService {
	private static instance: TimerService;

	static getInstance(): TimerService {
		if (!TimerService.instance) {
			TimerService.instance = new TimerService();
		}
		return TimerService.instance;
	}

	async listTimers(): Promise<TimerStore> {
		try {
			const raw = await AsyncStorage.getItem(TIMERS_KEY);
			return raw ? JSON.parse(raw) : {};
		} catch {
			return {};
		}
	}

	private async saveTimers(store: TimerStore): Promise<void> {
		await AsyncStorage.setItem(TIMERS_KEY, JSON.stringify(store));
	}

	async startTimer(params: Omit<PersistedTimer, 'accumPauseMs' | 'startedAt'> & { startedAt?: number }): Promise<PersistedTimer> {
		const store = await this.listTimers();
		const timer: PersistedTimer = {
			id: params.id,
			type: params.type,
			durationMs: params.durationMs,
			metadata: params.metadata,
			startedAt: params.startedAt ?? Date.now(),
			accumPauseMs: 0,
		};
		store[timer.id] = timer;
		await this.saveTimers(store);
		return timer;
	}

	async stopTimer(id: string): Promise<void> {
		const store = await this.listTimers();
		delete store[id];
		await this.saveTimers(store);
		await this.cancelScheduledNotifications(id);
	}

	async getTimer(id: string): Promise<PersistedTimer | undefined> {
		const store = await this.listTimers();
		return store[id];
	}

	computeRemainingMs(timer: PersistedTimer, now: number = Date.now()): number {
		const elapsed = now - timer.startedAt - (timer.accumPauseMs || 0);
		return Math.max(0, timer.durationMs - elapsed);
	}

	async scheduleCompletionNotification(timerId: string, fireAt: number, content?: { title: string; body: string; data?: any }): Promise<string | null> {
		try {
			const id = await NotificationService.scheduleLocal({
				title: content?.title ?? 'Timer complete',
				body: content?.body ?? 'Your timer has finished.',
				data: { type: 'timer_complete', timerId, ...(content?.data ?? {}) },
			}, new Date(fireAt));
			await this.trackNotificationId(timerId, id);
			return id;
		} catch {
			return null;
		}
	}

	private async trackNotificationId(timerId: string, notificationId: string): Promise<void> {
		const raw = await AsyncStorage.getItem(TIMER_NOTIFS_KEY);
		const map: TimerNotifications = raw ? JSON.parse(raw) : {};
		map[timerId] = [...(map[timerId] ?? []), notificationId];
		await AsyncStorage.setItem(TIMER_NOTIFS_KEY, JSON.stringify(map));
	}

	async cancelScheduledNotifications(timerId: string): Promise<void> {
		try {
			const raw = await AsyncStorage.getItem(TIMER_NOTIFS_KEY);
			const map: TimerNotifications = raw ? JSON.parse(raw) : {};
			const ids = map[timerId] ?? [];
			await Promise.all(ids.map((id) => NotificationService.cancel(id)));
			delete map[timerId];
			await AsyncStorage.setItem(TIMER_NOTIFS_KEY, JSON.stringify(map));
		} catch {}
	}
}

export default TimerService.getInstance();

