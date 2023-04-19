// https://leetcode.com/problems/n-queens/solutions/1961288/rust-solution/
impl Solution {
    fn board_to_res(board: &Vec<Vec<char>>) -> Vec<String> {
        let mut res = vec![];
        for i in board {
            let r: String = i.iter().collect();
            res.push(r);
        }
        res
    }

    fn valid(n: usize, board: &Vec<Vec<char>>, r: usize, c: usize) -> bool {
        for i in 0..n {
            if (r, i) != (r, c) {
                if board[r][i] == 'Q' {
                    return false;
                }
            }
            if (i, c) != (r, c) {
                if board[i][c] == 'Q' {
                    return false;
                }
            }
            let d0 = (r + c).overflowing_sub(i);
            let d1 = (c + i).overflowing_sub(r);
            if !d0.1 {
                let d0_i = (r + c - i, i);
                if d0_i != (r, c) && d0_i.0 < n {
                    if board[d0_i.0][d0_i.1] == 'Q' {
                        return false;
                    }
                }
            }
            if !d1.1 {
                let d1_i = (i, d1.0);
                if d1_i.1 <= n - 1 && d1_i != (r, c) {
                    if board[d1_i.0][d1_i.1] == 'Q' {
                        return false;
                    }
                }
            }
        }
        true
    }
    fn go_prevr(board: &mut Vec<Vec<char>>, r: i32, cur: &mut Vec<i32>, n: i32) -> (i32, i32) {
        let prev_r = r - 1;
        let prev_c = cur.get(prev_r as usize).cloned().unwrap_or(0);
        if prev_r > -1 && prev_r < n && prev_c > -1 && prev_c < n {
            board[prev_r as usize][prev_c as usize] = '.';
        }
        (prev_r, prev_c)
    }
    fn backtrack(
        n: i32,
        board: &mut Vec<Vec<char>>,
        r: i32,
        c: i32,
        res: &mut Vec<Vec<String>>,
        cur: &mut Vec<i32>,
    ) {
        if r < 0 {
            return;
        }
        if r == n {
            let board_res = Solution::board_to_res(&board);
            res.push(board_res);
            let (prev_r, prev_c) = Solution::go_prevr(board, r, cur, n);
            return Solution::backtrack(n, board, prev_r, prev_c + 1, res, cur);
        }
        if c >= n {
            let (prev_r, prev_c) = Solution::go_prevr(board, r, cur, n);
            return Solution::backtrack(n, board, prev_r, prev_c + 1, res, cur);
        }
        board[r as usize][c as usize] = 'Q';
        if Solution::valid(n as usize, board, r as usize, c as usize) {
            cur[r as usize] = c;
            Solution::backtrack(n, board, r + 1, 0, res, cur);
        } else {
            board[r as usize][c as usize] = '.';
            Solution::backtrack(n, board, r, c + 1, res, cur);
        }
    }
    pub fn solve_n_queens(n: i32) -> Vec<Vec<String>> {
        let n = n as usize;
        let mut cur = vec![-1; n];
        let mut board = vec![vec!['.'; n]; n];
        let mut res = Vec::new();
        Solution::backtrack(n as i32, &mut board, 0, 0, &mut res, &mut cur);
        res
    }
}