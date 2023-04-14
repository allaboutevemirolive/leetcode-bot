// https://leetcode.com/problems/ipo/solutions/3221491/rust-two-priority-queues-with-comments/
use std::{cmp::Reverse, collections::BinaryHeap};

impl Solution {
    pub fn find_maximized_capital(k: i32, mut w: i32, profits: Vec<i32>, capital: Vec<i32>) -> i32 {
        let mut capital_heap = capital
            .into_iter()
            .zip(profits.into_iter())
            .map(|(c, p)| (Reverse(c), p))
            .collect::<BinaryHeap<_>>();
        let mut profit_heap = BinaryHeap::new();
        for _ in 0..k {
            loop {
                match capital_heap.peek().copied() {
                    Some((Reverse(c), p)) if c <= w => {
                        profit_heap.push(p);
                        capital_heap.pop();
                    }
                    _ => break,
                }
            }
            match profit_heap.pop() {
                Some(p) => w += p,
                None => break,
            }
        }
        w
    }
}