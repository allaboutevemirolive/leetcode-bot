// https://leetcode.com/problems/split-array-largest-sum/solutions/1899800/rust-bin-search-with-iter-reduce/
impl Solution {
    pub fn split_array(nums: Vec<i32>, m: i32) -> i32 {
        let mut l = *nums.iter().max().unwrap();
        let mut r = nums.iter().sum::<i32>();
        while l < r {
            let mid = (l + r) / 2;
            let mut left = m - 1;
            nums.iter().copied().reduce(|sum, val| {
                if sum + val > mid {
                    left -= 1;
                    val
                } else {
                    sum + val
                }
            });
            if left < 0 {
                l = mid + 1;
            } else {
                r = mid;
            }
        }
        l
    }
}