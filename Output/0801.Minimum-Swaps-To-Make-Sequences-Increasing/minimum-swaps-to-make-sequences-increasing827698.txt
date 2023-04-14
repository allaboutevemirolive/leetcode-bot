// https://leetcode.com/problems/minimum-swaps-to-make-sequences-increasing/solutions/827698/rust-translated-0ms-100/
impl Solution {
    pub fn min_swap(a: Vec<i32>, b: Vec<i32>) -> i32 {
        let n  = a.len();
        let mut  n1 = 0; let mut s1 = 1;
        for i in 1..n {
            let mut n2 = std::i32::MAX; let mut s2 = std::i32::MAX;
            if a[i-1] < a[i] && b[i-1] < b[i] {
                n2 = std::cmp::min(n2, n1);
                s2 = std::cmp::min(s2, s1 + 1);
            }
            if a[i-1] < b[i] && b[i-1] < a[i] {
                n2 = std::cmp::min(n2, s1);
                s2 = std::cmp::min(s2, n1 + 1);
            }
            n1 = n2;
            s1 = s2;
        }
        std::cmp::min(n1, s1)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_min_swap() {
        assert_eq!(Solution::min_swap(vec![1,3,5,4], vec![1,2,3,7]), 1)
    }
}