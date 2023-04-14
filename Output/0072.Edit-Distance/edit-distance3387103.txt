// https://leetcode.com/problems/edit-distance/solutions/3387103/rust-solultion-dp/
impl Solution {
    pub fn min_distance(word1: String, word2: String) -> i32 {
        let mut m1: Vec<char> = vec!['#'];
        m1.extend(word1.chars().collect::<Vec<char>>());
        let mut m2: Vec<char> = vec!['#'];
        m2.extend(word2.chars().collect::<Vec<char>>());
        let mut m = vec![vec![0; m2.len()]; m1.len()];
        m[0][0] = 0;
        for i in 1..=m1.len() - 1 {
            m[i][0] = i;
        }

        for j in 1..=m2.len() - 1 {
            m[0][j] = j;
        }
        for r in 1..m1.len() {
            for c in 1..m2.len() {
                let min3 = if m1[r] == m2[c] { 0 } else { 1 };
                m[r][c] = (m[r - 1][c] + 1)
                    .min(m[r][c - 1] + 1)
                    .min(m[r - 1][c - 1] + min3);
            }
        }
        m[m1.len() - 1][m2.len() - 1] as i32
    }
}