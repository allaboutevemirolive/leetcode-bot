// https://leetcode.com/problems/find-median-from-data-stream/solutions/2012930/rust-binary-heap-solution/
use std::collections::BinaryHeap;
use std::cmp::Reverse;

#[derive(Default)]
struct MedianFinder {
    left: BinaryHeap<i32>,
    right: BinaryHeap<Reverse<i32>>,
}

impl MedianFinder {

    fn new() -> Self {
        Default::default()
    }
    
    fn add_num(&mut self, num: i32) {
        let l = &mut self.left;
        let r = &mut self.right;
        
        l.push(num);
        r.push(Reverse(l.pop().unwrap()));
        
        if l.len() < r.len(){
            let Reverse(n) = r.pop().unwrap();
            l.push(n);
        }
    }
    
    fn find_median(&self) -> f64 {
        let l = &self.left;
        let r = &self.right;
        
        if l.len() == r.len(){
            let a = *l.peek().unwrap();
            let Reverse(b) = *r.peek().unwrap();
            (a + b) as f64 / 2_f64
        }else{
            *l.peek().unwrap() as f64
        }
    }
}