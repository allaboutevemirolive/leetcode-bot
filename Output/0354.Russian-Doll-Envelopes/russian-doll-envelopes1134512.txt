// https://leetcode.com/problems/russian-doll-envelopes/solutions/1134512/rust-4ms-o-n-logn/
use std::cmp::Reverse;

impl Solution {
    pub fn max_envelopes(envs: Vec<Vec<i32>>) -> i32 {
        let mut envs: Vec<_> = envs.iter().map(|e| (e[0], Reverse(e[1]))).collect();
        envs.sort_unstable();
        let mut max_dp = Vec::new();
        for (_, Reverse(h)) in envs {
            let i = max_dp.binary_search(&h).unwrap_or_else(|i| i);
            if i < max_dp.len() {
                max_dp[i] = h;
            } else {
                max_dp.push(h);
            }
        }
        
        max_dp.len() as _
    }
}