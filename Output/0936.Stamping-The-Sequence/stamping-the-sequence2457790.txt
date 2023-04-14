// https://leetcode.com/problems/stamping-the-sequence/solutions/2457790/rust-easy-to-understand-solution-beats-100/
impl Solution {
    fn partial_match(stamp: &str, k: &str) -> bool {
        if k == &"?".repeat(k.len()) {
            return false;
        }
        for (a, b) in stamp.chars().zip(k.chars()) {
            if a != b && b != '?' {
                return false;
            }
        }
        return true;
    }

    pub fn moves_to_stamp(stamp: String, mut target: String) -> Vec<i32> {
        let mut ans = vec![];
        
        while target != "?".repeat(target.len()) {
            let mut flag = false;
            let mut i = 0;
            while i + stamp.len() <= target.len() {
                if Solution::partial_match(&stamp, &target[i..i + stamp.len()]) {
                    flag = true;
                    ans.push(i as i32);
                    target.replace_range(i..i + stamp.len(), &"?".repeat(stamp.len()));
                }
                i += 1;
            }

            if !flag {
                return vec![];
            }
        }
        ans.into_iter().rev().collect()
    }
}
