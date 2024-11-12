import Chart from '@/pages/trade/components/Chart';
import OrderBook from '@/pages/trade/components/OrderBook';
import OrderForm from '@/pages/trade/components/order_form/OrderForm';
import TradeHeader from '@/pages/trade/components/trade_header/TradeHeader';
import { useParams } from 'react-router-dom';
import { useSSETicker } from '@/hooks/useSSETicker';
import { useMemo } from 'react';
function Trade() {
	const { market } = useParams();
	const marketCode = useMemo(() => (market ? [{ market }] : []), [market]);
	const { sseData } = useSSETicker(marketCode);
	if (!market) return;
	if (!sseData) return;
	const currentPrice = sseData[market]?.trade_price;
	return (
		<div className="w-full h-full gap-2">
			<TradeHeader market={market} sseData={sseData} />
			<div className="flex gap-2 min-h-[700px]">
				<Chart />
				<OrderBook />
				<OrderForm currentPrice={currentPrice} />
			</div>
		</div>
	);
}

export default Trade;
