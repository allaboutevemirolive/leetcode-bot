// https://leetcode.com/problems/find-median-from-data-stream/solutions/2806134/rust-short-understandable-2-heaps-solution-79-runtime/
use std::cmp::Ordering::{Equal, Greater, Less};
use std::collections::{BinaryHeap, VecDeque};

#[derive(Default)]
struct MedianFinder {
    min: BinaryHeap<i32>,
    max: BinaryHeap<i32>,
}

/**
 * `&self` means the method takes an immutable reference.
 * If you need a mutable reference, change it to `&mut self` instead.
 */
impl MedianFinder {
    fn new() -> Self {
        Default::default()
    }

    fn add_num(&mut self, num: i32) {
        let v = [self.min.pop().map(|n| -n), self.max.pop(), Some(num)];
        let mut v: VecDeque<_> = v.iter().flatten().copied().collect();
        v.make_contiguous().sort_unstable();
        while !v.is_empty() {
            if self.min.len() < self.max.len() {
                self.min.push(-v.pop_back().unwrap());
            } else {
                self.max.push(v.pop_front().unwrap());
            }
        }
    }

    fn find_median(&self) -> f64 {
        match self.min.len().cmp(&self.max.len()) {
            Less => *self.max.peek().unwrap() as f64,
            Equal => (-*self.min.peek().unwrap() + *self.max.peek().unwrap()) as f64 / 2.,
            Greater => -*self.min.peek().unwrap() as f64,
        }
    }
}