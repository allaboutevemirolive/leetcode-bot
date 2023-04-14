// https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k/solutions/1313574/rust-translated-prefix-sum-on-1d-array-using-sorted-container/
use std::collections::BTreeSet;

impl Solution {
    pub fn max_sum_submatrix(matrix: Vec<Vec<i32>>, k: i32) -> i32 {
        let (row, col) = (matrix.len(), matrix[0].len());
        let mut answer = std::i32::MIN;
        for i in 0..row {
            let mut rowsum = vec![0; col];
            for r in matrix.iter().skip(i) {
                rowsum.iter_mut().zip(r).for_each(|(sum, val)| *sum += val);
                let mut sum = 0;
                let mut bts = BTreeSet::new();
                bts.insert(0);
                for val in &rowsum {
                    sum += val;
                    if let Some(x) = bts.range(sum - k..).next() {
                        answer = answer.max(sum - x);
                        if answer == k {
                            return k;
                        }
                    };
                    bts.insert(sum);
                }
            }
        }
        answer
    }
}