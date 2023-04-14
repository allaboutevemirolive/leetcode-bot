// https://leetcode.com/problems/largest-rectangle-in-histogram/solutions/1131321/rust-divide-and-conquar-solution/
impl Solution {
    pub fn largest_rectangle_area(heights: Vec<i32>) -> i32 {
        Self::max_area(&heights)
    }

    fn max_area(heights: &[i32]) -> i32 {
        let n = heights.len();
        if n == 0 {
            return 0;
        }
        if n == 1 {
            return heights[0];
        }

        let i = 0;
        let j = n - 1;
        let pivot = {
            let mut res = (i + j) / 2;
            for i in 0..n {
                if heights[i] < heights[res] {
                    res = i;
                }
            }
            res
        };
        let mut res = heights[pivot] * (j - i + 1) as i32;
        res = res.max(Self::max_area(&heights[i..pivot]));
        res = res.max(Self::max_area(&heights[(pivot + 1)..=j]));
        res
    }
}