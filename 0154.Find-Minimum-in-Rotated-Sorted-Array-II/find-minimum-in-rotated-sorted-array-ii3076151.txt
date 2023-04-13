// https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/solutions/3076151/rust-binary-search-solution/
impl Solution {
    pub fn find_min(nums: Vec<i32>) -> i32 {
        let n = nums.len();

        let (mut l, mut r) = (0, n - 1);

        while l < r {
            if nums[l] < nums[r] {
                return nums[l];
            }

            let mid = l + (r - l) / 2;

            if nums[mid] < nums[r] {
                r = mid;
            } else if nums[mid] > nums[r] {
                l = mid + 1;
            } else {
                r -= 1;
            }
        }

        nums[l]
    }
}