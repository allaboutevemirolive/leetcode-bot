// https://leetcode.com/problems/edit-distance/solutions/3233057/rust-dp-edit-distance/
impl Solution {
    pub fn min_distance(word1: String, word2: String) -> i32 {
        let mut res = vec![vec![0; word2.len() + 1]; word1.len() + 1];

        for i in 0..word1.len() + 1 {
            res[i][0] = i;
        }
        for i in 0..word2.len() + 1 {
            res[0][i] = i;
        }

        for (i, c1) in word1.char_indices() {
            for (j, c2) in word2.char_indices() {
                if c1 == c2 {
                    res[i + 1][j + 1] = res[i][j];
                } else {
                    res[i + 1][j + 1] = std::cmp::min(res[i][j], std::cmp::min(res[i + 1][j], res[i][j + 1])) + 1;
                }
            }
        }

        res[word1.len()][word2.len()] as i32
    }
}