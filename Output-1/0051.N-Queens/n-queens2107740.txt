// https://leetcode.com/problems/n-queens/solutions/2107740/rust-yet-another-backtracking-solution/
impl Solution {
    pub fn solve_n_queens(n: i32) -> Vec<Vec<String>> {
        let mut dp = vec![vec![0; n as usize]; n as usize];
        let mut ans = Vec::new();
        Self::backtrack(0, &mut dp, &mut ans);
        ans
    }
    
    fn backtrack(row: usize, dp: &mut Vec<Vec<i32>>, ans: &mut Vec<Vec<String>>) {
        if row == dp.len() {
            ans.push(dp.iter().map(|v|
                v.iter().map(|&x|
                    if x == -1 { 'Q' } else { '.' }
                ).collect()
            ).collect());
            return;
        }
        for col in 0..dp.len() {
            if dp[row][col] == 0 {
                dp[row][col] = -1;
                Self::mark_range(row, col, 0, row as i32 + 1, dp);
                Self::backtrack(row + 1, dp, ans);
                Self::mark_range(row, col, row as i32 + 1, 0, dp);
                dp[row][col] = 0;
            }
        }
    }
    
    fn mark_range(row: usize, col: usize, from: i32, to: i32, dp: &mut Vec<Vec<i32>>) {
        for dist in 1..dp.len() - row {
            Self::mark_cell(row + dist, col as i32 - dist as i32, from, to, dp);
            Self::mark_cell(row + dist, col as i32, from, to, dp);
            Self::mark_cell(row + dist, col as i32 + dist as i32, from, to, dp);
        }
    }
    
    fn mark_cell(row: usize, col: i32, from: i32, to: i32, dp: &mut Vec<Vec<i32>>) {
        if row < dp.len() && col >= 0 && col < dp.len() as i32
        && dp[row][col as usize] == from {
            dp[row][col as usize] = to;
        }
    }
}