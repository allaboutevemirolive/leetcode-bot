// https://leetcode.com/problems/decode-ways-ii/solutions/3203426/rust-solution-with-dynamic-programming-time-o-n-space-o-1/
const BASE: usize = 10usize.pow(9) + 7;

impl Solution {
    pub fn num_decodings(s: String) -> i32 {
        let mut dp = [1usize; 3];
        let mut last_char = '#';

        for (i, c) in s.chars().enumerate() {
            if dp[2] == 0 {
                return 0;
            }

            dp[0] = dp[1];
            dp[1] = dp[2];

            if c == '*' {
                dp[2] = (dp[1] * 9) % BASE;

                if i == 0 {
                    last_char = c;
                    continue;
                }

                if last_char == '*' {
                    dp[2] = (dp[2] + dp[0] * 15) % BASE;
                } else if last_char == '1' {
                    dp[2] = (dp[2] + dp[0] * 9) % BASE;
                } else if last_char == '2' {
                    dp[2] = (dp[2] + dp[0] * 6) % BASE;
                }
            } else {
                if c != '0' {
                    dp[2] = dp[1];
                } else {
                    dp[2] = 0;
                }

                if i == 0 {
                    last_char = c;
                    continue;
                }

                let d = c.to_digit(10).unwrap();

                if last_char == '*' {
                    if d <= 6 {
                        dp[2] = (dp[2] + dp[0] * 2) % BASE;
                    } else {
                        dp[2] = (dp[2] + dp[0]) % BASE;
                    }
                } else {
                    let e = last_char.to_digit(10).unwrap();

                    if e == 1 || (e == 2 && d <= 6) {
                        dp[2] = (dp[2] + dp[0]) % BASE;
                    }
                }
            }

            last_char = c;
        }

        dp[2] as i32
    }
}
