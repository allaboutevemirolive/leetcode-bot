// https://leetcode.com/problems/n-queens/solutions/3173533/rust-0ms-2-2-mb-no-hashsets/
use std::collections::HashSet;
impl Solution {
    pub fn solve_n_queens(n: i32) -> Vec<Vec<String>> {
        
        /*
            1. Generate the base value 
            2. Set restriction 
        */
        let mut n = n as usize;
        let mut res: Vec<Vec<String>> = vec![];
        let mut board: Vec<Vec<char>> = vec![vec!['.'; n]; n];
        Self::generate_sol(&mut board, &mut res, 0, n); 
        return res;
    }
    fn generate_sol(
        board: &mut Vec<Vec<char>>,
        mut res: &mut Vec<Vec<String>>, 
        mut col: usize, 
        n: usize,
    ) {
        
        if col == n  { 
            res.push(
                board.iter()
                    .map(|f| f.iter().collect())
                    .collect::<Vec<String>>()
            );
            return;
        } 
        for row in 0..n { 
            if Self::is_valid(board, row, col, n) {
                board[row][col] = 'Q';

                Self::generate_sol(board, res, col + 1, n);

                board[row][col] = '.';
            }
        }
    }
    fn is_valid(board: &mut Vec<Vec<char>>, row: usize, col: usize, n: usize) -> bool {
        for c in 0..col {
            if board[row][c] == 'Q' {
                return false;
            }
            let row_delta = col - c;
            if row >= row_delta && board[row - row_delta][c] == 'Q' {
                return false;
            }
            
            if row + row_delta < n && board[row + row_delta][c] == 'Q' {
                return false;
            }
        }
        return true;
    }
}