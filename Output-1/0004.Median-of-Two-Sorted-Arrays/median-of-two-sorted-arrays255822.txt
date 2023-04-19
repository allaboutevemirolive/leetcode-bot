// https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/255822/rust-solution/
impl Solution {
    pub fn find_median_sorted_arrays(nums1: Vec<i32>, nums2: Vec<i32>) -> f64 {
            let mut nums=vec![];
            let mut j=0;
            let len=nums2.len();
            for i in nums1{
                while j<len&&nums2[j]<i{
                    nums.push(nums2[j]);
                    j+=1;
                }
                nums.push(i);
            }
            for i in j..len{
                nums.push(nums2[i]);
            }
            let len=nums.len();
            if len%2==1{
                nums[len/2] as f64
            }else{
                ((nums[len/2-1]+nums[len/2]) as f64)/2 as f64
            }
    }
}