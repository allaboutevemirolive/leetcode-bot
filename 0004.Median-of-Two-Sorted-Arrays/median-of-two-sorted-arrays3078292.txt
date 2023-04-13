// https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/3078292/rust-speed-beats-100-memory-beats-100/
impl Solution {
    pub fn find_median_sorted_arrays(nums1: Vec<i32>, nums2: Vec<i32>) -> f64 {
       let mut idx = (0, 0);
        let mut saved = Vec::new();
        let median_pos = (nums1.len() + nums2.len()) / 2;
        match nums1.len() + nums2.len() {
            1 => {
                (nums1.iter().fold(0, |acc, val| acc + val)
                    + nums2.iter().fold(0, |acc, val| acc + val)) as f64
            }
            2 => {
                (nums1.iter().fold(0, |acc, val| acc + val)
                    + nums2.iter().fold(0, |acc, val| acc + val)) as f64
                    / 2.0
            }
            _ => {
                for _ in 0..=median_pos + 1 {
                    if nums1.len() > idx.0 && (nums2.len() == idx.1 || nums1[idx.0] <= nums2[idx.1])
                    {
                        saved.push(nums1[idx.0]);
                        idx.0 += 1;
                    } else {
                        saved.push(nums2[idx.1]);
                        idx.1 += 1;
                    }
                }
                if (nums1.len() + nums2.len()) % 2 == 0 {
                    (saved[saved.len() - 2] + saved[saved.len() - 3]) as f64 / 2.0
                } else {
                    saved[saved.len() - 2] as f64
                }
            }
        }

    }
}