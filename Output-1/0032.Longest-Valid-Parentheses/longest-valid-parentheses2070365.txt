// https://leetcode.com/problems/longest-valid-parentheses/solutions/2070365/rust-solution/
//using standard library for comparing(std::cmp)'s max function(max<T>(v1 : T, v2 : T) -> T)
use std::cmp::max;

impl Solution {
    /*
    *Time Complexity : O(N + N), N = length of the string
    *Space Complexity : O(1)
    */
    pub fn longest_valid_parentheses(s: String) -> i32 {
        
        let mut longest_valid_parenthesis_count : u16 = 0;
        
        let mut opening_count : u16 = 0;//count of opening parenthesis
        let mut closing_count : u16 = 0;//count of closing parenthesis
        
        for c in s.chars(){
            //traversing the string from left
            if c == '('{
                opening_count += 1;
            }else{
                closing_count += 1;
            }
            //if opening and closing paerenthesis counts are equal, substring is valid thus
            if opening_count == closing_count{
                //set longest valid parenthesis count to max of itself and length of substring which is = opening count + closing count
                longest_valid_parenthesis_count = 
					max(longest_valid_parenthesis_count, opening_count + closing_count);
            }
            
            if closing_count > opening_count{
                //if there are more closing brackets than opening, substring is invalid
                opening_count = 0;
                closing_count = 0;
            }
        }
        
        let mut opening_count : u16 = 0;//shadowing opening count
        let mut closing_count : u16 = 0;//shadowing closing count
        
        for c in s.chars().rev(){
            //traversing the string from right
            if c == '('{
                opening_count += 1;
            }else{
                closing_count += 1;
            }
            //if opening and closing paerenthesis counts are equal, substring is valid thus
            if opening_count == closing_count{
                //set longest valid parenthesis count to max of itself and length of substring which is = opening count + closing count
                longest_valid_parenthesis_count = 
					max(longest_valid_parenthesis_count, opening_count + closing_count);
            }
            
            if opening_count > closing_count{
                //if there are more opening brackets than closing, substring is invalid
                opening_count = 0;
                closing_count = 0;
            }
        }
        
        //return the longest valid parenthisis substring length
        longest_valid_parenthesis_count as i32
        
    }
}