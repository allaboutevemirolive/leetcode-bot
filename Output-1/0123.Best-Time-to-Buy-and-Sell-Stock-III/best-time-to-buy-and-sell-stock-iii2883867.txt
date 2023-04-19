// https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/solutions/2883867/dp-table-solution-in-rust/
impl Solution {
    pub fn max_profit(prices: Vec<i32>) -> i32 {


        // BottomUp Tabulation
        let n = prices.len();
        let mut dp = vec![vec![vec![0; 3]; 2]; n + 1];
        for i in (0..n).rev() {
            for b in 0..=1 {
                for t in (0..=2).rev() {
                    if t == 2 {
                        dp[i][b][t] = 0;
                        continue;
                    }
                    if b == 1 {
                        dp[i][b][t] = std::cmp::max(dp[i + 1][0][t] - prices[i], dp[i + 1][1][t]);
                    } else {
                        dp[i][b][t] = std::cmp::max(dp[i + 1][1][t + 1] + prices[i], dp[i+1][0][t]);
                    }
                }
            }
        }

        dp[0][1][0]
        
    }
}