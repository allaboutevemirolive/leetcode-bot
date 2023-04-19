// https://leetcode.com/problems/scramble-string/solutions/2278190/rust-dynamic-programming/
impl Solution {
    pub fn is_scramble(s1: String, s2: String) -> bool {
        let n = s1.len();
        let s1 = s1.chars().collect::<Vec<char>>();
        let s2 = s2.chars().collect::<Vec<char>>();
        let mut dp = vec![vec![vec![-1i32; n + 1]; n]; n];
        
        Self::check(&s1, &s2, 0, 0, n, &mut dp) == 1
    }
    
    fn check(s1: &Vec<char>, s2: &Vec<char>, i: usize, j: usize, len: usize, dp: &mut Vec<Vec<Vec<i32>>>) ->i32 {
        if dp[i][j][len] != -1 { return dp[i][j][len] }
        
        let mut same = true;    
        for k in 0..len {
            if s1[i + k] == s2[j + k] { continue; }
            same = false;
            break;
        }
        if same {
            dp[i][j][len] = 1;
            return dp[i][j][len]
        }
        
        for k in 1..len {
            if Self::check(s1, s2, i, j + len - k, k, dp) == 1 && 
               Self::check(s1, s2, i + k, j, len - k, dp) == 1 
            {
                dp[i][j][len] = 1;
                return dp[i][j][len]
            }
            
            if Self::check(s1, s2, i, j, k, dp) == 1 && 
               Self::check(s1, s2, i + k, j + k , len - k, dp) == 1 
            {
                dp[i][j][len] = 1;
                return dp[i][j][len]
            }
        }

        dp[i][j][len] = 0;
        dp[i][j][len]
    }
}