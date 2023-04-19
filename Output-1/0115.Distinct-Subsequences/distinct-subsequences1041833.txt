// https://leetcode.com/problems/distinct-subsequences/solutions/1041833/rust-naive-recursion-with-memorization/
use std::collections::HashMap;
impl Solution {
    pub fn num_distinct(s: String, t: String) -> i32 {
        fn count<'a>(
            s: &'a[u8], t: &'a[u8],
            memo: &mut HashMap<(&'a[u8], &'a[u8]), i32>)
        -> i32 {
            if let Some(&i) = memo.get(&(s, t)) {
                return i;
            }
            if t.is_empty() {
                memo.insert((s, t), 1);
                return 1;
            }
            if s.is_empty() {
                memo.insert((s, t), 0);
                return 0;
            }
            let ans = if s[0] != t[0] {
                count(&s[1..], t, memo)
            } else if s.len() <= 1 {
                count(&s[1..], &t[1..], memo)
            } else {
                count(&s[1..], &t[1..], memo) + count(&s[1..], &t[0..], memo)
            };
            memo.insert((s, t), ans);
            ans
        }
        let ss = s.as_bytes();
        let ts = t.as_bytes();
        let mut memo = HashMap::new();
        count(&ss, &ts, &mut memo)
    }
}