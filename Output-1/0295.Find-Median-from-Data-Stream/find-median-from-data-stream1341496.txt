// https://leetcode.com/problems/find-median-from-data-stream/solutions/1341496/follow-up-rust-solution-run-length-compress/
struct MedianFinder {
    nums: Vec::<i32>,
    freq: Vec::<usize>,
}

impl MedianFinder {
    pub fn new() -> Self {
        Self {
            nums: Vec::new(),
            freq: Vec::new()
        }
    }

    fn len(&self) -> usize {
        self.nums.len()
    }

    pub fn add_num(&mut self, num: i32) {
        // find where to insert
        match self.nums.binary_search(&num) {
            Ok(x) => {
                // increase freq
                self.freq[x] += 1;
            },
            Err(x) => {
                // add new num
                self.nums.insert(x, num);
                self.freq.insert(x, 1);
            }
        };
    }

    pub fn find_median(&self) -> f64 {
        // get median
        // @warn index calculation!
        let len: usize = self.freq.iter().sum();
        let mid = len / 2;

        // median
        let mut median = 0.0;
        if len % 2 == 1 {
            // mid
            let mut cnt = 0;
            for (i, x) in self.freq.iter().enumerate() {
                cnt += x;
                if cnt > mid {
                    median = self.nums[i] as f64;
                    break;
                }
            }
        } else {
            // mid, mid - 1
            let mut cnt = 0;
            let mut n1 = None;
            let mut n2 = None;
            for (i, x) in self.freq.iter().enumerate() {
                cnt += x;
                if n1 == None && cnt > mid - 1 {
                    n1 = Some(self.nums[i] as f64);
                }
                if n2 == None && cnt > mid {
                    n2 = Some(self.nums[i] as f64);
                }
                if n1 != None && n2 != None { break; }
            };
            median = n1.unwrap() * 0.5 + n2.unwrap() * 0.5;
        };
        median
    }
}