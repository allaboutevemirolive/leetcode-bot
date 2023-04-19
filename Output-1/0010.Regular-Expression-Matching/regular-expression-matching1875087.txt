// https://leetcode.com/problems/regular-expression-matching/solutions/1875087/rust-recursion-solution-with-slice-match/
impl Solution {
    pub fn is_match(s: String, p: String) -> bool {
        Solution::is_match_slice(s.as_bytes(), p.as_bytes())
    }

    fn is_match_slice(s: &[u8], p: &[u8]) -> bool {

        match (p, s) {
            ([x, b'*', subp @ ..], [y, subs @ ..]) => {
                if x == y || *x == b'.' {
                    Solution::is_match_slice(subs, p) || Solution::is_match_slice(s, subp)
                } else {
                    Solution::is_match_slice(s, subp)
                }
            }
            ([x, subp @ ..], [y, subs @ ..]) if x == y || *x == b'.' => {
                Solution::is_match_slice(subs, subp)
            }
            ([_, b'*', subp @ ..], []) => Solution::is_match_slice(s, subp),
            ([], []) => true,
            _ => false,
        }
    }
}