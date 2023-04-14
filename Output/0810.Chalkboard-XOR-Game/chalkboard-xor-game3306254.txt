// https://leetcode.com/problems/chalkboard-xor-game/solutions/3306254/rust-2-line-solution/
impl Solution {
    pub fn xor_game(nums: Vec<i32>) -> bool {
        let xor_sum: i32 = nums.iter().fold(0, |acc, &x| acc ^ x);
        xor_sum == 0 || nums.len() % 2 == 0
    }
}