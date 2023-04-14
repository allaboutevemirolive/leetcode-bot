// https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k/solutions/2489628/rust-prefix-sum-btreeset/
use std::collections::BTreeSet;

impl Solution {
    pub fn max_sum_submatrix(matrix: Vec<Vec<i32>>, k: i32) -> i32 {
        let (m, n) = (matrix.len(), matrix[0].len());
        let mut sum = vec![vec![0; n + 1]; m + 1];
        
        for i in 0..m {
            for j in 0..n {
                sum[i + 1][j + 1] = sum[i + 1][j] + matrix[i][j] as i64;
            }
        }
        
        for j in 0..n {
            for i in 0..m {
                sum[i + 1][j + 1] += sum[i][j + 1];
            }
        }
        
        let mut ret = i32::MIN;
        for i in 0..m {
            for u in i..m {
                let mut s = BTreeSet::<i64>::new();
                s.insert(0);
                for j in 0..n {
                    let t = sum[u + 1][j + 1] - sum[i][j + 1];
                    for a in s.range((t - k as i64)..) {
                        ret = ret.max((t - *a) as i32);
                        break
                    }
                    s.insert(t);
                }
            }                
        }
        
        ret
    }
}