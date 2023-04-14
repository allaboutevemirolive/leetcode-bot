// https://leetcode.com/problems/contains-duplicate-iii/solutions/635490/rust-iterator-soln-slow-but-easy-to-understand/
impl Solution {
    pub fn contains_nearby_almost_duplicate(nums: Vec<i32>, k: i32, t: i32) -> bool {
        
        let iter = nums.iter();
        iter.clone()
            .enumerate()
            .any(|(i,a)| {
               iter.clone()
                    .skip(i+1)
                    .take(k as usize)
                    .map(|&b| b.overflowing_sub(*a))
                    .filter(|(diff,overflow)| !overflow && diff != &std::i32::MIN)
                    .any(|(diff,_)| diff.abs() <= t) 
            })
        
    }
}