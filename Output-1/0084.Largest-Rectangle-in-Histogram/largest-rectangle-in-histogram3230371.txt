// https://leetcode.com/problems/largest-rectangle-in-histogram/solutions/3230371/rust-solution/
impl Solution {
    pub fn largest_rectangle_area(heights: Vec<i32>) -> i32 {
        let mut stack = vec![];
        let mut ans = 0;
        for right in 0..=heights.len() {
            while !stack.is_empty()
                && (right == heights.len() || heights[*stack.last().unwrap()] >= heights[right])
            {
                let mid = stack.pop().unwrap();
                let h = heights[mid];
                let left = stack.last().map(|x| *x as i32).unwrap_or(-1);
                let s = h * ((right as i32) - left - 1);
                ans = ans.max(s);
            }
            stack.push(right);
        }
        ans
    }
}