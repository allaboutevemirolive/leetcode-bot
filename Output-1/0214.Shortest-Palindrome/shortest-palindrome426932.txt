// https://leetcode.com/problems/shortest-palindrome/solutions/426932/rust-solution/
impl Solution {
    pub fn shortest_palindrome(s: String) -> String {
        let len = s.len();
        if len == 0 {
            return "".to_owned();
        }
        let len = s.len();
        let origin = s;
        let rev: String = origin.chars().rev().collect();
        let target = (0..len)
            .find(|&i| {
                let origin_part = &origin[0..len - i];
                let rev_part = &rev[i..len];
                rev_part == origin_part
            })
            .expect("it won't happen");
        let mut result = rev;
        result.push_str(&origin[len - target..len]);
        result

    }
}