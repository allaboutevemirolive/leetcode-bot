// https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/3063798/median-of-2-sorted-arrays-using-rust/
impl Solution {
    pub fn find_median_sorted_arrays(nums1: Vec<i32>, nums2: Vec<i32>) -> f64 {
        let mut v: Vec<i32> = vec![nums1, nums2].into_iter().flatten().collect();
        v.sort();

        let n = v.len();
        let mid = &n / 2;

        if &n % 2 == 0 {
            (v[mid-1] as f64 + v[mid] as f64) / 2.0
        }
        else {
            v[mid] as f64
        }
    }
}