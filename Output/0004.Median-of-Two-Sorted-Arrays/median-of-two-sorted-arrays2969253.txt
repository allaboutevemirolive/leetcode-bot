// https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/2969253/rust-log-n-m-easier-to-follow-with-fewer-edge-cases-allegedly-faster-than-100-of-test-cases/
impl Solution {
    pub fn find_median_sorted_arrays(nums1: Vec<i32>, nums2: Vec<i32>) -> f64 {
        fn help(nums1: &[i32], nums2: &[i32], k: usize) -> i32 {
            // since the recursive steps are just deleting elements,
            // we will reach a terminal stage where we have an empty list.
            // and we can reach for the Kth element directly
            if nums1.len() == 0 {
                nums2[k - 1]
            } else if nums2.len() == 0 {
                nums1[k - 1]
            } else {
                let l1 = nums1.len() / 2;
                let l2 = nums2.len() / 2;

                if l1 + l2 + 1 < k {
                    if nums1[l1] < nums2[l2] {
                        help(&nums1[l1 + 1..], nums2, k - l1 - 1)
                    } else {
                        help(nums1, &nums2[l2 + 1..], k - l2 - 1)
                    }
                } else {
                    if nums1[l1] < nums2[l2] {
                        help(nums1, &nums2[..l2], k)
                    } else {
                        help(&nums1[..l1], nums2, k)
                    }
                }
            }
        }

        let len = nums1.len() + nums2.len();

        if len % 2 == 0 {
            (help(&nums1[..], &nums2[..], len / 2) + help(&nums1[..], &nums2[..], len / 2 + 1))
                as f64
                / 2f64
        } else {
            help(&nums1[..], &nums2[..], len / 2 + 1) as f64
        }
    }
}