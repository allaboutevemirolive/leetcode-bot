// https://leetcode.com/problems/dungeon-game/solutions/1776229/rust-iterative-dp-approach/
impl Solution {
    pub fn calculate_minimum_hp(dungeon: Vec<Vec<i32>>) -> i32 {
        
        let m = dungeon.len();
        let n = dungeon[0].len();
        
        // allocate 2d vec to store required health to move from each row,col to finish
        let mut hp : Vec<Vec<i32>> = vec![vec![0; n]; m];
        
        // calculate goal room beforehand, because there are no moves that can be made there
        // so it cannot be calcuated like the rest
        hp[m-1][n-1] = (1 - dungeon[m-1][n-1]).max(1);
        
        for row in (0..m).rev() {
            for col in (0..n).rev() {
                if !(row == m-1 && col == n-1) {
                    // calculate what is needed to move from the current room to the rooms below and on the right,
                    // then choose the minimum of those 2 moves and subtract the current room's value
                    let need = (if row >= m-1 {i32::MAX} else {hp[row+1][col]}).min(if col >= n-1 {i32::MAX} else {hp[row][col+1]})-dungeon[row][col];
                    // if the resulting need is negative or 0, default to 1 because knight's health cannot go below 1
                    hp[row][col] = if need <= 0 {1} else {need};
                }
            }
        }
        
        // return required health to move from 0,0 to goal
        return hp[0][0];
}