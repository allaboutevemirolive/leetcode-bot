// https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k/solutions/2488931/rust-faster-than-100-less-memory-than-100/
impl Solution {
    pub fn max_sum_submatrix(matrix: Vec<Vec<i32>>, k: i32) -> i32 {
        let mut fin = i32::MIN;
        let (rows, cols) = (matrix.len(), matrix[0].len());
        let mut row_sum = vec![0; rows];
        for x in 0..cols {
            for y in x..cols {
                for z in 0..rows {
                    row_sum[z] += matrix[z][y];
                }
                for z in 0..rows {
                    let mut sum = 0;
                    for w in z..rows {
                        sum += row_sum[w];
                        if sum > fin && sum <= k {
                            fin = sum;
                        }
                    }
                }
            }
            row_sum.fill_with(Default::default);
        }
        fin
    }
}