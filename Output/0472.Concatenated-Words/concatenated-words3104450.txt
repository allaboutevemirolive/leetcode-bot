// https://leetcode.com/problems/concatenated-words/solutions/3104450/recursive-rust-with-hashset/
use std::collections::HashSet;

impl Solution {
    fn solve_word<'a, 'b>(
            index: usize,  
            visited: &'a HashSet<&'b str>,
            word: &'b str,
        ) -> bool {
        for e in (index+1)..(word.len()) {
            if visited.contains(&&word[index..e]) {
                if Self::solve_word(e, visited, word) {
                    return true;
                }
            }    
        }
        index > 0 && visited.contains(&word[index..])
    }

    pub fn find_all_concatenated_words_in_a_dict(mut words: Vec<String>) -> Vec<String> {
        words.sort_by_key(|w| w.as_bytes().len());
        words.iter().scan(HashSet::new(), |mut state, w| {
            let r = match Self::solve_word(0, state, w.as_str()) {
                true => Some(Some(w.clone())),
                _ => Some(None)
            };
            state.insert(w.as_str());
            r
        }).flatten().collect()
    }
}