// https://leetcode.com/problems/ipo/solutions/3223418/rust-binaryheap/
use std::{cmp::Reverse, collections::BinaryHeap};
impl Solution {
    pub fn find_maximized_capital(k: i32, mut w: i32, profits: Vec<i32>, capital: Vec<i32>) -> i32 {
        let len = profits.len();
        let mut min_cap = BinaryHeap::with_capacity(len);
        let mut max_profit = BinaryHeap::with_capacity(len);
        capital
            .iter()
            .zip(&profits)
            .for_each(|(i, j)| min_cap.push(Reverse((*i, *j))));
        for _ in 0..k {
            while !min_cap.is_empty() && min_cap.peek().unwrap().0 .0 <= w {
                let (_, p) = min_cap.pop().unwrap().0;
                max_profit.push(p);
            }
            if max_profit.is_empty() {
                break;
            }
            w += max_profit.pop().unwrap();
        }
        w
    }
}