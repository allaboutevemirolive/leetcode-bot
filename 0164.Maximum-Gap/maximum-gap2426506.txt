// https://leetcode.com/problems/maximum-gap/solutions/2426506/rust-3-line-solution/
impl Solution {
    pub fn maximum_gap(nums: Vec<i32>) -> i32 {
        let mut sorted = nums.clone();
        sorted.sort();
        sorted.iter().zip(sorted.iter().skip(1)).map(|(x, y)| y - x).max().unwrap_or(0)
    }
}