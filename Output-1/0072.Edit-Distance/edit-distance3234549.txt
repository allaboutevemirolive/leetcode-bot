// https://leetcode.com/problems/edit-distance/solutions/3234549/rust-3ms-runtime-2-1-mb-space-usage/
use std::cmp;

impl Solution {
    pub fn min_distance(mut word1: String, mut word2: String) -> i32 {
        if word1.len() < word2.len() {
            let temp = word1;
            word1 = word2;
            word2 = temp;
        }

        let chars1: Vec<char> = word1.chars().collect();
        let chars2: Vec<char> = word2.chars().collect();

        let mut dp = vec![0; word2.len() + 1];
        for index2 in 0..word2.len() + 1 {
            dp[index2] = (word2.len() - index2) as i32;
        }

        for index1 in (0..word1.len()).rev() {
            let mut next_dp = vec![0; word2.len() + 1];
            next_dp[word2.len()] = (word1.len() - index1) as i32;
            for index2 in (0..word2.len()).rev() {
                next_dp[index2] = if chars1[index1] == chars2[index2] {
                    dp[index2 + 1]
                } else {
                    1 + cmp::min(
                        next_dp[index2 + 1],
                        cmp::min(
                            dp[index2],
                            dp[index2 + 1],
                        ),
                    )
                };
            }

            dp = next_dp;
        }

        dp[0]
    }
}