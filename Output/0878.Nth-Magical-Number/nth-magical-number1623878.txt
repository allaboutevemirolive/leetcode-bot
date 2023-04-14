// https://leetcode.com/problems/nth-magical-number/solutions/1623878/rust-binary-search-solution-100-for-space-and-time/
/*
* Approach: Binary Search
* Runtime complexity: O(log(N * min(A, B)))
* Space complexity: O(1)
*/

use std::cmp;

const MOD: i64 = 1_000_000_007;

impl Solution {
    pub fn nth_magical_number(n: i32, a: i32, b: i32) -> i32 {
        // to prevent i32 overflow
        let a: i64 = a as i64;
        let b: i64 = b as i64;
        let n: i64 = n as i64;
        
        let mut lo = 2;
        let mut hi = (n * cmp::min(a, b));
        
        let lcm = a * b / Solution::gcd(a, b);
        
        while lo < hi {
            let mi = lo + (hi - lo) / 2;
            
            // Formlua for counting the quantity of numbers that divide on a or b extracting number of duplicates
            let val = (mi / a) + (mi / b) - (mi / lcm);
            
            if val < n {
                lo = mi + 1;
            } else {
                hi = mi;
            }
        }
        
        (lo % MOD) as i32
    }

    // Greatest Common Divisor
    fn gcd(a: i64, b: i64) -> i64 {
        let r = a % b;
        if r == 0 {
            return b;
        }
        return Solution::gcd(b, r);
    }
}