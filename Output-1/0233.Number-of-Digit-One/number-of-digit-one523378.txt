// https://leetcode.com/problems/number-of-digit-one/solutions/523378/rust-recursive/
impl Solution {
    pub fn count_digit_one(n: i32) -> i32 {
	    if n < 1 {
           return 0;
        }
		
        if n < 10 {
           return 1;
        }
            
        let mut base = 10;
        while n / base >= 10 {
            base *= 10;
        }
        let d = n / base;
        let remain = n % base;
        let mut res = 0;
        res += Self::count_digit_one_fast(base);
        
        if d > 1 {
            res += base;
            
            for i in 1..d {
                res += Self::count_digit_one_fast(base / 10) * 10 + base / 10;
            }
        } else {
            res += remain + 1;
        }
    
        res += Self::count_digit_one(remain);
        res
    }
    
    fn count_digit_one_fast(n: i32) -> i32 {
        let mut base = 1;
        let mut l = 0;
        let mut res = 0;
        while n / base >= 10 {
            res = 10 * res + base;
            base *= 10;            
        }
        res
    }
}
