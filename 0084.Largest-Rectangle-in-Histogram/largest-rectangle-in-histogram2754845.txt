// https://leetcode.com/problems/largest-rectangle-in-histogram/solutions/2754845/stack-rust-solution/
impl Solution {
    pub fn largest_rectangle_area(heights: Vec<i32>) -> i32 {
       let mut stack: Vec<(usize, i32)> = vec![];
       let mut area = 0;

       for (i, &h) in heights.iter().enumerate() {
           let mut st = i;
           
           while !stack.is_empty() && stack.last().unwrap().1 > h {
               let (idx, h) = stack.pop().unwrap();
               area = area.max(h * (i - idx) as i32);
               st = idx;
           }
          stack.push((st, h)) 
       }

        for (i, h) in stack.iter() {
            area = area.max(h * (heights.len() - i) as i32)
        }
        area
    }
}