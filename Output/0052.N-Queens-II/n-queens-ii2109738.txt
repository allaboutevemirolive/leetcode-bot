// https://leetcode.com/problems/n-queens-ii/solutions/2109738/rust-2-backtracking-solutions-with-explanation/
pub fn total_n_queens(n: i32) -> i32 {
    assert!(n >= 1 && n <= 9);
    let n: usize = n.try_into().unwrap();

    backtrack(&mut vec![vec![b'.'; n]; n], 0)
}

fn backtrack(board: &mut Vec<Vec<u8>>, row: usize) -> i32 {
    if row == board.len() {
        return 1;
    }

    let mut answer = 0;

    for col in 0..board.len() {
        if is_allowed(board, row, col) {
            board[row][col] = b'Q';
            answer += backtrack(board, row + 1);
            board[row][col] = b'.';
        }
    }

    answer
}

// check if placing a queen at <row, col> violates the queen positioning rules
fn is_allowed(board: &[Vec<u8>], row: usize, col: usize) -> bool {
    let n = board.len();

    for r in 0..n {
        if board[r][col] == b'Q' {
            return false;
        }
    }

    // Check top-left diagonal
    let mut r = row;
    let mut c = col;
    while r > 0 && c > 0 {
        r -= 1;
        c -= 1;

        if board[r][c] == b'Q' {
            return false;
        }
    }

    // Check top-right diagonal
    r = row;
    c = col;
    while r > 0 && c < n - 1 {
        r -= 1;
        c += 1;

        if board[r][c] == b'Q' {
            return false;
        }
    }


    // There is no need to check the bottom left & right diagonals, because 
    // we are moving from top to bottom - i.e. there ar eno queens placed below 
    // the current row, so this method cannot return false in that case

    true
}