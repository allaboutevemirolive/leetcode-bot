// https://leetcode.com/problems/edit-distance/solutions/3231463/go-rust-dp/
impl Solution {
    pub fn min_distance(word1: String, word2: String) -> i32 {
        match (word1.len(), word2.len()) {
            (0, l) | (l, 0) => l as i32,
            (_, l2) => word1
                .bytes()
                .enumerate()
                .fold(Vec::new(), |last, (i, b1)| {
                    word2
                        .bytes()
                        .enumerate()
                        .fold(vec![0; l2], |mut ed, (j, b2)| {
                            ed[j] = match b1 == b2 {
                                true => match (i, j) {
                                    (0, a) | (a, 0) => a as i32,
                                    (_, j) => last[j - 1],
                                },
                                false => match (i, j) {
                                    (0, 0) => 1,
                                    (0, j) => ed[j - 1] + 1,
                                    (_, 0) => last[j] + 1,
                                    (_, j) => {
                                        i32::min(i32::min(last[j], last[j - 1]), ed[j - 1]) + 1
                                    }
                                },
                            };
                            ed
                        })
                })
                .last()
                .map(|&v| v)
                .unwrap(),
        }
    }
}