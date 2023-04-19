// https://leetcode.com/problems/largest-rectangle-in-histogram/solutions/235039/fastest-current-rust-solution-with-stack/
use std::cmp::max;
use std::i32;

impl Solution {

    pub fn largest_rectangle_area(histogram: Vec<i32>) -> i32 {
        let mut max_area = 0; // maximum encountered windows
        let mut stack = Vec::new();

        let mut index = 0;
        while index < histogram.len() {

            if stack.len() == 0 || ( histogram[*stack.last().unwrap()] <= histogram[index] ) {
                stack.push(index);
                index += 1;
            }
            else {
                let popped_i = stack.pop().unwrap();

                // find width in case we've never pushed on stack?
                let width = match stack.len() {
                    0 => index as i32,
                    _ => index as i32 - *stack.last().unwrap() as i32 - 1,
                };
                let area = histogram[popped_i as usize] * width;
                max_area = max(area, max_area);
            }
        }

        while stack.len() > 0 {
            let popped_hist_index = stack.pop().unwrap();

            // find width in case we've never pushed on stack?
            let width = match stack.len() {
                0 => index as i32,
                _ => index as i32 - *stack.last().unwrap() as i32 - 1,
            };
            let area = histogram[popped_hist_index as usize] * width;
            max_area = max(area, max_area);
        }

        return max_area;
    }
}