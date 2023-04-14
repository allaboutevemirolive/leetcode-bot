// https://leetcode.com/problems/orderly-queue/solutions/2784994/rust-9-lines-100-runtime-and-memory-easy/
impl Solution {
    pub fn orderly_queue(mut s: String, k: i32) -> String {
        let mut s = s.into_bytes();
        if k == 1 {
            let n = s.len();
            let ss: Vec<_> = s.iter().chain(s.iter()).copied().collect();
            let min_i = ss.windows(n).enumerate().min_by_key(|p| p.1).unwrap().0;
            s.rotate_left(min_i);
        } else {
            s.sort_unstable();
        }
        String::from_utf8(s).unwrap()
    }
}