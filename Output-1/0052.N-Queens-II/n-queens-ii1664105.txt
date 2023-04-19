// https://leetcode.com/problems/n-queens-ii/solutions/1664105/backtracking-rust-solution/
impl Solution {
    fn is_not_under_attach(place: &[usize], row: usize, col: usize) -> bool {
        for r in 1..place.len() {
            let c = place[r];

            // on the row or the column
            if row == r || col == c {
                return false;
            }

            // on diagonals
            let r_distance = if row > r { row - r } else { r - row };
            let c_distace = if col > c { col - c } else { c - col };
            if r_distance == c_distace {
                return false;
            }
        }

        return true;
    }

    fn backtrack_nqueen(place: &mut [usize], n: usize, row: usize) -> i32 {
        let mut count = 0;

        for col in 1..=n {
            if Self::is_not_under_attach(&place[0..row], row, col) {
                place[row] = col;

                if row == n {
                    count = 1;
                } else {
                    count += Self::backtrack_nqueen(place, n, row + 1);
                }

                place[row] = 0;
            }
        }

        count
    }

    pub fn total_n_queens(n: i32) -> i32 {
        let n = n as usize;
        let mut place = vec![0; n + 1];
        Solution::backtrack_nqueen(&mut place, n, 1)
    }
}