// https://leetcode.com/problems/k-similar-strings/solutions/3042670/rust-backtracking/
impl Solution {
    pub fn k_similarity(s1: String, s2: String) -> i32 {
        let mut s1 = s1.chars().collect::<Vec<char>>();
        let s2 = s2.chars().collect::<Vec<char>>();
        Self::backtracking(&mut s1, &s2, s2.len() - 1)
    }
    
    fn backtracking(s1: &mut Vec<char>, s2: &Vec<char>, i: usize) -> i32 {
        if i == 0 { return 0 }
        if s1[i] == s2[i] { return Self::backtracking(s1, s2, i - 1 ) }
        
        let mut ret = i32::MAX;
        for k in (0 .. i).rev() {
            if s1[k] == s2[k] || s1[k] != s2[i] { continue }
            
            s1.swap(i, k);
            ret = ret.min(1 + Self::backtracking(s1, s2, i - 1));
            s1.swap(i, k);
        }
        
        ret
    }
}