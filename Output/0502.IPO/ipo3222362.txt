// https://leetcode.com/problems/ipo/solutions/3222362/basic-solution-using-sort-binary-search-max-heap/
use std::collections::BinaryHeap;

impl Solution {
    pub fn find_maximized_capital(k: i32, mut w: i32, profits: Vec<i32>, capital: Vec<i32>) -> i32 {
        let mut worker = capital
            .into_iter()
            .zip(profits.into_iter())
            .collect::<Vec<_>>();
        worker.sort_unstable_by(|&(captial_1, _), (captial_2, _)| captial_1.cmp(&captial_2));

        let mut available = &worker[..];
        let mut heap = BinaryHeap::new();
        for _ in 0..k {
            let slice = available.partition_point(|&(cap, _)| cap <= w);
            let working_slice = &available[..slice];
            available = &available[slice..];
            for &(_, prof) in working_slice {
                heap.push(prof);
            }
            if let Some(prof) = heap.pop() {
                w += prof;
            } else {
                break;
            }
        }
        w
    }
}