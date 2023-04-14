// https://leetcode.com/problems/number-of-music-playlists/solutions/2038058/rust-dp/
impl Solution {
    pub fn num_music_playlists(n: i32, L: i32, k: i32) -> i32 {
        let modulo = 1000000007;
        
        let mut dp = vec![vec![0 as i128; n as usize + 1]; L as usize + 1];
        
        dp[0][0] = 1;
        
        for i in 1..(L as usize + 1) {
            for j in 1..(n as usize + 1) {
                dp[i][j] += dp[i-1][j-1] * (n as i128 - j as i128 + 1);
                dp[i][j] += dp[i-1][j] * std::cmp::max(j as i128 - k as i128, 0) as i128 % modulo;
                dp[i][j] %= modulo;
            }
        }
        
        dp[L as usize][n as usize] as i32
    }
}


