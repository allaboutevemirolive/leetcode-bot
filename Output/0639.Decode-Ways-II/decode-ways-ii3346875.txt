// https://leetcode.com/problems/decode-ways-ii/solutions/3346875/rust-3-approaches/
impl Solution {
    pub fn num_decodings(s: String) -> i32 {
        const MOD: i64 = 1000000007;
        fn using_top_down_approach(s: String) -> i32 {
            fn ways(s: &Vec<char>, i: i32, memo: &mut [i64]) -> i64 {
                if i < 0 {
                    return 1;
                }
                let i = i as usize;
                if memo[i] > -1 {
                    return memo[i];
                }

                if s[i] == '*' {
                    let mut res = 9 * ways(s, i as i32 - 1, memo) % MOD;
                    if i > 0 {
                        if s[i - 1] == '*' {
                            res = (res + 15 * ways(s, i as i32 - 2, memo)) % MOD;
                        } else if s[i - 1] == '1' {
                            res = (res + 9 * ways(s, i as i32 - 2, memo)) % MOD;
                        } else if s[i - 1] == '2' {
                            res = (res + 6 * ways(s, i as i32 - 2, memo)) % MOD;
                        }
                    }
                    memo[i] = res;
                    return memo[i];
                }

                let mut res = if s[i] != '0' {
                    ways(s, i as i32 - 1, memo) % MOD
                } else {
                    0
                };

                if i > 0 {
                    if s[i - 1] == '1' || (s[i - 1] == '2' && s[i] <= '6') {
                        res = (res + ways(s, i as i32 - 2, memo)) % MOD;
                    } else if s[i - 1] == '*' {
                        let mul = if s[i] <= '6' { 2 } else { 1 };
                        res = (res + mul * ways(s, i as i32 - 2, memo)) % MOD;
                    }
                }

                memo[i] = res;
                memo[i]
            }
            let n = s.len();
            let mut memo = vec![-1; n];
            ways(&s.chars().collect(), n as i32 - 1, &mut memo) as i32
        }
        fn using_dynamic_programming_approach(s: String) -> i32 {
            let s = s.chars().collect::<Vec<_>>();
            let mut dp = vec![0i64; s.len() + 1];
            dp[0] = 1;
            dp[1] = if s[0] == '*' {
                9
            } else if s[0] == '0' {
                0
            } else {
                1
            };
            for i in 1..s.len() {
                if s[i] == '*' {
                    dp[i + 1] = 9 * dp[i] % MOD;
                    if s[i - 1] == '*' {
                        dp[i + 1] = (dp[i + 1] + 15 * dp[i - 1]) % MOD;
                    } else if s[i - 1] == '1' {
                        dp[i + 1] = (dp[i + 1] + 9 * dp[i - 1]) % MOD;
                    } else if s[i - 1] == '2' {
                        dp[i + 1] = (dp[i + 1] + 6 * dp[i - 1]) % MOD;
                    }
                } else {
                    dp[i + 1] = if s[i] == '0' { 0 } else { dp[i] };
                    if s[i - 1] == '*' {
                        let mul = if s[i] <= '6' { 2 } else { 1 };
                        dp[i + 1] = (dp[i + 1] + mul * dp[i - 1]) % MOD;
                    } else if s[i - 1] == '1' || (s[i - 1] == '2' && s[i] <= '6') {
                        dp[i + 1] = (dp[i + 1] + dp[i - 1]) % MOD;
                    }
                }
            }
            dp[s.len()] as i32
        }
        fn using_dynamic_programming_constant_space_approach(s: String) -> i32 {
            let s = s.chars().collect::<Vec<_>>();
            let mut first = 1;
            let mut second = if s[0] == '*' {
                9
            } else if s[0] == '0' {
                0
            } else {
                1
            };
            for i in 1..s.len() {
                let temp = second;
                if s[i] == '*' {
                    second = 9 * second % MOD;
                    if s[i - 1] == '1' {
                        second = (second + 9 * first) % MOD;
                    } else if s[i - 1] == '2' {
                        second = (second + 6 * first) % MOD;
                    } else if s[i - 1] == '*' {
                        second = (second + 15 * first) % MOD;
                    }
                } else {
                    second = if s[i] == '0' { 0 } else { second };
                    if s[i - 1] == '1' || (s[i - 1] == '2' && s[i] <= '6') {
                        second = (second + first) % MOD;
                    } else if s[i - 1] == '*' {
                        second = (second + if s[i] <= '6' { 2 } else { 1 } * first) % MOD;
                    }
                }
                first = temp;
            }
            second as i32
        }
        using_dynamic_programming_constant_space_approach(s)
    }
}