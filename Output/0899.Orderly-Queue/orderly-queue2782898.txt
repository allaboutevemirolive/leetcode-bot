// https://leetcode.com/problems/orderly-queue/solutions/2782898/yet-another-rust-solution/
impl Solution {
    pub fn orderly_queue(s: String, k: i32) -> String {
        if k == 1 {
            let mut v: Vec<usize> = (0..s.len()).collect();
            v.sort_unstable_by_key(|&i| s[i..].to_owned() + &s[..i]);
            s[v[0]..].to_owned() + &s[..v[0]]
        }
        else {
            let mut v: Vec<char> = s.chars().collect();
            v.sort_unstable();
            v.into_iter().collect()
        }
    }
}