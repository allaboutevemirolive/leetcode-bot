// https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/1198366/simple-solution-with-rust/
impl Solution {
    pub fn find_median_sorted_arrays(nums1: Vec<i32>, nums2: Vec<i32>) -> f64 {
        let mut v: Vec<i32> = vec![];
        v.extend(&nums1);
        v.extend(&nums2);
        v.sort();
        
        if(v.len() % 2 > 0) {
            //odd number of elements
            let index = (v.len()-1) / 2;
            return f64::from(v[index])
        } else {
            let index = v.len()/2;
            return f64::from(v[index] + v[index-1]) / 2f64
        }
 
    }
}