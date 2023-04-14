// https://leetcode.com/problems/minimum-swaps-to-make-sequences-increasing/solutions/962584/rust-cheapest-best/
use std::cmp::Ordering::Greater;

impl Solution {
    pub fn min_swap(a: Vec<i32>, b: Vec<i32>) -> i32 {
        let mut dp = vec![(0, 1); a.len()];

        for i in 1..a.len() {
            match (
                a[i].cmp(&a[i - 1]),
                b[i].cmp(&b[i - 1]),
                a[i].cmp(&b[i - 1]),
                b[i].cmp(&a[i - 1]),
            ) {
                (Greater, Greater, Greater, Greater) => {
                    dp[i].0 = dp[i - 1].0.min(dp[i - 1].1);
                    dp[i].1 = 1 + dp[i - 1].0.min(dp[i - 1].1);
                }
                (Greater, Greater, _, _) => {
                    dp[i].0 = dp[i - 1].0;
                    dp[i].1 = 1 + dp[i - 1].1;
                }
                (_, _, Greater, Greater) => {
                    dp[i].0 = dp[i - 1].1;
                    dp[i].1 = 1 + dp[i - 1].0;
                }
                _ => panic!("Invariant violation!"),
            };
        }

        dp.last().unwrap().0.min(dp.last().unwrap().1)
    }
}