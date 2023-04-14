// https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/solutions/3347909/rust-binary-search-solution/
impl Solution {
    pub fn find_min(mut nums:  Vec<i32>) -> i32 {
        while nums[0] == *nums.last().unwrap() && nums.len() > 1 {
            nums.pop();
        }
        if nums.len() == 1 {
            return nums[0]
        }
        let (mut l, mut r) = (0, nums.len() - 1);
        while l < r {
            let mid = (l + r)/2;
            if nums[mid] <= nums[r] {
                r = mid;
            } else { 
                l = mid + 1;
            }
        }
        nums[l]
    }
}