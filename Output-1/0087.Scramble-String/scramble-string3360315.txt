// https://leetcode.com/problems/scramble-string/solutions/3360315/rust-compact-ugly-and-fast-dp-2ms/
impl Solution {
    pub fn is_scramble(s1: String, s2: String) -> bool {
        fn compare(s1: &[u8], s2: &[u8], i: usize, j: usize, len: usize, dp: &mut Vec<Vec<Vec<i8>>>) ->i8 {
            if dp[i][j][len] != -1 { return dp[i][j][len] }
            
            dp[i][j][len] = (s1[i..i + len] == s2[j..j + len] || (1..len).any(|k|
                    (compare(s1, s2, i, j, k, dp) == 1 
                  && compare(s1, s2, i + k, j + k , len - k, dp) == 1)
                  ||(compare(s1, s2, i, j + len - k, k, dp) == 1 
                  && compare(s1, s2, i + k, j, len - k, dp) == 1))) as i8;
            dp[i][j][len]
        }

        let s1 = s1.as_bytes();
        let s2 = s2.as_bytes();
        let n = s1.len();
        let mut dp = vec![vec![vec![-1i8; n + 1]; n]; n];
        compare(&s1, &s2, 0, 0, n, &mut dp) == 1
    }
}