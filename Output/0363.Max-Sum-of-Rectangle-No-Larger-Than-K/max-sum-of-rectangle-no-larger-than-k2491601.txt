// https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k/solutions/2491601/rust-functional-style/
use std::collections::BTreeSet;

impl Solution {
    pub fn max_sum_submatrix(matrix: Vec<Vec<i32>>, k: i32) -> i32 {
        let mut set = BTreeSet::<i32>::new();
        let (n, m) = (matrix.len(), matrix[0].len());
        (0..n).map(|i| {
            let mut acc = vec![0; m];
            matrix.iter().skip(i).map(|row| {
                set.clear();
                set.insert(0);
                let mut prefix_sum = 0;
                acc.iter_mut().zip(row.iter()).map(|(a, r)| {
                    *a += r;
                    prefix_sum += *a;
                    let rez = set.range(prefix_sum - k..).next().map(|s| prefix_sum - *s);
                    set.insert(prefix_sum);
                    rez
                }).max()
            }).max()
        }).max().unwrap().unwrap().unwrap().unwrap()
    }
}