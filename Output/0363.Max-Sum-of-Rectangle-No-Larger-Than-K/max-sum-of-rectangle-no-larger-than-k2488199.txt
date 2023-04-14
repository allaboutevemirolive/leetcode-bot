// https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k/solutions/2488199/rust-with-btreeset-and-prefix-sum/
use std::collections::BTreeSet;

impl Solution {
    pub fn max_sum_submatrix(matrix: Vec<Vec<i32>>, k: i32) -> i32 {
        let pre = Self::prefix_sum_2d(&matrix);
        let mut ans = i32::MIN;
        for row1 in 0..pre.len() - 1 {
            for row2 in row1 + 1..pre.len() {
                let mut set = BTreeSet::from([0]);
                for col in 1..pre[0].len() {
                    let diff = pre[row2][col] - pre[row1][col];
                    if let Some(x) = set.range(diff - k..).next() {
                        ans = ans.max(diff - x);
                    }
                    set.insert(diff);
                }
            }
        }
        ans
    }

    fn prefix_sum_2d(matrix: &Vec<Vec<i32>>) -> Vec<Vec<i32>> {
        let mut ans = vec![vec![0; matrix[0].len() + 1]; matrix.len() + 1];
        for i in 0..matrix.len() {
            for j in 0..matrix[0].len() {
                ans[i + 1][j + 1] = ans[i][j + 1] + ans[i + 1][j] - ans[i][j] + matrix[i][j];
            }
        }
        ans
    }
}