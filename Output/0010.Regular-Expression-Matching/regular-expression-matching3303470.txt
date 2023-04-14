// https://leetcode.com/problems/regular-expression-matching/solutions/3303470/beats-99-space-and-time-rust-dp/
impl Solution {
    pub fn is_match(s: String, p: String) -> bool {
        let s_chars: Vec<char> = s.chars().collect();
        let p_chars: Vec<char> = p.chars().collect();
        let (m, n) = (s.len(), p.len());
        
        let mut dp = vec![vec![false; n + 1]; 2];
        dp[0][0] = true;

        for j in 1..=n {
            if p_chars[j - 1] == '*' {
                dp[0][j] = dp[0][j - 2];
            }
        }

        for i in 1..=m {
            let curr = i % 2;
            let prev = 1 - curr;

            dp[curr][0] = false;

            for j in 1..=n {
                if p_chars[j - 1] == s_chars[i - 1] || p_chars[j - 1] == '.' {
                    dp[curr][j] = dp[prev][j - 1];
                } else if p_chars[j - 1] == '*' {
                    dp[curr][j] = dp[curr][j - 2] || (dp[prev][j] && (s_chars[i - 1] == p_chars[j - 2] || p_chars[j - 2] == '.'));
                } else {
                    dp[curr][j] = false;
                }
            }
        }

        dp[m % 2][n]
    }
}