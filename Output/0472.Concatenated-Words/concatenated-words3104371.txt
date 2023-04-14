// https://leetcode.com/problems/concatenated-words/solutions/3104371/rust-dp-solution/
use std::collections::HashSet;

impl Solution {
    pub fn find_all_concatenated_words_in_a_dict(words: Vec<String>) -> Vec<String> {
        let mut set = std::collections::HashSet::new();

        words.iter().for_each(|word| { set.insert(word); });

        words.iter()
            .fold(Vec::new(), |mut res, word| {
                match Self::can_break(word, &set) {
                    true => res.push(word.clone()),
                    _ => {}
                }

                res
            })
    }

    fn can_break(word: &String, set: &HashSet<&String>) -> bool {
        let n = word.len();
        let mut f = vec![false; n + 1];

        f[0] = true;

        for i in 1..n + 1 {
            for j in 0..i {
                if j == 0 && i == n {
                    continue;
                }

                if set.contains(&word[j..i].to_string()) {
                    f[i] |= f[j];
                }
            }
        }

        f[n]
    }
}