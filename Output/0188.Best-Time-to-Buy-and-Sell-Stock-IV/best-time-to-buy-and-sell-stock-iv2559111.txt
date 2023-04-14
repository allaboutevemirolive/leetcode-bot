// https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/solutions/2559111/rust-bottom-up-dp/
impl Solution {
    pub fn max_profit(k: i32, prices: Vec<i32>) -> i32 {
        let mut dp: Vec<Vec<i32>> = Vec::new();
        let num_prices = prices.len();

        for i in 0..num_prices {
            dp.push(Vec::new());
            for _ in 0..=k {
                dp[i].push(0);
            }
        }

        let mut max_profit = 0;

        for i in 1..num_prices {
            for k_i in 0..=k {
                let current_profit = if k_i > 0 {
                    let mut cur_max_profit = 0;
                    for j in 0..i { // Back scan array and consider all transactions ending on day i
                        cur_max_profit = i32::max(
                            cur_max_profit,
                            prices[i] - prices[j] + dp[j as usize][(k_i - 1) as usize], // Add profit made before using k - 1 transactions
                        );
                    }
                    i32::max(cur_max_profit, dp[(i - 1) as usize][k_i as usize]) // Also consider making no transaction
                } else {
                    dp[(i - 1) as usize][k_i as usize]
                };

                max_profit = i32::max(max_profit, current_profit);
                dp[i as usize][k_i as usize] = current_profit;
            }
        }

        max_profit
    }
}