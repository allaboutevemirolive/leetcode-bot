// https://leetcode.com/problems/longest-valid-parentheses/solutions/1140371/rust-dp-solution/
impl Solution {
    pub fn longest_valid_parentheses(s: String) -> i32 {
		// dp[i] represents longest valid parentheses ends at i
        let bytes = s.into_bytes();
        let mut dp = vec![0; bytes.len()];
        for i in 1..bytes.len() {
            let byte = bytes[i];
            if byte == b'(' { continue; }
            match bytes[i - 1] {
                b'(' => {
                    let mut res = 2;
                    if i > 1 {
                        res += dp[i - 2];
                    }
                    dp[i] = res;
                },
                b')' => {
                    if dp[i - 1] == 0 { continue; }
                    let prev_start_i = i - dp[i - 1];
                    if prev_start_i > 0 && bytes[prev_start_i - 1] == b'(' {
                        let mut res = dp[i - 1] + 2;
                        if prev_start_i > 1 {
                            res += dp[prev_start_i - 2];
                        }
                        dp[i] = res;
                    }
                },
                _ => panic!()
            }
        }
        dp.into_iter().max().unwrap_or(0) as i32
    }
}