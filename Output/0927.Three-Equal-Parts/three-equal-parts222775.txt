// https://leetcode.com/problems/three-equal-parts/solutions/222775/o-n-solution-in-rust-4ms/
impl Solution {
    pub fn three_equal_parts(a: Vec<i32>) -> Vec<i32> {
        let ones = a.iter().filter(|&n| *n == 1).count();
        if ones == 0 {
            return vec![0, 2]; // any split works here
        }
        if ones % 3 != 0 {
            return vec![-1, -1];
        }
        let part_ones = ones / 3;
        let trailing_zeros = (0..a.len()).rev().take_while(|&idx| a[idx] == 0).count();
        
        let find_part_end = |start| -> Option<usize> {
            let mut ones = 0;
            let mut i = start;
            while ones < part_ones {
                if a[i] == 1 {
                    ones += 1;
                }
                i += 1;
            }
            if !(i..(i+trailing_zeros)).all(|idx| a[idx] == 0) {
                // first part does not have enough trailing zeros
                return None;
            }
            Some(i + trailing_zeros - 1)
        };
        
        let i = match find_part_end(0) { // first part end
            Some(i) => i,
            None => return vec![-1, -1],
        };
        
        let j = match find_part_end(i+1) { // second part end
            Some(j) => j + 1, // j starts after the end of second part
            None => return vec![-1, -1],
        };
        
        if !(0..i+1).rev().zip((i+1..j).rev()).all(|t| a[t.0] == a[t.1]) {
            // first and second parts are different
            return vec![-1, -1];
        }
        
        if !(i+1..j).rev().zip((j..a.len()).rev()).all(|t| a[t.0] == a[t.1]) {
            // second and first parts are different
            return vec![-1, -1];
        }
        
        vec![i as i32, j as i32]
    }
}