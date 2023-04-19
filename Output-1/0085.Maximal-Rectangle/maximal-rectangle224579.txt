// https://leetcode.com/problems/maximal-rectangle/solutions/224579/rust-20ms-solution/
use std::cmp::max;

impl Solution {
    pub fn and(row1 : &mut Vec<char>, row2 : &Vec<char>, n : usize) -> i32 {
        let mut current = 0;
        let mut longest = 0;
        
        for i in 0..n {
            if row1[i] == '1' && row2[i] == '1' {
                current += 1;
                longest = max(longest, current);
            } else {
                row1[i] = '0';  
                current = 0;
            }
        }
        longest
    } 
    
    pub fn maximal_rectangle(matrix: Vec<Vec<char>>) -> i32 {
        let rows = matrix.len();
        
        if rows == 0 {
            return 0;
        }
        
        let cols = matrix[0].len();
        let mut largest_area = 0;
        let mut working_matrix = vec![vec!['1'; cols]; rows];
        
        for height in 0..rows {
            for j in 0..(rows - height) {
                let base_area = Solution::and(&mut working_matrix[j], &matrix[j+height], cols);
                largest_area = max(largest_area, base_area * ((height as i32) + 1));
            }
        }
        
        largest_area
    }
}