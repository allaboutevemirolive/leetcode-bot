// https://leetcode.com/problems/word-ladder/solutions/3123478/rust-not-efficient/
use std::collections::{HashSet, VecDeque};
impl Solution {
    pub fn ladder_length(begin_word: String, end_word: String, word_list: Vec<String>) -> i32 {
        let begin_word = begin_word.as_bytes().to_vec();
        let end_word = end_word.as_bytes().to_vec();

        let word_list: Vec<Vec<u8>> = word_list
            .iter()
            .map(|word| word.chars().map(|chr| chr as u8).collect())
            .collect();

        let mut queue: VecDeque<Vec<Vec<u8>>> = VecDeque::new();
        queue.push_back(vec![begin_word.clone()]);

        let mut visited: HashSet<Vec<u8>> = HashSet::new();
        visited.insert(begin_word);

        while queue.len() > 0 {
            let path = queue.pop_front().unwrap();
            let last_word = &path[path.len() - 1];

            if last_word == &end_word {
                return path.len() as i32;
            }

            let valid_words = Self::valid_words(last_word, &word_list);
            for word in valid_words {
                if !visited.contains(&word) {
                    visited.insert(word.clone());

                    let mut path = path.clone();
                    path.push(word.clone());

                    queue.push_back(path);
                }
            }
        }

        0
    }

    fn valid_words(word: &Vec<u8>, word_list: &Vec<Vec<u8>>) -> Vec<Vec<u8>> {
        let mut valid_moves = vec![];

        for other_word in word_list {
            let off_by_only_one = word
                .iter()
                .zip(other_word.iter())
                .filter(|(a, b)| a != b)
                .count()
                == 1;

            if off_by_only_one {
                valid_moves.push(other_word.clone());
            }
        }
        valid_moves
    }
}