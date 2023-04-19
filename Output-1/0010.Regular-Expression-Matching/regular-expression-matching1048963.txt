// https://leetcode.com/problems/regular-expression-matching/solutions/1048963/rust-recursive-solution/
impl Solution {
    pub fn is_match(s: String, p: String) -> bool {
        fn is_match_str(s: &str, p: &str) -> bool {
            let (s_len, p_len) = (s.len(), p.len());
            if p_len == 0 {
                return s_len == 0;
            }
            
            let m = { s_len > 0 && (s.as_bytes()[0] == p.as_bytes()[0] || p.as_bytes()[0] == 46) };
            if p_len >= 2 && p.as_bytes()[1] == 42 {
                return is_match_str(s, &p[2..]) || (m && is_match_str(&s[1..], p))
            }
            
            m && is_match_str(&s[1..], &p[1..])
        }
        is_match_str(&s, &p)
    }
}