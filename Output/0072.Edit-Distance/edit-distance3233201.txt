// https://leetcode.com/problems/edit-distance/solutions/3233201/rust-bottom-up-2-solutions-with-1d-dp-array/
impl Solution {
    pub fn min_distance(word1: String, word2: String) -> i32 {
        let (n, m) = (word1.len(), word2.len());
        let (w1, w2) = (word1.as_bytes(), word2.as_bytes());
        let mut prev = vec![0; m + 1];
        let mut curr = prev.clone();
        for i in 1..=m {
            curr[i] = i as i32;
        }

        for i in 1..=n {
            std::mem::swap(&mut prev, &mut curr);
            curr[0] = i as i32;

            for j in 1..=m {
                if w1[i - 1] == w2[j - 1] {
                    curr[j] = prev[j - 1];
                } else {
                    curr[j] = 1 + prev[j].min(prev[j - 1].min(curr[j - 1]));
                }
            }
        }

        curr[m]
    }
}