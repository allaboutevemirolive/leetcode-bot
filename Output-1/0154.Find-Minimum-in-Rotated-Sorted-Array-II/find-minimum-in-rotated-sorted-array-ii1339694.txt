// https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/solutions/1339694/rust-with-comments/
impl Solution {
    pub fn find_min(nums: Vec<i32>) -> i32 {
        let mut l = 0;
        let mut r = nums.len() - 1;

        while l < r {
            let mid = l + (r - l) / 2;
            if nums[mid] < nums[r] {
                // left side, mid "might" be the target we are looking for, so we don't do "-1" aggressively
                r = mid
            } else if nums[mid] > nums[r] {
                // right side, and we can be sure that mid is not possibly the target
                l = mid + 1
            } else {
                r -= 1
            }
        }

        nums[l]
    }
}