// https://leetcode.com/problems/find-median-from-data-stream/solutions/2805269/rust-segment-tree-but-slow/
struct MedianFinder {
    tree: Vec<i32>,
    count: i32,
}


/** 
 * `&self` means the method takes an immutable reference.
 * If you need a mutable reference, change it to `&mut self` instead.
 */
impl MedianFinder {
    const OFFSET: usize = 100_000;

    fn new() -> Self {
        Self {
            tree: vec![0; 1 << 19],
            count: 0,
        }
    }
    
    fn add_num(&mut self, num: i32) {
        self.count += 1;
        let mut lo = 0;
        let mut hi = (1 << 18) - 1;
        let mut i = 1;
        let target = num as usize + Self::OFFSET;

        while lo < hi {
            let mid = (lo + hi) >> 1;
            i <<= 1;
            if target <= mid {
                hi = mid;
            }
            else {
                i |= 1;
                lo = mid + 1;
            }
            self.tree[i] += 1;
        }
    }
    
    fn find_median(&self) -> f64 {
        if self.count & 1 == 0 {
            (self.find_xth(self.count / 2)
            + self.find_xth(self.count / 2 + 1))
            * 0.5
        }
        else {
            self.find_xth(self.count / 2 + 1)
        }
    }

    fn find_xth(&self, mut x: i32) -> f64 {
        let mut lo = 0;
        let mut hi = (1 << 18) - 1;
        let mut i = 1;

        while lo < hi {
            let mid = (lo + hi) >> 1;
            i <<= 1;
            if self.tree[i] >= x {
                hi = mid;
            }
            else {
                x -= self.tree[i];
                i |= 1;
                lo = mid + 1;
            }
        }
        lo as f64 - Self::OFFSET as f64
    }
}

/**
 * Your MedianFinder object will be instantiated and called as such:
 * let obj = MedianFinder::new();
 * obj.add_num(num);
 * let ret_2: f64 = obj.find_median();
 */