// https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/2770054/rust-solution/
impl Solution {
    pub fn find_median_sorted_arrays(nums1: Vec<i32>, nums2: Vec<i32>) -> f64 {
        let (a, b) =  if nums1.len() <= nums2.len() {
                        (nums1, nums2)
                    } else {
                        (nums2, nums1)
                    };
        let total = a.len() + b.len();
        let half = (total + 1) / 2;

        let (mut left, mut right) = (0, a.len());


        loop {
            let i = left + (right - left) / 2;
            let j = half - i;

            let a_left = if i == 0 { std::i32::MIN } else { a[i - 1] };
            let a_right = if i == a.len() { std::i32::MAX } else { a[i] };
            let b_left = if j == 0 { std::i32::MIN } else { b[j - 1] };
            let b_right = if j == b.len() { std::i32::MAX } else { b[j] };

            if a_left <= b_right && b_left <= a_right {
                if total % 2 == 0 {
                    return (a_left.max(b_left) + a_right.min(b_right)) as f64 / 2.0;
                } else {
                    return (a_left.max(b_left)) as f64;
                }
            } else if a_left > b_right {
                right = i - 1;
            } else {
                left = i + 1;
            }
        }
    }
}