// https://leetcode.com/problems/minimum-swaps-to-make-sequences-increasing/solutions/633415/rust-linear-solution-with-constant-memory-0ms-2mb/
impl Solution {
    pub fn min_swap(a: Vec<i32>, b: Vec<i32>) -> i32 {
        let mut stay = 0;
        let mut swap = 1;
        
        for i in 1..a.len() {
            let newStay = {
                let mut result = a.len();
                
                if a[i] > a[i-1] && b[i] > b[i-1] {
                    result = result.min(stay);
                    result = result.min(i - swap);
                }
                
                if a[i] > b[i-1] && b[i] > a[i-1] {
                    result = result.min(swap);
                    result = result.min(i - stay);
                }
                
                result
            };
            
            let newSwap = {
                let mut result = a.len();
                
                if a[i] > b[i-1] && b[i] > a[i-1] {
                    result = result.min(stay + 1);
                    result = result.min(i - swap + 1);
                }
                
                if a[i] > a[i-1] && b[i] > b[i-1] {
                    result = result.min(swap + 1);
                    result = result.min(i - stay + 1);
                }
                
                result
            };
            
            stay = newStay;
            swap = newSwap;
        }
        
        stay.min(swap) as i32
    }
}