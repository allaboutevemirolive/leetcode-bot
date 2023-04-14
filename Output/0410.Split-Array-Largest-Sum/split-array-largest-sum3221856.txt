// https://leetcode.com/problems/split-array-largest-sum/solutions/3221856/rust-solution/
impl Solution {
    pub fn split_array(nums: Vec<i32>, k: i32) -> i32 {
        fn can_split_into_chunks(nums: &[i32], mid: i32, k: i32) -> bool {
            let mut chunks = 0;
            let mut i = 0;
            while i < nums.len() {
                let mut val = 0;
                while i < nums.len() && nums[i] + val <= mid {
                    val += nums[i];
                    i += 1;
                }
                chunks += 1;
            }
            chunks <= k
        }
        let mut lo_sum = 0;
        let mut hi_sum = 0;
        for i in 0..nums.len() {
            lo_sum = lo_sum.max(nums[i]);
            hi_sum += nums[i];
        }
        while lo_sum < hi_sum {
            let mid = (lo_sum + hi_sum) / 2;
            if can_split_into_chunks(&nums, mid, k) {
                hi_sum = mid;
            } else {
                lo_sum = mid + 1;
            }
        }
        lo_sum
    }
}