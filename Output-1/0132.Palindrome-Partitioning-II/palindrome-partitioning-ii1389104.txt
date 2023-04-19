// https://leetcode.com/problems/palindrome-partitioning-ii/solutions/1389104/rust-translated-dp-solution/
impl Solution {
    pub fn min_cut(s: String) -> i32 {
        let s = s.as_bytes();
        let mut p = vec![vec![false; s.len()]; s.len()];
        let mut dp = vec![0; s.len()];
        for i in 0..s.len() {
            let mut min = i as i32;
            for j in 0..=i {
                if (j + 1 >= i || p[j + 1][i - 1]) && s[j] == s[i] {
                    p[j][i] = true;
                    min = if j == 0 { 0 } else { min.min(dp[j - 1] + 1) };
                }
            }
            dp[i] = min;
        }
        dp[s.len() - 1]
    }
}