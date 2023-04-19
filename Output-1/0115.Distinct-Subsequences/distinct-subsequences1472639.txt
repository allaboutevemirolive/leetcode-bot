// https://leetcode.com/problems/distinct-subsequences/solutions/1472639/rust-solution/
impl Solution {
    pub fn num_distinct(s: String, t: String) -> i32 {
        let mut d = vec![0; t.len() + 1];
        d[0] = 1;
        for si in s.bytes() {
            for (j, tj) in t.bytes().enumerate().rev() {
                if si == tj {
                    d[j + 1] += d[j];
                }
            }
        }
        d[t.len()]
    }
}