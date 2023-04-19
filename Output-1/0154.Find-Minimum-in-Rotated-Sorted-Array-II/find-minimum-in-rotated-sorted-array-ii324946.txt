// https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/solutions/324946/rust-4ms-binary-search-o-n/
impl Solution {
    pub fn find_min(nums: Vec<i32>) -> i32 {
        if nums.is_empty() {
            return 0;
        }

        let (mut l, mut r) = (0, nums.len() - 1);
        while l < r {
            let mid = l + ((r - l) >> 1);
            if nums[mid] > nums[r] {
                l = mid + 1;
            } else if nums[mid] < nums[r] {
                r = mid;
            } else {
                r -= 1;  // special case
            }
        }
        nums[l]
    }
}