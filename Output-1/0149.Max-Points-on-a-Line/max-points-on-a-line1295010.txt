// https://leetcode.com/problems/max-points-on-a-line/solutions/1295010/rust-o-n-2-time-and-space/
use std::collections::HashMap;
impl Solution {
   
    pub fn hcf(mut num1: i32, mut num2: i32) -> i32 {
        while num1 != 0 {
            let temp: i32 = num1;
            num1 = num2 % num1;
            num2 = temp;
        }
        num2
    }
    
    pub fn reduce_frac(mut num: i32, mut den: i32) -> [i32; 2] {
        if den == 0 { return [0, 0] };
        let mut hcf_: i32 = 0;
        while hcf_ != 1 {
            hcf_ = Solution::hcf(num, den);
            num /= hcf_;
            den /= hcf_;
        }
        [num, den]
    }
    
    pub fn max_points(points: Vec<Vec<i32>>) -> i32 {
        let mut lines: Vec<HashMap<[i32; 2], i32>> = Vec::new();
        
        for i in 0..points.len() {
            lines.push(HashMap::new());
            for j in 0..points.len() {
                if i != j {
                    let key: [i32; 2] = Solution::reduce_frac(points[j][1] - points[i][1], points[j][0] - points[i][0]);
                    let count = lines[i].entry(key).or_insert(0);
                    *count += 1;
                }
            }
        }
        let mut max_points: Vec<i32> = Vec::new();
        for slopes in lines {
            match slopes.values().max() {
                Some(max) => max_points.push(*max),
                None => ()
            }
        }
        match max_points.iter().max() {
            Some(max) => max + 1,
            None => 1
        }
    }
}