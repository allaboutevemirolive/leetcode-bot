// https://leetcode.com/problems/find-median-from-data-stream/solutions/2806508/easy-rust-solution-heap/
use std::cmp::Reverse;
use std::collections::BinaryHeap;

#[derive(Default)]
struct MedianFinder {
    lo: BinaryHeap<i32>,
    hi: BinaryHeap<Reverse<i32>>,
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
        self.lo.push(num);
        self.hi.push(Reverse(self.lo.pop().unwrap()));
        if self.lo.len() < self.hi.len() {
            self.lo.push(self.hi.pop().unwrap().0);
        }
    }

    fn find_median(&self) -> f64 {
        if self.lo.len() == self.hi.len() {
            return (self.lo.peek().unwrap() + self.hi.peek().unwrap().0) as f64 / 2.0;
        }
        *self.lo.peek().unwrap() as f64
    }
}

/**
 * Your MedianFinder object will be instantiated and called as such:
 * let obj = MedianFinder::new();
 * obj.add_num(num);
 * let ret_2: f64 = obj.find_median();
 */