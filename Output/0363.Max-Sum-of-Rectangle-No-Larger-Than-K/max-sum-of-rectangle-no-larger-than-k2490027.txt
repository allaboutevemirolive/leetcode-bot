// https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k/solutions/2490027/rust-100-faster-100-smaller-2d-prefix-sum/
impl Solution {
    pub fn max_sum_submatrix(mut matrix: Vec<Vec<i32>>, k: i32) -> i32 {
        let m = matrix.len();
        let n = matrix[0].len();

        for i in 0..m {
            for j in 0..n {
                if i == 0 {
                    if j != 0 {
                        matrix[i][j] += matrix[i][j - 1]; // First row prefix sum
                    }
                } else if j == 0 {
                    matrix[i][j] += matrix[i - 1][j]; // first column prefix sum
                } else {
                    matrix[i][j] += matrix[i - 1][j] + matrix[i][j - 1] - matrix[i - 1][j - 1];
                    // top + left - diagonal
                }
            }
        }

        let mut max_sum = i32::MIN;

        for i1 in 0..m {
            for j1 in 0..n {
                for i2 in i1..m {
                    for j2 in j1..n {
                        let s = Self::sum(&matrix, (i1, j1), (i2, j2));
                        // dbg!(s);
                        if s <= k && s > max_sum {
                            max_sum = s;
                        }
                    }
                }
            }
        }

        max_sum
    }

    fn sum(matrix: &[Vec<i32>], top_left: (usize, usize), bottom_right: (usize, usize)) -> i32 {
        let (i1, j1) = top_left;
        let (i2, j2) = bottom_right;

        let mut total = matrix[i2][j2];

        if i1 == 0 && j1 == 0 {
        } else if i1 == 0 {
            total -= matrix[i2][j1 - 1];
        } else if j1 == 0 {
            total -= matrix[i1 - 1][j2];
        } else {
            total -= matrix[i2][j1 - 1] + matrix[i1 - 1][j2] - matrix[i1 - 1][j1 - 1];
        }

        total
    }
}

#[test]
fn test() {
    dbg!(Solution::max_sum_submatrix(
        vec![vec![2, 2, -1]],
        3
    ));
}
