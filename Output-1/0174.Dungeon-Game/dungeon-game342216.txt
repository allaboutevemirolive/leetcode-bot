// https://leetcode.com/problems/dungeon-game/solutions/342216/rust-0ms-o-mn/
impl Solution {
    pub fn calculate_minimum_hp(dungeon: Vec<Vec<i32>>) -> i32 {
        if dungeon.is_empty() || dungeon[0].is_empty() {
            return 0;
        }

        let (m, n) = (dungeon.len(), dungeon[0].len());
        let mut dp = vec![std::i32::MAX; n + 1];
        dp[n-1] = 1;
        for i in (0..m).rev() {
            for j in (0..n).rev() {
                dp[j] = dp[j].min(dp[j + 1]) - dungeon[i][j];
                if dp[j] <= 0 {
                    dp[j] = 1;
                }
            }
        }
        dp[0]
    }
}