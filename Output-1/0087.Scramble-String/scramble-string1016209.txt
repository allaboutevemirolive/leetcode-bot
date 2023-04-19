// https://leetcode.com/problems/scramble-string/solutions/1016209/rust-simple-recursion-with-memorization/
impl Solution {
    pub fn is_scramble(s1: String, s2: String) -> bool {
        use std::collections::HashMap;
        let xs = s1.as_bytes();
        let ys = s2.as_bytes();
        
        fn test<'a>(
            xs: &'a [u8], ys: &'a [u8], 
            memo: &mut HashMap<(&'a [u8], &'a [u8]), bool>
        ) -> bool {
            if let Some(&b) = memo.get(&(xs, ys)) {
                return b;
            }
            if xs.len() == 1 && ys.len() == 1 {
                let ans = xs[0] == ys[0];
                memo.insert((xs, ys), ans);
                return ans;
            }
            for i in 1..xs.len() {
                let j = ys.len() - i;
                if  test(&xs[..i], &ys[..i], memo) && test(&xs[i..], &ys[i..], memo) ||
                    test(&xs[..i], &ys[j..], memo) && test(&xs[i..], &ys[..j], memo) {
                    memo.insert((xs, ys), true);
                    return true;
                }
            }
            memo.insert((xs, ys), false);
            false
        }
        let mut memo = HashMap::new();
        test(xs, ys, &mut memo)
    }
}