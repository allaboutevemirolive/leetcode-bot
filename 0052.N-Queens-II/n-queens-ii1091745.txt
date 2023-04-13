// https://leetcode.com/problems/n-queens-ii/solutions/1091745/rust-backtracking/
impl Solution {
    pub fn total_n_queens(n: i32) -> i32 {
        let mut res = 0;
        let mut queens = vec![];
        Self::dfs(n, &mut queens, &mut res, (0, 0));
        res
    }

    fn dfs(n: i32, queens: &mut Vec<(i32, i32)>, res: &mut i32, cur: (i32, i32)) {
        if cur.0 == n {
            if queens.len() as i32 == n {
                *res += 1;
            }
            return;
        }

        if Self::is_not_under_attack(&queens, cur) {
            queens.push(cur);
            Self::dfs(n, queens, res, (cur.0 + 1, 0));
            queens.pop();
        }
        if cur.1 < n - 1 {
            Self::dfs(n, queens, res, (cur.0, cur.1 + 1));
        } else {
            Self::dfs(n, queens, res, (cur.0 + 1, 0));
        }
    }

    fn is_not_under_attack(queens: &[(i32, i32)], pos: (i32, i32)) -> bool {
        for queen in queens {
            if pos.0 == queen.0
                || pos.1 == queen.1
                || ((pos.0 - queen.0).abs() == (pos.1 - queen.1).abs())
            {
                return false;
            }
        }
        true
    }
}