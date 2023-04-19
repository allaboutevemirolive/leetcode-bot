// https://leetcode.com/problems/permutation-sequence/solutions/2407407/rust-very-efficient-o-n-solution/
impl Solution {
    pub fn get_permutation(n: i32, k: i32) -> String {
        
        // Get total number of permutations for "n"
        // by calculating n factorial.
    
        let mut total = 1;
        let mut nn = n;
        while nn > 0 {
            total *= nn;
            nn -= 1;
        }

        // Get the digits, sorted.
        
        let mut digits: Vec<i32> = (1..=n).collect();
        
        // Build up "result" string digit-by-digit.
        
        let mut result = String::new();
        let mut kk = k - 1;  // Correction to 0-index "k".
        
        while digits.len() > 0 {
            
            // Get the number of possible sequences per digit,
            // and calculate where "kk" lies among these possible sequences.
            
            let rowsPerDigit = total / digits.len() as i32;
            let digitIndex = kk / rowsPerDigit;
            
            // Reduce the running totals moving to the next digit.
            
            total = rowsPerDigit;
            kk = kk % rowsPerDigit;
            
            // Consume the found digit into the string.
            
            let idx = digitIndex as usize;
            result.push_str(&digits[idx].to_string());
            digits.remove(idx);
            
        }

        return result;
        
    }
}