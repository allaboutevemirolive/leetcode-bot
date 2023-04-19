// https://leetcode.com/problems/word-ladder/solutions/1764855/rust-simple/
use std::collections::VecDeque;

impl Solution {
    fn distance(word1: &[char], word2: &[char]) -> bool {
        let len = word1.len();
        let mut dist = 0;
        for i in 0..len {
            if word1[i] != word2[i] {
                dist += 1;
            }
            if dist > 1 {
                return false;
            }
        }
        true
    }
    pub fn ladder_length(begin_word: String, end_word: String, word_list: Vec<String>) -> i32 {
        let mut word_list: Vec<Vec<char>> = word_list
            .iter()
            .map(|chars| chars.chars().collect::<Vec<char>>())
            .collect();
        let mut queue = VecDeque::new();
        queue.push_back(begin_word.chars().collect());
        let mut count = 1;
        while !queue.is_empty() {
            let targets = queue.clone();
            queue.clear();
            if targets.contains(&end_word.chars().collect::<Vec<char>>()) {
                return count;
            }
            for target in targets.iter() {
                let mut w = 0;
                while w < word_list.len() {
                    let word = word_list[w].clone();
                    if Self::distance(target, &word) {
                        word_list.remove(w);
                        queue.push_front(word);
                        continue;
                    }
                    w += 1;
                }
            }
            count += 1;
        }
        0
    }
}