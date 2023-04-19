// https://leetcode.com/problems/find-median-from-data-stream/solutions/1330777/rust-binary-search-solution/
#[derive(Default)]
struct MedianFinder {
    vec: Vec<i32>
}

impl MedianFinder {

    fn new() -> Self {
        Default::default()
    }
    
    // O(n)
    fn add_num(&mut self, num: i32) {
        // binary-search: find first el gte num
        let mut l = 0;
        let mut r = self.vec.len();
        while l < r {
            let mid = l + (r - l) / 2;
            if self.vec[mid] < num {
                l = mid + 1;
            } else {
                r = mid;
            }
        }
        if l < self.vec.len() && self.vec[l] < num { l += 1; }
        self.vec.insert(l, num);
    }
    
    // O(1)
    fn find_median(&self) -> f64 {
        let len = self.vec.len();
        if len % 2 == 0 {
            (self.vec[len / 2] as f64 + self.vec[len / 2 - 1] as f64) / 2_f64
        } else {
            self.vec[len / 2] as f64
        }
    }
}