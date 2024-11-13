import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { map, takeUntil, filter } from 'rxjs/operators';
import { CoinDataUpdaterService } from './coin-data-updater.service';

@Injectable()
export class SseService implements OnModuleDestroy {
	private coinTickerStream$ = new Subject<any>();
	private orderbookStream$ = new Subject<any>();
	private coinTickerDestroy$ = new Subject<void>();
	private orderBookDestroy$ = new Subject<void>();

	constructor(
		private readonly coinDataUpdaterService: CoinDataUpdaterService,
	) {}

	coinTickerSendEvent(data: any) {
		this.coinTickerStream$.next(data);
	}
	orderbookSendEvent(data: any) {
		this.orderbookStream$.next(data);
	}

	initPriceStream(coins, dto: Function) {
		const events: MessageEvent[] = [];
		if (coins && typeof coins === 'string') {
			coins = [coins];
		}
		coins.forEach(async (coin) => {
			let coinLatestInfo = this.coinDataUpdaterService.getCoinLatestInfo()
			while (coinLatestInfo.size === 0 || coinLatestInfo.get(coin) === undefined) {
				await new Promise((resolve) => setTimeout(resolve, 100));
				coinLatestInfo = this.coinDataUpdaterService.getCoinLatestInfo();
			}

			const initData = coinLatestInfo.get(coin);
			const setDto = dto(initData);
			const msgEvent = new MessageEvent('price-update', {
				data: JSON.stringify(setDto),
			}) as MessageEvent;

			events.push(msgEvent);
		});

		return events;
	}
	getPriceUpdatesStream(coins, dto: Function): Observable<MessageEvent> {
		return this.coinTickerStream$.asObservable().pipe(
			takeUntil(this.coinTickerDestroy$),
			filter((data) => coins.includes(data.code)),
			map((data) => {
				const setDto = dto(data);
				return new MessageEvent('price-update', {
					data: JSON.stringify(setDto),
				}) as MessageEvent;
			}),
		);
	}

	getOrderbookUpdatesStream(coins, dto: Function): Observable<MessageEvent> {
		return this.orderbookStream$.asObservable().pipe(
			takeUntil(this.orderBookDestroy$),
			filter((data) => coins.includes(data.code)),
			map((data) => {
				const setDto = dto(data);
				return new MessageEvent('orderbook-update', {
					data: JSON.stringify(setDto),
				}) as MessageEvent;
			}),
		);
	}
	onModuleDestroy() {
		this.coinTickerDestroy$.next();
		this.orderBookDestroy$.next();
	}
}
