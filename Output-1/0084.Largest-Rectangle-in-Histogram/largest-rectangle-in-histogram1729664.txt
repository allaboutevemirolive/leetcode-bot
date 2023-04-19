// https://leetcode.com/problems/largest-rectangle-in-histogram/solutions/1729664/rust-stack-6-8-mb-12ms/
impl Solution {
    pub fn largest_rectangle_area(heights: Vec<i32>) -> i32 {

        let mut max_area: i32 = 0;
        let mut stack = vec![(0,0); heights.len()];
        //  Start from 0 height and 0 index
        for (i, h) in heights.iter().enumerate() { 
            let mut start = i.clone();
            while stack.len() > 0 && stack[stack.len()-1].1 > *h { 
                let (index, height) = stack.pop().unwrap();
                let width = (i - index) as i32;
                max_area = i32::max(max_area, height * width);
                start = index;
            }
            stack.push((start, *h))
        }
        // Get the heights from the ending of histogram
        for (i, h) in stack { 
            let width = (heights.len() - i) as i32;
            max_area = i32::max(max_area, h * width);
            
        }
        
        max_area
        
        
        
        
        
    }
}