// https://leetcode.com/problems/minimum-window-substring/solutions/2731917/rust-with-two-pointers-approach/
impl Solution {
    pub fn min_window(s: String, t: String) -> String {
        let mut t_count = [0; 58];
        for b in t.as_bytes() {
            t_count[(b - b'A') as usize] += 1;
        }
        let mut ans_len = usize::MAX;
        let mut ans: Option<(usize, usize)> = None;
        let mut count = 0;
        let mut lo = 0;
        let mut hi = 0;
        let mut s_count = [0; 58];
        let bytes = s.as_bytes();
        let i = (bytes[0] - b'A') as usize;
        s_count[i] += 1;
        if s_count[i] <= t_count[i] {
            count += 1;
        }
        loop {
            if count == t.len() && hi - lo + 1 < ans_len {
                ans_len = hi - lo + 1;
                ans = Some((lo, hi));
            }
            if lo == hi || count < t.len() {
                if hi == s.len() - 1 {
                    break;
                }
                hi += 1;
                let i = (bytes[hi] - b'A') as usize;
                s_count[i] += 1;
                if s_count[i] <= t_count[i] {
                    count += 1;
                }
            }
            else {
                let i = (bytes[lo] - b'A') as usize;
                s_count[i] -= 1;
                if s_count[i] < t_count[i] {
                    count -= 1;
                }
                lo += 1;
            }
        }
        ans.map_or(String::new(), |(a, b)| s[a..=b].to_owned())
    }
}