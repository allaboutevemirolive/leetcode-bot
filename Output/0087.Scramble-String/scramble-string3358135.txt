// https://leetcode.com/problems/scramble-string/solutions/3358135/top-down-dp-solution-in-rust/
impl Solution {
    pub fn is_scramble(s1: String, s2: String) -> bool {
        fn is_scr(dp: &mut Vec<Vec<Vec<Option<bool>>>>, s1: &[u8], s2: &[u8], i1: usize, i2: usize, len: usize) -> bool {
            if len==1 {
                return s1[i1]==s2[i2];
            }
            if let Some(res) = dp[i1][i2][len-2] {
                return res;
            }
            for l in 1..len {
                if (is_scr(dp, s1, s2, i1, i2, l) && is_scr(dp, s1, s2, i1+l, i2+l, len - l))
                    || (is_scr(dp, s1, s2, i1, i2+len-l, l) && is_scr(dp, s1, s2, i1+l, i2, len - l)) {
                    dp[i1][i2][len-2] = Some(true);
                    return true;
                }
            }
            dp[i1][i2][len-2] = Some(false);
            false
        }
        let n = s1.len();
        let mut dp = vec![vec![vec![None; n-1]; n]; n];
        is_scr(&mut dp, s1.as_bytes(), s2.as_bytes(), 0, 0, n)
    }
}