// https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/solutions/1536383/rust-solution-runtime-0ms/
use std::cmp;

impl Solution {
    pub fn find_min(nums: Vec<i32>) -> i32 {
        let mut min_number: i32 = 5000;
        for (idx, num) in nums.clone().into_iter().enumerate() {
            min_number = cmp::min(min_number, num);
            let prev_num = nums.get(idx - 1);
            let next_num = nums.get(idx + 1);
            
            if prev_num.is_none() {
                continue;
            }
            
            if next_num.is_none() {
                return min_number;
            }
            
            if prev_num.unwrap() < &num && next_num.unwrap() > &num {
                continue;
            }
            
            if prev_num.unwrap() > &num {
                return min_number;
            }
        }
        min_number
    }
}