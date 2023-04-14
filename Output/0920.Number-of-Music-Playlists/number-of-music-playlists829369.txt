// https://leetcode.com/problems/number-of-music-playlists/solutions/829369/rust-translated-0ms-100/
impl Solution {
    pub fn num_music_playlists(n: i32, l: i32, k: i32) -> i32 {
        const MOD: i64 = 1_000_000_007;
        let mut dp = vec![1i64; (l + 1 - n) as usize];
        for p in 2..=(n - k) as usize {
            for i in 1..=(l - n) as usize {
                dp[i] += dp[i - 1] * p as i64;
                dp[i] %= MOD;
            }
        }
        let mut ans = dp[(l - n) as usize];
        for k in 2..=n {
            ans = ans * k as i64 % MOD;
        }
        ans as i32
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_num_music_playlists() {
        assert_eq!(Solution::num_music_playlists(3, 3, 1), 6)
    }

    #[test]
    fn test_num_music_playlists_02() {
        assert_eq!(Solution::num_music_playlists(2, 3, 0), 6)
    }

    #[test]
    fn test_num_music_playlists_03() {
        assert_eq!(Solution::num_music_playlists(2, 3, 1), 2)
    }
}