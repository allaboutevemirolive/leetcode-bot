// https://leetcode.com/problems/find-median-from-data-stream/solutions/2525268/rust-vecdeque-binarysearch-two-binary-heaps-with-explanation/
use std::collections::VecDeque;

#[derive(Default)]
struct MedianFinder {
    stream: VecDeque<i32>,
}

impl MedianFinder {
    fn new() -> Self {
        Default::default()
    }

    fn add_num(&mut self, num: i32) {
        let idx = self.stream.binary_search(&num).unwrap_or_else(|e| e);
        self.stream.insert(idx, num);
    }

    fn find_median(&self) -> f64 {
        let len = self.stream.len();
        if len % 2 != 0 {
            return self.stream[len / 2] as f64;
        }

        return (self.stream[(len - 1) / 2] + self.stream[len / 2]) as f64 / 2.0;
    }
}