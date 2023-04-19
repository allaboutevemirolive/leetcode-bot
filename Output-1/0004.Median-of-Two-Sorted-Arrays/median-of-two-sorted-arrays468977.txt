// https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/468977/rust-4ms/
impl Solution {
    pub fn find_median_sorted_arrays(nums1: Vec<i32>, nums2: Vec<i32>) -> f64 {
        let mut nums: Vec<i32> = vec![];
        nums.extend_from_slice(&nums1);
        nums.extend_from_slice(&nums2);
        nums.sort_unstable();

        let len = nums.len();
        if len % 2 == 1 {
          return nums[len/2] as f64;
        } else {
          return (nums[len/2] + nums[len/2 - 1]) as f64 / 2.0;
        }
    }
}