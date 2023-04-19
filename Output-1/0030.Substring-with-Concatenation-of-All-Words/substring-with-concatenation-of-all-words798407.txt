// https://leetcode.com/problems/substring-with-concatenation-of-all-words/solutions/798407/rust-functional-programming-solution/
use std::collections::HashMap;

impl Solution {
    pub fn find_substring(s: String, words: Vec<String>) -> Vec<i32> {
        if words.len() == 0 || s.len() < words.len() * words[0].len() {
            return vec![];
        }

        let length = words.len() * words[0].len();
        let map = words
            .iter()
            .fold(HashMap::<&str, i32>::new(), |mut state, word| {
                *state.entry(word).or_insert(0) += 1;
                state
            });

        (0..=(s.len() - length))
            .filter(|index| is_permutation(&s[*index..(*index + length)], &map, &words))
            .map(|index| index as i32)
            .collect()
    }
}

fn is_permutation(slice: &str, map: &HashMap<&str, i32>, words: &[String]) -> bool {
    let mut new_map = HashMap::new();
    let length = words[0].len();

    for i in (0..slice.len()).step_by(length) {
        let word = &slice[i..(i + length)];
        *new_map.entry(word).or_insert(0) += 1;

        if new_map.get(word) > map.get(word) {
            return false;
        }
    }

    true
}