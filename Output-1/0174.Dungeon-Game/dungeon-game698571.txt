// https://leetcode.com/problems/dungeon-game/solutions/698571/rust-dp-bottom-up-0ms-explanation-by-example/
use std::cmp::{min, max};
impl Solution {
    pub fn calculate_minimum_hp(dungeon: Vec<Vec<i32>>) -> i32 {
        let m = dungeon.len();
        let n = dungeon[0].len();
        let mut dp = vec![vec![std::i32::MAX;n];m];
        dp[m-1][n-1] = 1;
        for i in (0..m).rev() {
            for j in (0..n).rev() {
                if i > 0 {
                    dp[i-1][j] = min(max(dp[i][j]-dungeon[i][j], 1), dp[i-1][j]);
                }
                if j > 0 {
                    dp[i][j-1] = min(max(dp[i][j]-dungeon[i][j], 1), dp[i][j-1]);
                }
            }
        }
        max(dp[0][0] - dungeon[0][0], 1)
    }
}