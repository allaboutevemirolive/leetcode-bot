// https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/3282215/true-o-log-n-m-in-rust-w-brief-explanation-non-recursive-in-place/
use std::mem::swap as mem_swap;

impl Solution {
    fn median(nums: &[i32]) -> (f64, f64) {
        return {
            let index = (nums.len() - 1) as f64 / 2.0;
            let upper = index.ceil() as usize;
            let lower = index.floor() as usize;
            ((nums[lower] + nums[upper]) as f64 / 2.0, index)
        };
    }
    
    // only take +- 2 elements of around the median
    fn mid_segment<'a>(nums: &'a[i32]) -> &'a[i32] {
        if nums.len() <= 4 {
            return nums;
        }
        
        let lower = ((nums.len() - 1) as f64 / 2.0).floor() as usize - 1;
        let upper = ((nums.len() - 1) as f64 / 2.0).ceil() as usize + 2;
        return &nums[lower..upper];
    }
    
    pub fn find_median_sorted_arrays(nums1: Vec<i32>, nums2: Vec<i32>) -> f64 {       
        let mut n1 = &nums1[..];
        let mut n2 = &nums2[..];
        
        // you can think of this as in-place binary search
        loop {          
            // base case: if we narrow to a median between two elements, we stop dividing and calculate the median in O(1)
            if n1.len() <= 2 || n2.len() <= 2 {
                // merge
                let mut nums = Self::mid_segment(n1).to_vec();
                nums.extend(Self::mid_segment(n2));
                nums.sort();
                return Self::median(&nums).0;
            }
            
            let mut med1 = Self::median(n1);
            let mut med2 = Self::median(n2);
            
            // make sure the n1 median is the smaller one
            // that way, we can assume the new search space is between the n1 median and the n2 median
            if med1.0 > med2.0 {
                mem_swap(&mut n1, &mut n2);
                mem_swap(&mut med1, &mut med2);
            }

            // the shrink is the amount of elements we cut off from the outer edges of the array
            let shrink = {
                // we can safely slice towards the space between the medians
                let left_cut = med1.1.floor() as usize;
                let right_cut = n2.len() - (med2.1.ceil() as usize) - 1;
                left_cut.min(right_cut)
            };

            // we always cut off the same amount of elements from the left and right sides
            n1 = &n1[shrink..];
            n2 = &n2[..(n2.len() - shrink)];
        }
    }
}