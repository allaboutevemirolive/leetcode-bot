// https://leetcode.com/problems/max-chunks-to-make-sorted-ii/solutions/1627562/short-ruby-solution-0ms-rust-port/
impl Solution {
    pub fn max_chunks_to_sorted(arr: Vec<i32>) -> i32 {
        arr.iter()
            .rev()
            .scan(i32::MAX, |t, &x| {
                *t = (*t).min(x);
                Some(*t)
            })
            .collect::<Vec<_>>()
            .iter()
            .rev()
            .skip(1)
            .chain(std::iter::once(&i32::MAX))
            .zip(arr.iter())
            .scan(i32::MIN, |t, (&y, &x)| {
                *t = (*t).max(x);
                Some(*t <= y)
            })
            .filter(|&x| x)
            .count() as i32
    }
}