// https://leetcode.com/problems/orderly-queue/solutions/2783633/rust-0ms-solution/
impl Solution {
    pub fn orderly_queue(s: String, k: i32) -> String {
        let mut s: Vec<char> = s.chars().collect();
        if k > 1 {
            s.sort_unstable();
            return s.iter().collect::<String>();
        }
        let mut min = s.clone();
        for _ in 0..s.len() {
            s.rotate_left(1);
            if s < min {
                min = s.clone();
            }
        }
        min.iter().collect::<String>()
    }
}