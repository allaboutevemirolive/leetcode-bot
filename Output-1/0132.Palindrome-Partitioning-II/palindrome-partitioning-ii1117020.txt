// https://leetcode.com/problems/palindrome-partitioning-ii/solutions/1117020/rust-recursion-solution/
impl Solution {
    pub fn min_cut(s: String) -> i32 {
        use std::collections::HashMap;
        let ss = s.as_bytes();
        if ss.len() <= 1 {
            return 0;
        }
        fn is_pali<'a>(
            ss: &'a [u8], 
            memo: &mut HashMap<&'a [u8], bool>) 
        -> bool {
            if ss.len() <= 1 {
                return true;
            }
            if let Some(&b) = memo.get(ss) {
                return b;
            }
            let i = 0;
            let j = ss.len() - 1;
            if ss[i] == ss[j] {
                let res = is_pali(&ss[1..j], memo);
                memo.insert(ss, res);
                res
            } else {
                memo.insert(ss, false);
                false
            }
        }
        fn search<'a>(
            ss: &'a [u8], 
            memo: &mut HashMap<&'a [u8], i32>, 
            memo_is: &mut HashMap<&'a [u8], bool>) 
        -> i32 {
            if let Some(&i) = memo.get(ss) {
                return i;
            }
            let mut ans = ss.len() as i32 - 1;
            for j in 0..ss.len() {
                if is_pali(&ss[j..ss.len()], memo_is) {
                    ans = ans.min(search(&ss[0..j], memo, memo_is) + 1);
                }
            }
            memo.insert(ss, ans);
            ans
        }
        let mut memo_dp = HashMap::new();
        let mut memo_is = HashMap::new();
        search(ss, &mut memo_dp, &mut memo_is)
    }
}