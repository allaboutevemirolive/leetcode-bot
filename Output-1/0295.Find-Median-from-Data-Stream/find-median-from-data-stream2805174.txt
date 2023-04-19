// https://leetcode.com/problems/find-median-from-data-stream/solutions/2805174/rust-unoptimized-but-easy/
struct MedianFinder {
    vec: Vec<i32>
}

impl MedianFinder {

    fn new() -> Self {
        Self { vec: Vec::new() }
    }
    
    fn add_num(&mut self, num: i32) {
        let pos = self.vec.binary_search(&num).unwrap_or_else(|e| e);
        self.vec.insert(pos, num);
    }
    
    fn find_median(&self) -> f64 {
        let half = self.vec.len() / 2;
        match self.vec.len() % 2 == 0 {
            false => self.vec[half] as f64,
            true  => (self.vec[half] + self.vec[half - 1]) as f64 / 2.0,
        }
    }
}