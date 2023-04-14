// https://leetcode.com/problems/n-queens/solutions/3356507/rust-dfs-solution/
impl Solution {
    pub fn solve_n_queens(n: i32) -> Vec<Vec<String>> {
        let field = vec![vec!['+';n as usize]; n as usize];
        let mut res = vec![];
        Self::dfs(&field, 0, &mut res);
        res
    }
    pub fn dfs(field: &Vec<Vec<char>>, i:  usize, res: &mut Vec<Vec<String>>) {
        if i == field.len() {
            res.push(field.iter().map(|v| v.into_iter().collect::<String>()).collect::<Vec<String>>());
            return;
        }
        if let Some(js) = Self::get_nexts(field, i) {
            js.iter().for_each(|&j|{
                let mut new_field = field.clone();
                Self::fill_board(&mut new_field, (i, j));
                Self::dfs(&new_field, i + 1, res);
            });
        }
    }

    pub fn fill_board(board: &mut Vec<Vec<char>>, (mut i, mut j): (usize, usize)) {
        board[i][j] = 'Q';
        for jj in 0..board[i].len() {
            if board[i][jj] == '+' {
                board[i][jj] = '.';
            }
        }
        for ii in 0..board.len() {
            if board[ii][j] == '+' {
                board[ii][j] = '.';
            }
        }
        let mut jl = j as i32;
        let mut jr = j;
        while i < board.len() {
            if jr != board[0].len() {
                if board[i][jr] == '+' {
                    board[i][jr] = '.';
                }
                jr += 1;
            }
            if jl != -1 {
                if board[i][jl as usize] == '+' {
                    board[i][jl as usize] = '.';
                }
                jl -= 1;
            }
            i += 1;
        }
    }

    pub fn get_nexts(board: &[Vec<char>], i: usize) -> Option<Vec<usize>> {
        let mut res = vec![];
        for (j, &val) in board[i].iter().enumerate() {
            if val == '+' {
                res.push(j);
            }
        }
        if res.is_empty() {
            return None
        }
        Some(res)
    }
}