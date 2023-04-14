// https://leetcode.com/problems/n-queens/solutions/2109962/rust-recursive-dfs/
impl Solution {
    fn dfs(
        n: usize,
        row: usize,
        cols: &mut Vec<bool>,
        diags1: &mut Vec<bool>,
        diags2: &mut Vec<bool>,
        board: &mut Vec<Vec<bool>>,
        mut rez: Vec<Vec<String>>,
    ) -> Vec<Vec<String>> {
        // n queens on an n*n board means that we have to place one queen on each row.
        if row == n {
            // Valid solution found - map board to output format
            rez.push(
                board
                    .iter()
                    .map(|row| {
                        row.iter()
                            .map(|element| if *element { 'Q' } else { '.' })
                            .collect()
                    })
                    .collect(),
            );
            rez
        } else {
            for col in 0..n {
                let diag1 = row + col;
                let diag2 = (row + n) - col;
                // Check if column and diagonals are free
                if !cols[col] && !diags1[diag1] && !diags2[diag2] {
                    // Set column and diagonals as occupied,
                    // and update board state.
                    cols[col] = true;
                    diags1[diag1] = true;
                    diags2[diag2] = true;
                    board[row][col] = true;

                    // Recurse to next row
                    rez = Self::dfs(n, row + 1, cols, diags1, diags2, board, rez);

                    // Backtrack
                    cols[col] = false;
                    diags1[diag1] = false;
                    diags2[diag2] = false;
                    board[row][col] = false;
                }
            }
            rez
        }
    }

    pub fn solve_n_queens(n: i32) -> Vec<Vec<String>> {
        let n = n as usize;
        Self::dfs(
            n,
            0,
            &mut vec![false; n],
            &mut vec![false; 2 * n + 1],
            &mut vec![false; 2 * n + 1],
            &mut vec![vec![false; n]; n],
            vec![],
        )
    }
}