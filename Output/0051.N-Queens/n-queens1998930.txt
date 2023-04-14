// https://leetcode.com/problems/n-queens/solutions/1998930/rust-backtracking-solution-with-explanation/
impl Solution {
 pub fn solve_n_queens(n: i32) -> Vec<Vec<String>> {
  let solution: &mut Vec<Vec<String>> = &mut vec![];
  let board = &mut vec![vec![String::from("."); n as usize]; n as usize];
  Solution::backtrack(board, solution, 0, n);
  solution.to_vec()
 }

 pub fn backtrack(
  board: &mut Vec<Vec<String>>,
  solution: &mut Vec<Vec<String>>,
  row: usize,
  n: i32,
 ) {
  if row == n as usize {
   let mut set = vec![];
   for val in board {
    set.push(val.join(""))
   }
   solution.push(set);
   return;
  }

  for col in 0..n {
   if Solution::validate_spot(board, row, col as usize) {
    board[row][col as usize] = String::from("Q");
    Solution::backtrack(board, solution, row + 1, n);
    board[row][col as usize] = String::from(".");
   }
  }
 }

 pub fn validate_spot(board: &mut Vec<Vec<String>>, row: usize, col: usize) -> bool {
  Solution::validate_vertical(board, row, col)
   && Solution::validate_45_degree_diagonal(board, row, col)
   && Solution::validate_135_degree_diagonal(board, row, col)
 }

 pub fn validate_vertical(board: &mut Vec<Vec<String>>, row: usize, col: usize) -> bool {
  for r in 0..row {
   if board[r][col] == "Q".to_string() {
    return false;
   }
  }
  true
 }

 pub fn validate_45_degree_diagonal(board: &mut Vec<Vec<String>>, row: usize, col: usize) -> bool {
  let mut i = row as i32 - 1;
  let mut j = col as i32 - 1;
  while i >= 0 && j >= 0 {
   if board[i as usize][j as usize] == "Q".to_string() {
    return false;
   }
   i -= 1;
   j -= 1;
  }

  true
 }

 pub fn validate_135_degree_diagonal(board: &mut Vec<Vec<String>>, row: usize, col: usize) -> bool {
  let mut i = row as i32 - 1;
  let mut j = col as i32 + 1;
  while i >= 0 && j < board.len() as i32 {
   if board[i as usize][j as usize] == "Q".to_string() {
    return false;
   }
   i -= 1;
   j += 1;
  }

  true
 }
}