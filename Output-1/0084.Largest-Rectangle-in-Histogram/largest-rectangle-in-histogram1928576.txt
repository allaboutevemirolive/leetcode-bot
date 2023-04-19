// https://leetcode.com/problems/largest-rectangle-in-histogram/solutions/1928576/rust-3ms-beat-100-solution/
impl Solution {
    pub fn largest_rectangle_area(heights: Vec<i32>) -> i32 {
        let mut heights = heights;
        heights.push(0);
        let mut stack = Vec::new();
        let mut res: i32 = 0;
        
        for (idx, &val) in heights.iter().enumerate() {
            while stack.len() > 0 && heights[*stack.last().unwrap()] >= val {
                let height = heights[stack.pop().unwrap()];
                let width = idx - if stack.is_empty() {
                    0     
                } else {
                    *stack.last().unwrap() + 1   
                };
                res = std::cmp::max(width as i32 * height, res);
            }
            stack.push(idx);
        }
        res
    }
}