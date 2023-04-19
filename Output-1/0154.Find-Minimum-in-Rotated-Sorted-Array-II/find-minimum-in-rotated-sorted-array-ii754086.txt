// https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/solutions/754086/rust-average-o-log-n-and-worst-o-n-runs-in-0ms/
impl Solution {
    pub fn find_min(nums: Vec<i32>) -> i32 {
        Self::binary_search(&nums, 0, nums.len() - 1)
    }
    
    fn binary_search(nums: &[i32], left: usize, right: usize) -> i32 {
        if nums[right] > nums[left] || left == right {
            return nums[left];
        }
        
        let middle = left + ((right - left) >> 1);
        if nums[middle] > nums[left] {
            Self::binary_search(nums, middle, right)
        } else if nums[middle] < nums[right] {
            Self::binary_search(nums, left, middle)
        } else {
            let first = Self::binary_search(nums, left, middle);
            let second = Self::binary_search(nums, middle + 1, right);
            
            first.min(second)
        }
    }
}