// https://leetcode.com/problems/contains-duplicate-iii/solutions/3280192/contains-duplicate-iii-using-rust/
use std::cmp;

impl Solution {
    pub fn contains_nearby_almost_duplicate(nums: Vec<i32>, index_diff: i32, value_diff: i32) -> bool {
        let mut result = false;

        for i in 0..nums.len() {
            for j in i+1..cmp::min(i+1+index_diff as usize, nums.len()) {
                let temp = nums[i] - nums[j];
                //println!("{}: {} | {}: {} | {}", i, nums[i], j, nums[j], temp.abs());
                if temp.abs() <= value_diff {
                    result = true;
                    break;
                }
            }
        }

        result
    }
}