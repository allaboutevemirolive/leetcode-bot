// https://leetcode.com/problems/largest-rectangle-in-histogram/solutions/2958007/rust-monotonic-stack-solution/
impl Solution {
    pub fn largest_rectangle_area(heights: Vec<i32>) -> i32 {
        let n = heights.len();
        let mut res = 0;
        let mut stack: Vec<usize> = vec![];

        for i in 0..n + 1 {
            while !stack.is_empty() && (i == n || heights[i] <= heights[stack[stack.len() - 1]]) {
                let height = heights[stack.pop().unwrap()];
                let left = if stack.is_empty() { -1 } else { stack[stack.len() - 1] as i32 };
                let width = i as i32 - left - 1;
                res = std::cmp::max(res, height * width);
            }
            stack.push(i);
        }

        res
    }
}