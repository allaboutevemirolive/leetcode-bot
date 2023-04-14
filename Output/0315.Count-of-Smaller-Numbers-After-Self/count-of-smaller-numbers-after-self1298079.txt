// https://leetcode.com/problems/count-of-smaller-numbers-after-self/solutions/1298079/rust-segmenttree-solution/
// Ref: https://en.wikipedia.org/wiki/Segment_tree
pub struct SegmentTree {
    pub start: usize,
    pub end: usize,
    pub sum: i32,
    pub left: Option<Box<SegmentTree>>,
    pub right: Option<Box<SegmentTree>>,
}

impl SegmentTree {
    // O(n)
    pub fn new(start: usize, end: usize, vals: &[i32]) -> Self {
        if start == end {
            return Self {
                start,
                end,
                sum: vals[start],
                left: None,
                right: None,
            };
        }
        let mid = start + (end - start) / 2;
        let left = Self::new(start, mid, vals);
        let right = Self::new(mid + 1, end, vals);
        let sum = left.sum + right.sum;
        Self {
            start,
            end,
            sum,
            left: Some(Box::new(left)),
            right: Some(Box::new(right)),
        }
    }

    // O(logn)
    pub fn update(&mut self, index: usize, val: i32) {
        // NOTE: If is leaf, update itself
        if self.start == self.end && self.end == index {
            self.sum = val;
            return;
        }
        // NOTE: If is not leaf, update left or right
        let mid = self.start + (self.end - self.start) / 2;
        if index <= mid {
            self.left.as_mut().unwrap().update(index, val);
        } else {
            self.right.as_mut().unwrap().update(index, val);
        }
        // NOTE: After update children, update self
        self.sum = self.left.as_ref().unwrap().sum + self.right.as_ref().unwrap().sum;
    }

    // O(logn)
    pub fn query(&self, start: usize, end: usize) -> i32 {
        // NOTE: Exact match
        if self.start == start && self.end == end {
            return self.sum;
        }
        let mid = self.start + (self.end - self.start) / 2;
        // NOTE: Range on the left
        if end <= mid {
            return self.left.as_ref().unwrap().query(start, end);
        // NOTE: Range on the right
        } else if start > mid {
            return self.right.as_ref().unwrap().query(start, end);
        // NOTE: Range on both sides
        } else {
            return self.left.as_ref().unwrap().query(start, mid)
                + self.right.as_ref().unwrap().query(mid + 1, end);
        }
    }
}

impl Solution {
    pub fn count_smaller(nums: Vec<i32>) -> Vec<i32> {
        // since num[i] in [-1e4, 1e4], right shift 10_000 to make cts storable in array
        let n = nums.len();
        let mut cts = vec![0; 20_001];
        let mut segment_tree = SegmentTree::new(0, 20_000, &cts);
        
        let mut ans = vec![0; n];
        for i in (0..n).rev() {
            let idx = (nums[i] + 10_000) as usize;
            if idx == 0 { 
                ans[i] = 0;
            } else {
                ans[i] = segment_tree.query(0, idx - 1);
            }
            // NOTE: Update data
            let ct = cts[idx] + 1;
            cts[idx] = ct;
            segment_tree.update(idx, ct);
        }
        ans
    }
}