// https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/3397130/rust-branchless/
impl Solution {
    pub fn find_median_sorted_arrays(nums1: Vec<i32>, nums2: Vec<i32>) -> f64 {
    let mut c_vec: Vec<i32> = [nums1, nums2].concat();
    c_vec.sort();

    let c_len = (c_vec.len() - 1) >> 1;

    (c_vec[c_len] + c_vec[c_len + (c_vec.len() - 1 & 1)]) as f64 / 2.0
}}