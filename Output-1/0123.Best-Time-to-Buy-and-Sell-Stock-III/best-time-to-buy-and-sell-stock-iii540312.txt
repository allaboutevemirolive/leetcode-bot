// https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/solutions/540312/rust-dp/
impl Solution {
    pub fn max_profit(prices: Vec<i32>) -> i32 {
        let mut dp = vec![vec![0; 5]; prices.len() + 1];
        for j in 1..5 {
            dp[0][j] = std::i32::MIN;
        }
        for i in 1..dp.len() {
            for j in (2..5).step_by(2) {
                // has position
                dp[i][j] = std::cmp::max(
                    if dp[i-1][j-1] == std::i32::MIN { dp[i-1][j-1] } else { dp[i-1][j-1] + prices[i-1] },
                    dp[i-1][j]);
            }
            for j in (1..5).step_by(2) {
                // empty position
                dp[i][j] = std::cmp::max(
                    if dp[i-1][j-1] == std::i32::MIN { dp[i-1][j-1] } else { dp[i-1][j-1] - prices[i-1] },
                    dp[i-1][j]);
            }
        }
        *dp.last().unwrap().into_iter().step_by(2).max().unwrap()
    }
}