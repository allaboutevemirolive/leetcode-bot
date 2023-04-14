// https://leetcode.com/problems/minimum-swaps-to-make-sequences-increasing/solutions/1302319/c-rust-one-pass-scan-counting-greedy-o-n/
// Rust Solution
use std::mem;

impl Solution {
    pub fn min_swap(nums1: Vec<i32>, nums2: Vec<i32>) -> i32 {
        let n = nums1.len();
        
        let (mut nums1, mut nums2) = (nums1, nums2);
        let (mut count, mut groupSize, mut ret) = (0, 1, 0);
        
        for i in 1..n {
            if nums1[i - 1].max(nums2[i - 1]) < nums1[i].min(nums2[i]) {
                ret += count.min(groupSize - count);
                count = 0;
                groupSize = 1;
            } else {
                groupSize += 1;
                if nums1[i - 1] <= nums1[i] && nums2[i - 1] <= nums2[i] { continue; }
                
                mem::swap(&mut nums1[i], &mut nums2[i]);
                count += 1;
				
                if i == n - 1 { ret += count.min(groupSize - count); } 
            }
        }
        
        ret
    }
}

// C++ Solution
class Solution {
public:
    int minSwap(vector<int>& nums1, vector<int>& nums2) {
        int n = nums1.size(), count = 0, groupSize = 1, ret = 0;
        for (int i = 1; i < n; ++i) {
            int &a = nums1[i - 1], &b = nums2[i - 1], &c = nums1[i], &d = nums2[i]; 
            if (max(a, b) < min(c, d)) {
                ret += min(groupSize - count, count);
                count = 0;
                groupSize = 1;
            } else {
                ++groupSize;
                if (a >= c || b >= d) {
                    swap(c, d);
                    ++count;
                }
				if (i == n - 1) ret += min(count, groupSize - count); 
            };
        }
        return ret;
    }
};