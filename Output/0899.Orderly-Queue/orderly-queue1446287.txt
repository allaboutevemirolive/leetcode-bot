// https://leetcode.com/problems/orderly-queue/solutions/1446287/rust-solution/
impl Solution {
    pub fn orderly_queue(s: String, k: i32) -> String {
        if k == 1 {
            let ss = s.chars().chain(s.chars()).collect::<Vec<_>>();
            let mut v = ss.windows(s.len()).collect::<Vec<_>>();
            v.sort();
            v[0].iter().copied().collect()
        } else {
            let mut v = s.chars().collect::<Vec<_>>();
            v.sort();
            v.iter().collect()
        }
    }
}