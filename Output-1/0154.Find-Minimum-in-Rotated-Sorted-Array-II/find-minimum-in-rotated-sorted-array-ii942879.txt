// https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/solutions/942879/rust-0ms-binary-search/
impl Solution {
    pub fn find_min(nums: Vec<i32>) -> i32 {
        let mut lo = 0;
        let mut hi = nums.len()-1;
        let mut mid = 0;
        while lo < hi {
            if nums[lo] > nums[hi] {
                mid = lo + (hi-lo)/2;
                match nums[mid] >= nums[lo] {
                    true => lo = mid+1,
                    false => hi = mid,
                }
            } else if nums[lo] == nums [hi] {
                while lo < hi {
                    lo += 1;
                    if nums[lo] < nums[hi] {
                        return nums[lo];
                    }
                }        
            } else {
                return nums[lo];
            }               
        }
        return nums[lo];
    }
}