// https://leetcode.com/problems/word-search-ii/solutions/2234495/rust-organized-trie-and-recursion-o-n-words-length/
use std::collections::{HashMap, HashSet};

impl Solution {
    pub fn find_words(
        board: Vec<Vec<char>>,
        words: Vec<String>,
    ) -> Vec<String> {
        let lines = board.len();
        let columns = board[0].len();

        let mut word_buffer = String::new();
        let mut visited = vec![vec![false; columns]; lines];
        let mut answer = HashSet::new();

        let trie = create_trie(&words);

        for i in 0..lines {
            for j in 0..columns {
                Self::recursive_find_words(
                    &board,
                    i,
                    j,
                    &trie,
                    &mut visited,
                    &mut word_buffer,
                    &mut answer,
                );
            }
        }

        answer.into_iter().collect()
    }

    fn recursive_find_words(
        board: &Vec<Vec<char>>,
        i: usize,
        j: usize,
        trie: &WordTrie,
        visited: &mut Vec<Vec<bool>>,
        word_buffer: &mut String,
        answer: &mut HashSet<String>,
    ) {
        // Get cell checking if `i` is inside of boundaries
        let cell = match board.get(i).and_then(|line| line.get(j)).copied() {
            Some(cell) => cell,
            None => return,
        };

        // If it was already visited, avoid infinite loops
        if visited[i][j] {
            return;
        }

        // Advance the trie
        let trie = match trie.trie.get(&cell) {
            Some(trie) => trie,
            None => return,
        };

        word_buffer.push(cell);
        visited[i][j] = true;

        {
            if trie.is_end {
                answer.insert(word_buffer.clone());
            }

            let indices = [
                (i + 1, j),
                (i - 1, j),
                (i, j + 1),
                (i, j - 1)
            ];

            for (i, j) in indices {
                Self::recursive_find_words(
                    &board,
                    i,
                    j,
                    &trie,
                    visited,
                    word_buffer,
                    answer,
                );
            }
        }

        word_buffer.pop();
        visited[i][j] = false;
    }
}

#[derive(Default, Debug)]
struct WordTrie {
    trie: HashMap<char, WordTrie>,
    is_end: bool,
}

impl WordTrie {
    pub fn insert(&mut self, word: &str) {
        let mut current = self;

        for component in word.chars() {
            current = current
                .trie
                .entry(component)
                .or_insert_with(Default::default)
        }

        current.is_end = true;
    }
}

fn create_trie(words: &[String]) -> WordTrie {
    let mut trie = WordTrie::default();

    words
        .into_iter()
        .map(AsRef::as_ref)
        .for_each(|word| trie.insert(word));

    trie
}