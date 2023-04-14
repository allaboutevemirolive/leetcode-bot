// https://leetcode.com/problems/arithmetic-slices-ii-subsequence/solutions/2852877/rust-dp-100/
use std::collections::HashMap;

impl Solution {
    pub fn number_of_arithmetic_slices(nums: Vec<i32>) -> i32 {
        let len = nums.len();
        
        let mut dp = vec![HashMap::new(); len];
        let mut res = 0;
        for i in 1..len {
            for j in 0..i {
                let dif = nums[i] as i64 - nums[j] as i64;
                let mut sum = 0;
                if let Some(count) = dp[j].get(&dif) {
                    sum = *count;
                }
                
                dp[i].entry(dif).and_modify(|counter| *counter += sum + 1).or_insert(sum + 1);
                res += sum;
            }
        }
        
        res
    }
}