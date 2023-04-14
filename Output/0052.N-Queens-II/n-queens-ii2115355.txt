// https://leetcode.com/problems/n-queens-ii/solutions/2115355/rust-recursive-dfs/
struct Queen {
    col: usize,
    diag1: usize,
    diag2: usize,
}

impl Solution {

    fn dfs(row: usize, n: usize, queens: &mut Vec<Queen>) -> i32 {
        let mut rez = 0;
        if row == n {
            rez = 1;
        } else {
            for col in 0..n {
                let diag1 = row + col;
                let diag2 = (row + n) - col;
                if queens.iter().all(|q| col != q.col && diag1 != q.diag1 && diag2 != q.diag2) {
                    queens.push(Queen { col, diag1, diag2 });
                    rez += Self::dfs(row + 1, n, queens);
                    queens.pop();
                }
            }
        }
        rez
    }

    pub fn total_n_queens(n: i32) -> i32 {
        Self::dfs(0, n as usize, &mut vec![])
    }
}