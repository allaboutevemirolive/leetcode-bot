// https://leetcode.com/problems/find-median-from-data-stream/solutions/2806232/rust-double-balanced-heap-solution-relatively-easy-to-understand/
use std::collections::BinaryHeap;

struct MedianFinder {
    heap_one: BinaryHeap<i32>,
    // will contain -x ==> min heap
    heap_two: BinaryHeap<i32>,
}


/** 
 * `&self` means the method takes an immutable reference.
 * If you need a mutable reference, change it to `&mut self` instead.
 */
impl MedianFinder {

    fn new() -> Self {
        Self { heap_one: BinaryHeap::new(), heap_two: BinaryHeap::new() }
    }
    
    fn add_num(&mut self, num: i32) {
        let (mut h1, mut h2) = (&mut self.heap_one, &mut self.heap_two);
        let (l1, l2) = (h1.len(), h2.len());
        
        if l1 == 0 {
            h1.push(num);
            return;
        }
        
        if l1 == l2 {
            if *h1.peek().unwrap() > num {
                h1.push(num);
            } else {
                h2.push(-num);
            }
        } else if l1 < l2 {
            if -*h2.peek().unwrap() < num {
                h1.push(-h2.pop().unwrap());
                h2.push(-num);
                return;
            } else {
                h1.push(num);
            }
        } else {
            if *h1.peek().unwrap() > num {
                h2.push(-h1.pop().unwrap());
                h1.push(num);
                return;
            } else {
                h2.push(-num);
            }
        }
    }
    
    fn find_median(&self) -> f64 {
        let (h1, h2) = (&self.heap_one, &self.heap_two);
        let (l1, l2) = (h1.len(), h2.len());
                
        if l1 == 0 {
            if l2 == 0 {
                return 0.0;
            }
            return -*h2.peek().unwrap() as f64;
        } else if l2 == 0 {
            return *h1.peek().unwrap() as f64;
        }
                        
        if l1 == l2 {
            return ((*h1.peek().unwrap() as f64) + (-*h2.peek().unwrap() as f64)) / 2.0;
        } else if l1 < l2 {
            return -*h2.peek().unwrap() as f64;
        } else {
            return *h1.peek().unwrap() as f64;
        }
    }
}

/**
 * Your MedianFinder object will be instantiated and called as such:
 * let obj = MedianFinder::new();
 * obj.add_num(num);
 * let ret_2: f64 = obj.find_median();
 */