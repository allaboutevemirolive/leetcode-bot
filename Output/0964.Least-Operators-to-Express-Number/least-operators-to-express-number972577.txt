// https://leetcode.com/problems/least-operators-to-express-number/solutions/972577/rust-using-memoization-0ms-runtime-2mb-memory/
use std::collections::HashMap;

impl Solution {
    pub fn least_ops_express_target(x: i32, target: i32) -> i32 {
        let mut hmap = HashMap::new();
        if target == 0 {
            return 1;
        } else if target == 1 {
            return 1;
        } else {
            return Solution::recursive_sol(x, target, &mut hmap);
        }
    
    }
    
    
    fn recursive_sol(x: i32, target: i32, hmap: &mut HashMap<i32, i32>) -> i32 {
        if let Some(answer) = hmap.get(&target) {
            return answer.clone();
        }
        
        let mut new_target = target; 
        let mut power = 0; 
        let mut low_digit = 0;       
        let mut usual = 0;
        let mut other = 0;
        
        if target == 0 {
            return 0;
        }
        
        loop {
            if new_target%x == 0 {
                power += 1;
                new_target = new_target/x;
            } else {
                low_digit = new_target%x;
                break;
            }
        }
        
        // FOR POWER == 0
        
        // if we didn't factor any x's out then we're addressing the one's place
        // to repesent digit d in the one's place we would do x/x + x/x + x/x + ... until it equals d
        // which takes d divisions and d-1 additions or 2d-1 operations
        
        // alternatively, we could do x - x/x - x/x - ... until it equals d
        // which takes x-d divisions and x-d-1 subtractions (plus the additional subtraction at the beginning)
        // Since the additional operation caused by starting with "x -" will be counted in the next recursive call
        // We only count it if it's a base case
        
        
        
        // FOR POWER == 1
        
        // All we have to do is d-1 additions to represent d*x 
        
        // Alternatively we could do x*x - x - x - ... until it equals d*x
        // x*x - (x-d)*x = x(x-(x-d)) = x*d
        // we know from the usual case of power == 1 that (x-d)*x can be represented with x-d-1 operations and we ignore 
        // and we ignore the 2 operations of "x*x -" since they're counted in the recursive call unless it's a base case.
        
        
        
        // FOR POWER >= 2
        
        // for d*x^p we have d sets of p-1 multiplications for each copy of x^p followed by d-1 additions to combine them
        // which takes d(p-1) + (d-1) operations
        // Alternatively we have x^(p+1) - (x-d)*x^p and have (x-d) sets of p-1 multiplications followed by (x-d)-1 subtractions
        // which takes (x-d)(p-1) + (x-d-1) operations 
        // we ignore the p+1 operations in "x^(p+1) -" unless it's a base case
        
        
        if power == 0 {
            usual = 2*low_digit-1;
            other = 2*(x-low_digit)-1;
            
            if new_target < x {
                if usual < other + 1 {
                    return usual;
                } else {
                    return other + 1;
                }
            }
            
        } else if power == 1 {
            usual = low_digit-1;
            other = (x-low_digit-1);
            
            if new_target < x {
                if usual < other + 2 {
                    return usual;
                } else {
                    return other + 2;
                }
            }
            
        } else {
            
            usual = low_digit*(power-1) + (low_digit-1);
            other = (x-low_digit)*(power-1) + (x-low_digit-1);
            
            if new_target < x {
                if usual < other + power + 1 {
                    return usual;
                } else {
                    return other + power + 1;
                }
            }
        }
        
        let usual_recursion = Solution::recursive_sol(x, target-low_digit*x.pow(power as u32), hmap);
        let other_recursion = Solution::recursive_sol(x, target+(x-low_digit)*x.pow(power as u32), hmap);
        
        hmap.insert(target-low_digit*x.pow(power as u32), usual_recursion);
        hmap.insert(target+(x-low_digit)*x.pow(power as u32), other_recursion);
        
        
        if usual + usual_recursion + 1 < other + other_recursion + 1 {
            return usual + usual_recursion + 1;
        } else {
            return other + other_recursion + 1;
        }
               
    }
}