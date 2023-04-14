// https://leetcode.com/problems/count-unique-characters-of-all-substrings-of-a-given-string/solutions/2873014/rust-simple-iteration/
impl Solution {
    pub fn unique_letter_string(s: String) -> i32 {
        let mut data = vec![vec![]; 26];
        let s = s.chars().collect::<Vec<char>>();
        
        for i in 0 .. s.len() {
            data[(s[i] as u8 - 'A' as u8) as usize].push(i);
        }
        
        let mut ret = 0;
        for d in data { ret += Self::collect(&d, s.len()); }
        ret
    }
    
    fn collect(d: &Vec<usize>, n: usize) -> i32 {
        let mut ret = 0;
        
        for k in 0 .. d.len() {
            let left   = if k == 0           { 0    } else { d[k - 1] + 1 }; 
            let right  = if k == d.len() - 1 { n - 1} else { d[k + 1] - 1 };
            
            ret += (d[k] - left + 1) * (right - d[k] + 1);
        }
        
        ret as _
    }
}