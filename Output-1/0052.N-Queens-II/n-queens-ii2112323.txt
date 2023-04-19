// https://leetcode.com/problems/n-queens-ii/solutions/2112323/rust-super-clean-functional-solution/
impl Solution {
    pub fn total_n_queens(n: i32) -> i32 {
        fn is_valid(board: &Vec<u16>, new_row: u16) -> bool {
            board.iter().rev().enumerate().all(|(i, row)|
                row & new_row == 0 // check if there are queens in the same columns of previous rows
                && row & (new_row << (i+1)) == 0 // check if there are queens in the top left diagonal of previous rows
                && row & (new_row >> (i+1)) == 0) // check if there are queens in the top right diagonal of previous rows
        }
        
        (0..n).fold(vec![vec![]], |boards, _| {
            (0..n).map(|i| 1_u16 << i).fold(vec![], |mut new_boards, row| {
                boards.iter().filter(|board| is_valid(board, row)).cloned().for_each(|mut board| {
                    board.push(row);
                    new_boards.push(board);
                });
                new_boards
            })
        }).len() as i32
    }
}