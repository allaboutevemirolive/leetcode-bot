// https://leetcode.com/problems/edit-distance/solutions/1308373/rust-0m2/
impl Solution {
    pub fn min_distance(word1: String, word2: String) -> i32 {
        let len1 = word1.len();
        let len2 = word2.len();
        if len1 == 0 || len2 == 0 { return (len1 | len2) as i32; };

        let mut a = vec![vec![0i32; (len2 + 1) as usize]; (len1 + 1) as usize];
        for i in 0..=len1 {
            for j in 0..=len2 {
                a[i][j] = if i == 0 || j == 0 {
                    (j | i) as i32
                } else if word1.as_bytes()[i - 1] == word2.as_bytes()[j - 1] {
                    a[i - 1][j - 1]
                } else {
                    // insert, delete or replace
                    1 + a[i - 1][j - 1].min(a[i - 1][j].min(a[i][j - 1]))
                }
            }
        }
        return a[len1][len2];
    }
}