// https://leetcode.com/problems/find-median-from-data-stream/solutions/2807021/rust-dequeue-2-solutions-faster-than-binaryheap/
use std::{cmp::Ordering, collections::VecDeque};

struct MedianFinder {
    arr: VecDeque<i32>,
}


impl MedianFinder {
    fn new() -> Self {
        MedianFinder {
            arr: VecDeque::new(),
        }
    }

    // adding number in sorted order - fast version with binary search
    fn add_num(&mut self, num: i32) {
        match (self.arr.front(), self.arr.back()) {
            (None, _) => self.arr.push_back(num),
            (Some(_), Some(back)) if back <= &num => self.arr.push_back(num),
            (Some(front), Some(_)) if front >= &num => self.arr.push_front(num),
            _ => {
                // find an index where value should be inserted in sorted order using binary
                let (mut left, mut right) = (0, self.arr.len());
                let mut idx = left + (right - left) / 2;
                while left < idx && idx < right {
                    match self.arr[idx].cmp(&num) {
                        Ordering::Equal => break,
                        Ordering::Greater => right = idx,
                        Ordering::Less => left = idx,
                    }
                    idx = left + (right - left) / 2;
                }
                self.arr.insert(idx + 1, num);
            }
        };
    }
    // adding number using built-in binary search, slower
    fn add_num_2(&mut self, num: i32) {
        let idx = match self.arr.binary_search(&num) {
            Ok(found) => found,
            Err(not_found) => not_found,
        };
        self.arr.insert(idx, num);
    }
	
    fn find_median(&self) -> f64 {
        let mid = self.arr.len() / 2;
        match self.arr.len() % 2 {
            1 => self.arr[mid] as f64,
            0 => (self.arr[mid] + self.arr[mid - 1]) as f64 / 2.0,
            _ => unreachable!(),
        }
    }
}

