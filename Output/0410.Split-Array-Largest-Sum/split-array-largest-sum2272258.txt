// https://leetcode.com/problems/split-array-largest-sum/solutions/2272258/rust-solution-using-dp/
impl Solution {
    pub fn split_array(nums: Vec<i32>, m: i32) -> i32 {
        let n = nums.len();
        let mut left = *nums.iter().max().unwrap();
        let mut right = 1_000_000_000;
        while left < right {
            let mid = (left+right) / 2;
            let mut temp = nums[0];
            let mut count = 1;
            for i in 1..n {
                let v = nums[i];
                if mid < temp + v {
                    temp = v;
                    count += 1;
                } else {
                    temp += v;
                }
            }
            if count > m {
                left = mid+1;      
            } else {
                right = mid;
            }
        }
        left
    }
}