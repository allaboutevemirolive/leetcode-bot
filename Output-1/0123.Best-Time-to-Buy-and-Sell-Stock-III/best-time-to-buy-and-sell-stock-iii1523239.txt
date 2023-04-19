// https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/solutions/1523239/rust-11ms-beat-100-with-explainations/
impl Solution {
    pub fn max_profit(prices: Vec<i32>) -> i32 {
        let len = prices.len();
        assert!(len > 0);
        let mut first_buy_price = prices[0];
        let mut first_transaction_profit = 0;
        let mut total_buy_cost = first_buy_price;
        let mut total_profit = 0;
        // we want to max two profit variable while keep buy price/cost to minimum
        for index in 1..len {
            let price = prices[index];
            // max first transaction profit
            let current_first_buy_price = first_buy_price.min(price);
            let current_first_transaction_profit = first_transaction_profit.max(price - first_buy_price);
            // max total transaction profit
            // as max total_profit=max second price - min second buy price + (max first buy price - min first buy price) before max second price occurred
            // so we need to subtract first_transaction_profit from second buy price to record first_transaction_profit
            // which is max total_profit=max second price - (min second buy price - (max first buy price - min first buy price) before max second price occurred)
            let current_total_buy_cost = total_buy_cost.min(price - first_transaction_profit);
            let current_total_profit = total_profit.max(price - total_buy_cost);
            // update
            first_buy_price = current_first_buy_price;
            first_transaction_profit = current_first_transaction_profit;
            total_profit = current_total_profit;
            total_buy_cost = current_total_buy_cost;
        }

        total_profit
    }
}