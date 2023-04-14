// https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/solutions/1363872/rust-general-dp-of-stock-problems/
impl Solution {
    pub fn max_profit(k: i32, prices: Vec<i32>) -> i32 {
        // dp[i][k][m]: max profit on day i with k transactions left while holding m stock AFTER taking action
        // dp[3][1][1]: max profit on day 3, can buy in 1 more time, holding one stock AFTER rest/buy

        // i: 1 ~ n + 1
        // j: 0 ~ k
        // k: 0 ~ 1

        // Base case
        // dp[0][k][0] = 0 (profit is 0 at start)
        // dp[0][k][1] = -infinity (impossible to have stock at day 0)

        // dp[i][k][0] = max(dp[i-1][k][0], dp[i-1][k][1] + prices[i])
        // dp[i][k][1] = max(dp[i-1][k][1], dp[i-1][k-1][0] - prices[i])

        // Space Optimization
        // From 3D to 2D to prev & cur, since every state change only concerns the former one(dp[i-1])
        // From O(2k) to O(k), since every change only concerns the value to its left

        let k: usize = k as usize;
        let n: usize = prices.len();
        let mut dp: Vec<Vec<i32>> = vec![vec![0, std::i32::MIN]; k + 1];

        use std::cmp::max;
        for i in 1..=n {
            for k in 1..=k {
                dp[k][0] = max(dp[k][0], prices[i - 1] + dp[k][1]);
                dp[k][1] = max(dp[k][1], dp[k - 1][0] - prices[i - 1]);
            }
        }

        dp[k][0]
    }
}