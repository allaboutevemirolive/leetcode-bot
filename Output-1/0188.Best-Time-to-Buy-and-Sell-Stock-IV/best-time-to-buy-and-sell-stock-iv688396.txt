// https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/solutions/688396/rust-dp-solution-0ms/
impl Solution {
    fn _quick_solve(ps: Vec<i32>) -> i32 {
        // we gain a profit as long as there is a price gap 
        (1..ps.len()).map(|i| max(ps[i] - ps[i - 1], 0)).sum()
    }
    pub fn max_profit(k: i32, ps: Vec<i32>) -> i32 {
        let n = ps.len();
        let k = k as usize;
        if k >= n / 2 {
            return Self::_quick_solve(ps);
        };
        
        // dp[i][j] is the maximum profit gained at day j with at most
        // i transactions
        let mut dp: Vec<Vec<i32>> = vec![vec![0; n]; k + 1];
        let mut ans = 0;
        for i in 1..k + 1 {
            let mut pre_max = -ps[0];
            for j in 1..n {
                dp[i][j] = max(dp[i][j - 1], pre_max + ps[j]);
                pre_max = max(pre_max, dp[i - 1][j - 1] - ps[j]);
                ans = max(ans, dp[i][j]);
            }
        }
        ans 
    }
}