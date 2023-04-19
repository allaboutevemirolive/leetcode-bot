// https://leetcode.com/problems/shortest-palindrome/solutions/237971/rust-o-n-2-brute-force/
impl Solution {
    pub fn shortest_palindrome(s: String) -> String {
        let n = s.len();
        let t = s.chars().rev().collect::<String>();

        for i in 0..n {
            if s.chars().take(n - i).collect::<String>() == t.chars().skip(i).take(n-i).collect::<String>() {
                return t.chars().take(i).collect::<String>() + &s
            }
        }
        "".to_string()
    }
}
