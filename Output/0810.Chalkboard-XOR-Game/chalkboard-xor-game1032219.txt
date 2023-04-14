// https://leetcode.com/problems/chalkboard-xor-game/solutions/1032219/rust-solution/
impl Solution {
    pub fn xor_game(nums: Vec<i32>) -> bool {
        let tot = nums.iter()
                      .fold(0, |z, e| z^e);
        tot == 0 || nums.len() % 2 == 0   
    }
}