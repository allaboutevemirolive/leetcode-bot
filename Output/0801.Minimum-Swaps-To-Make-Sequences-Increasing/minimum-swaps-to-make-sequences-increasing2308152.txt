// https://leetcode.com/problems/minimum-swaps-to-make-sequences-increasing/solutions/2308152/rust-solution-using-dp/
impl Solution {
    pub fn min_swap(nums1: Vec<i32>, nums2: Vec<i32>) -> i32 {
        let n = nums1.len();
        let inf = 1_000_000_000;
        let mut memo = vec![(inf,inf);n];
        memo[0] = (0, 1);

        for i in 1..n {
            let v1 = nums1[i];
            let v2 = nums2[i];
            let lv1 = nums1[i-1];
            let lv2 = nums2[i-1];

            if lv1 < v1 && lv2 < v2 {
                // N => N
                memo[i].0 = memo[i].0.min(memo[i-1].0);
                // R => R
                memo[i].1 = memo[i].1.min(memo[i-1].1+1);
            }
            if lv1 < v2 && lv2 < v1 {
                // N => R
                memo[i].1 = memo[i].1.min(memo[i-1].0+1);
                // R => N
                memo[i].0 = memo[i].0.min(memo[i-1].1);
            }
        }

        memo[n-1].0.min(memo[n-1].1)
    }
}