// https://leetcode.com/problems/n-queens-ii/solutions/2201154/simple-efficient-rust-solution-o-n-space-complexity/
impl Solution {
    pub fn total_n_queens(n: i32) -> i32 {
        let n = n as usize;
        Solution::n_queens_recursive(0, &mut vec![true; n], &mut vec![(true, true); n * 2 - 1])
    }

    fn n_queens_recursive(row: usize, vertical: &mut [bool], diagonal: &mut [(bool, bool)]) -> i32 {
        if row == vertical.len() {
            1
        } else {
            let mut result = 0;
            for i in 0..vertical.len() {
                if vertical[i] && diagonal[i + row].0 && diagonal[vertical.len() - 1 + i - row].1 {
                    vertical[i] = false;
                    diagonal[i + row].0 = false;
                    diagonal[vertical.len() - 1 + i - row].1 = false;
                    result += Solution::n_queens_recursive(row + 1, vertical, diagonal);
                    vertical[i] = true;
                    diagonal[i + row].0 = true;
                    diagonal[vertical.len() - 1 + i - row].1 = true;
                }
            }
            result
        }
    }
}