// https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/3347877/rust-0ms-2-1mb-super-fast-and-easy/
impl Solution {
    pub fn find_median_sorted_arrays(mut nums1: Vec<i32>, mut nums2: Vec<i32>) -> f64 {
        nums1.append(&mut nums2);
        nums1.sort();

        if nums1.len() % 2 != 0 {
            return (nums1[nums1.len() / 2]) as f64;
        }
        let first_num = nums1[(nums1.len().div_euclid(2)) - 1] as f64;
        let second_num = nums1[nums1.len().div_euclid(2)] as f64;

        ((first_num + second_num) / 2.0) as f64
    }
}