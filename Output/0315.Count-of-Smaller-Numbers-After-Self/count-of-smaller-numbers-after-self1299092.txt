// https://leetcode.com/problems/count-of-smaller-numbers-after-self/solutions/1299092/quick-n-dirty-naive-rust-solution-accepted/
impl Solution {
    pub fn count_smaller(nums: Vec<i32>) -> Vec<i32> {
        nums
            .iter()
            .enumerate()
            .map(|(i, &n)|
                nums[i + 1..]
                    .iter()
                    .fold(0, |acc, &n2| acc + if n2 < n { 1 } else { 0 }))
            .collect()
    }
}