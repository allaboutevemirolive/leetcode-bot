// https://leetcode.com/problems/find-median-from-data-stream/solutions/2805141/rust-simple-two-pq-solution/
use std::collections::BinaryHeap;

struct MedianFinder {
    low: BinaryHeap<i32>,
    up: BinaryHeap<i32>
}


/** 
 * `&self` means the method takes an immutable reference.
 * If you need a mutable reference, change it to `&mut self` instead.
 */
impl MedianFinder {

    fn new() -> Self {
        Self { low: BinaryHeap::new(), up: BinaryHeap::new() }
    }
    
    fn add_num(&mut self, num: i32) {
        self.low.push(num);

        let a = self.low.pop().unwrap();
        self.up.push(-a); 

        if self.up.len() <= self.low.len() + 1 { return }
        let a = self.up.pop().unwrap();
        self.low.push(-a);
    }
    
    fn find_median(&self) -> f64 {
        if self.low.len() < self.up.len() {
            return -*self.up.peek().unwrap() as f64
        }

        (*self.low.peek().unwrap() as f64 - *self.up.peek().unwrap() as f64) / 2.0
    }
}


/**
 * Your MedianFinder object will be instantiated and called as such:
 * let obj = MedianFinder::new();
 * obj.add_num(num);
 * let ret_2: f64 = obj.find_median();
 */