// https://leetcode.com/problems/orderly-queue/solutions/2784414/rust-sort-or-rotate-with-comments/
impl Solution {
    pub fn orderly_queue(s: String, k: i32) -> String {
        let mut s = s.as_bytes().to_vec();
        if k > 1 {
            s.sort_unstable();
        } else {
            let i = (0..s.len()).min_by(|i, j|
                s.iter().skip(*i).chain(s.iter().take(*i)).cmp(s.iter().skip(*j).chain(s.iter().take(*j)))).unwrap();
            s = s.iter().skip(i).chain(s.iter().take(i)).copied().collect::<Vec<_>>();
        }
        s.into_iter().map(|b| b as char).collect()
    }
}