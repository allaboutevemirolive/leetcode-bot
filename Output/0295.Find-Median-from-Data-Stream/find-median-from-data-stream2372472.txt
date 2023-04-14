// https://leetcode.com/problems/find-median-from-data-stream/solutions/2372472/ordering-solution-in-rust-425ms-25mb/
struct MedianFinder {
    inner: Vec<i32>,
}

impl MedianFinder {
    fn new() -> Self {
        Self { inner: vec![] }
    }

    fn add_num(&mut self, num: i32) {
        for j in 0..self.inner.len() {
            if num < self.inner[j] {
                self.inner.insert(j, num);
                return;
            }
        }

        self.inner.push(num);
    }

    fn find_median(&mut self) -> f64 {
        if self.inner.len() == 1 {
            self.inner[0] as f64
        } else {
            if self.inner.len() % 2 == 0 {
                let curr = self.inner.len() / 2 - 1;
                let next = curr + 1;
                (self.inner[curr] as f64 + self.inner[next] as f64) / 2f64
            } else {
                let target = (self.inner.len() + 1) / 2 - 1;
                self.inner[target] as f64
            }
        }
    }
}