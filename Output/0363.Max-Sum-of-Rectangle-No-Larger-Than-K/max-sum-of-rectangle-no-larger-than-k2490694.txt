// https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k/solutions/2490694/simple-prefix-sum-rust-solution-100-faster/
impl Solution {
    pub fn max_sum_submatrix(matrix: Vec<Vec<i32>>, k: i32) -> i32 {
        let n = matrix.len();
        let m = matrix[0].len();
        let mut ans = std::i32::MIN;
        let mut p = vec![vec![0; m + 1]; n + 1];
        
        for j in 1..=m {
            p[1][j] = p[1][j-1] + matrix[0][j-1];
        }
        
        for i in 1..=n {
            p[i][1] = p[i-1][1] + matrix[i-1][0];
        }
        
        for i in 2..=n {
            for j in 2..=m {
                p[i][j] = p[i-1][j] + p[i][j-1] - p[i-1][j-1] + matrix[i-1][j-1];
            }
        }
        
        for i in 0..n {
            for j in 0..m {
                for si in 1..=n-i {
                    for sj in 1..=m-j {
                        let cur_sum = p[i+si][j+sj] - p[i][j+sj] - p[i+si][j] + p[i][j];
                        if cur_sum <= k && cur_sum > ans {
                            ans = cur_sum;
                        }
                    }
                }
            }
        }
        
        ans
    }
}