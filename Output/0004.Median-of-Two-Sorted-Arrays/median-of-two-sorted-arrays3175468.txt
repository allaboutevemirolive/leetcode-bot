// https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/3175468/rust-solution/
impl Solution {
    pub fn find_median_sorted_arrays(nums1: Vec<i32>, nums2: Vec<i32>) -> f64 {
        let mut arr: Vec<i32> = Vec::new();
        let (m, n) = (nums1.len(), nums2.len());
        let (mut i, mut j) = (0, 0);

        while i < m && j < n {
            if nums1[i] <= nums2[j] {
                arr.push(nums1[i]);
                i += 1;
            } else {
                arr.push(nums2[j]);
                j += 1;
            }
        }
        while i < m {
            arr.push(nums1[i]);
            i += 1;
        }
        while j < n {
            arr.push(nums2[j]);
            j += 1;
        }
        let len = arr.len();
        if len % 2 == 0 {
            return (arr[len / 2 - 1] + arr[len / 2]) as f64 / 2.0;
        } else {
            return arr[len / 2] as f64;
        }
    }
}