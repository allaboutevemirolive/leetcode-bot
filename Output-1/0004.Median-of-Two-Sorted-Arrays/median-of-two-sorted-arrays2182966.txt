// https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/2182966/linear-solution-in-rust/
impl Solution {
    pub fn find_median_sorted_arrays(nums1: Vec<i32>, nums2: Vec<i32>) -> f64 {
        let (mut it1, mut it2) = (nums1.iter().peekable(), nums2.iter().peekable());
        let mut biggest = (0, 0);
        for _ in 0..((nums1.len() + nums2.len() + 2) / 2) {
            let (&&n1, &&n2) = (it1.peek().unwrap_or(&&i32::MAX), it2.peek().unwrap_or(&&i32::MAX));
            biggest.0 = biggest.1;
            if n1 < n2 {
                it1.next();
                biggest.1 = n1;
            } else {
                it2.next();
                biggest.1 = n2;
            }
        }
        
        if (nums1.len() + nums2.len()) % 2 == 0 {
            (biggest.0 + biggest.1) as f64 / 2f64
        } else {
            biggest.1 as f64
        }
        
    }
}