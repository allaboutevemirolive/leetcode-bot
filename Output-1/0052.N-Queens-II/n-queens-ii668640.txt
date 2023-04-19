// https://leetcode.com/problems/n-queens-ii/solutions/668640/rust-backtracking-solution-with-o-n-memory-and-0ms-runtime/
type QueenPositions = Vec<Option<i16>>;

impl Solution {
    pub fn total_n_queens(n: i32) -> i32 {
        let mut queens: QueenPositions = vec![None; n as usize];
        count_queen_configs(&mut queens, 0)
    }
}

fn count_queen_configs(queens: &mut QueenPositions, row: usize) -> i32 {
    if row >= queens.len() {
        return 1;
    }

    (0..queens.len())
    .map(|col| {
        if is_invalid_pos(queens, row as i16, col as i16) {
            return 0;
        }
        
        queens[row] = Some(col as i16);
        let result = count_queen_configs(queens, row + 1);
        queens[row] = None;
        
        result
    })
    .sum()
}

fn is_invalid_pos(queens: &QueenPositions, row: i16, col: i16) -> bool {
    queens.iter().enumerate()
    .filter_map(|(other_row, other_col)| match other_col {
        Some(column) => Some((other_row, column)),
        None => None,
    })
    .any(|(other_row, other_col)| {
        let column_invalid = *other_col == col;
        let main_diagonal_invalid = (col - *other_col) == (row - other_row as i16);
        let off_diagonal_invalid  = other_row as i16 == -(*other_col) + (row + col);
        column_invalid || main_diagonal_invalid || off_diagonal_invalid
    })
}
